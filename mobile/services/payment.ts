
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — COMPLETE STRIPE PAYMENT API SERVICE */

import {
  apiRequest,
  ApiRequestError,
} from "./api";

import { getAuthToken } from "./auth";

// ==========================================
// TYPES
// ==========================================

export interface CreateCheckoutResponse {
  success?: boolean;
  paid?: boolean;
  message?: string;
  sessionId?: string;
  checkoutUrl?: string;
  url?: string;
  session?: {
    id?: string;
    url?: string;
  };
  data?: any;
}

export interface VerifyPaymentResponse {
  success?: boolean;
  paid?: boolean;
  failed?: boolean;
  paymentFailed?: boolean;
  message?: string;
  paymentStatus?: string;
  sessionStatus?: string;
  booking?: any;
  amount?: number;
  paymentAmount?: number;
  serviceName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  data?: any;
}

// ==========================================
// AUTH TOKEN HELPER
// ==========================================

async function getRequiredAuthToken(): Promise<string> {
  try {
    const token = await getAuthToken();

    if (
      !token ||
      typeof token !== "string" ||
      !token.trim()
    ) {
      throw new Error("Please login first.");
    }

    return token.trim();
  } catch (error: any) {
    throw new Error(
      error?.message ||
      "Authentication failed. Please login again."
    );
  }
}

// ==========================================
// VALIDATION HELPERS
// ==========================================

function validateBookingId(bookingId: string): void {
  if (!/^[a-fA-F0-9]{24}$/.test(bookingId)) {
    throw new Error("Invalid booking ID.");
  }
}

function validateSessionId(sessionId: string): void {
  if (!/^cs_(test|live)_[a-zA-Z0-9_]+$/.test(sessionId)) {
    throw new Error("Invalid Stripe session ID.");
  }
}

function validateReturnUrl(returnUrl: string): void {
  const supportedProtocols =
    /^(https?:\/\/|glowaura:\/\/|exp:\/\/|exps:\/\/)/i;

  if (!supportedProtocols.test(returnUrl)) {
    throw new Error(
      "Invalid payment return URL. Expo Go and HTTPS URLs are supported."
    );
  }

  if (/\s/.test(returnUrl)) {
    throw new Error("Payment return URL contains invalid spaces.");
  }
}

// ==========================================
// RESPONSE NORMALIZATION
// ==========================================

function unwrapResponse(result: any): any {
  let response = result;

  for (let i = 0; i < 3; i++) {
    if (
      response?.data &&
      typeof response.data === "object" &&
      !Array.isArray(response.data)
    ) {
      response = {
        ...response,
        ...response.data,
      };

      // Keep the original nested booking/data fields.
      if (response.data?.booking && !response.booking) {
        response.booking = response.data.booking;
      }
    } else {
      break;
    }
  }

  return response;
}

function normalizeCheckoutResponse(
  result: any
): CreateCheckoutResponse {
  const response = unwrapResponse(result);

  const sessionId =
    response?.sessionId ||
    response?.session?.id ||
    response?.id;

  const checkoutUrl =
    response?.checkoutUrl ||
    response?.session?.url ||
    response?.url;

  return {
    ...response,
    success: response?.success,
    paid: response?.paid,
    message: response?.message,
    sessionId: sessionId ? String(sessionId) : undefined,
    checkoutUrl: checkoutUrl ? String(checkoutUrl) : undefined,
  };
}

function normalizeVerifyResponse(
  result: any
): VerifyPaymentResponse {
  const response = unwrapResponse(result);

  return {
    ...response,
    success: response?.success,
    paid: response?.paid,
    failed: response?.failed,
    paymentFailed: response?.paymentFailed,
    paymentStatus: response?.paymentStatus,
    sessionStatus: response?.sessionStatus,
    booking:
      response?.booking ||
      response?.data?.booking,
  };
}

// ==========================================
// CREATE STRIPE CHECKOUT SESSION
// ==========================================

export async function createCheckoutSession(
  bookingId: string,
  appReturnUrl: string
): Promise<CreateCheckoutResponse> {
  try {
    const token = await getRequiredAuthToken();

    const cleanBookingId = String(bookingId || "").trim();
    const cleanReturnUrl = String(appReturnUrl || "").trim();

    validateBookingId(cleanBookingId);

    if (!cleanReturnUrl) {
      throw new Error("Payment return URL is missing.");
    }

    validateReturnUrl(cleanReturnUrl);

    const result = await apiRequest<any>(
      "/payments/create-checkout",
      "POST",
      {
        bookingId: cleanBookingId,
        appReturnUrl: cleanReturnUrl,
      },
      token
    );

    if (!result) {
      throw new Error(
        "Unable to create Stripe checkout session."
      );
    }

    const response = normalizeCheckoutResponse(result);

    if (response.paid === true) {
      throw new Error(
        "This booking is already marked as paid. Please check My Bookings."
      );
    }

    if (
      response.success !== true ||
      !response.sessionId ||
      !response.checkoutUrl
    ) {
      throw new Error(
        response.message ||
        "Stripe checkout URL or session ID is missing from the server response."
      );
    }

    validateSessionId(response.sessionId);

    if (
      !/^https:\/\/(checkout\.stripe\.com|stripe\.com)\//i.test(
        response.checkoutUrl
      )
    ) {
      throw new Error(
        "Invalid Stripe Checkout URL received from server."
      );
    }

    return response;
  } catch (error: any) {
    // Preserve meaningful server errors, including HTTP 409.
    if (error instanceof ApiRequestError) {
      const serverData = error.data || {};

      if (serverData.paid === true) {
        throw new Error(
          serverData.message ||
          "This booking is already paid. Please check My Bookings."
        );
      }
    }

    console.error(
      "GLOWAURA CREATE CHECKOUT ERROR:",
      error?.message || "Unknown error"
    );

    throw new Error(
      error?.message ||
      "Unable to start payment. Please try again."
    );
  }
}

// ==========================================
// VERIFY STRIPE CHECKOUT SESSION
// ==========================================

export async function verifyCheckoutSession(
  bookingId: string,
  sessionId: string
): Promise<VerifyPaymentResponse> {
  try {
    const token = await getRequiredAuthToken();

    const cleanBookingId = String(bookingId || "").trim();
    const cleanSessionId = String(sessionId || "").trim();

    validateBookingId(cleanBookingId);
    validateSessionId(cleanSessionId);

    const result = await apiRequest<any>(
      "/payments/verify-checkout",
      "POST",
      {
        bookingId: cleanBookingId,
        sessionId: cleanSessionId,
      },
      token
    );

    if (!result) {
      throw new Error(
        "Payment verification server returned an empty response."
      );
    }

    const response = normalizeVerifyResponse(result);

    // Do not assume success. Backend must explicitly confirm paid.
    return response;
  } catch (error: any) {
    console.error(
      "GLOWAURA PAYMENT VERIFICATION ERROR:",
      error?.message || "Unknown error"
    );

    throw new Error(
      error?.message ||
      "Unable to verify payment. Please try again."
    );
  }
}
