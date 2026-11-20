
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — SECURE STRIPE CHECKOUT
   Checkout Creation + Payment Verification
   Old Session Protection + LAN Return URL Fix
===================================================== */

const Stripe = require("stripe");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");

let stripeInstance = null;

// ==========================================
// STRIPE INITIALIZATION
// ==========================================

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || !secretKey.trim()) {
    throw new Error("STRIPE_SECRET_KEY is missing in .env");
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey.trim());
  }

  return stripeInstance;
};

// ==========================================
// RESPONSE HELPERS
// ==========================================

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    paid: false,
    message,
  });
};

const sendServerError = (res, error, context) => {
  console.error(`GLOWAURA ${context} ERROR:`, error);

  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again."
      : error.message || "Internal server error.";

  return sendError(res, 500, message);
};

// ==========================================
// USER HELPERS
// ==========================================

const getLoggedInUserId = (req) => {
  const user = req.user;

  const id = user?._id || user?.id || user?.userId;

  if (!id || !mongoose.Types.ObjectId.isValid(String(id))) {
    return null;
  }

  return String(id);
};

const getBookingUserId = (booking) => {
  const user = booking?.user || booking?.userId;

  if (!user) {
    return null;
  }

  return String(user._id || user.id || user);
};

const isBookingOwner = (booking, userId) => {
  return getBookingUserId(booking) === String(userId);
};

// ==========================================
// BOOKING AMOUNT HELPER
// ==========================================

const getBookingAmountInPaise = (booking) => {
  const amount = Number(booking.price);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("A valid booking price was not found.");
  }

  const paise = Math.round(amount * 100);

  if (!Number.isSafeInteger(paise) || paise <= 0) {
    throw new Error("Invalid booking payment amount.");
  }

  return paise;
};

// ==========================================
// APP RETURN URL VALIDATION
// ==========================================

const isValidAppReturnUrl = (appUrl, bookingId) => {
  if (!appUrl || !(appUrl instanceof URL)) {
    return false;
  }

  const allowedProtocols = [
    "exp:",
    "exps:",
    "glowaura:",
  ];

  if (!allowedProtocols.includes(appUrl.protocol)) {
    return false;
  }

  if (appUrl.username || appUrl.password) {
    return false;
  }

  let paths = [];

  try {
    paths = [
      appUrl.pathname,
      `/${appUrl.host}${appUrl.pathname}`,
      `${appUrl.host}${appUrl.pathname}`,
    ].map((path) =>
      decodeURIComponent(String(path || ""))
        .replace(/^\/+/, "")
        .replace(/\/+$/, "")
    );
  } catch {
    return false;
  }

  const id = String(bookingId);

  const allowedPaths = [
    `payment/verify/${id}`,
    `--/payment/verify/${id}`,
    `verify/${id}`,
  ];

  return paths.some((path) => allowedPaths.includes(path));
};

// ==========================================
// STRIPE RETURN URL GENERATOR
// ==========================================

const getReturnUrls = (bookingId, appReturnUrl) => {
  const baseUrl = String(
    process.env.STRIPE_RETURN_BASE_URL || ""
  )
    .trim()
    .replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error(
      "STRIPE_RETURN_BASE_URL is missing in .env."
    );
  }

  let base;
  let appUrl;

  try {
    base = new URL(baseUrl);
    appUrl = new URL(appReturnUrl);
  } catch {
    throw new Error("Invalid payment return URL.");
  }

  const isPrivateLan =
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(base.hostname) ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(base.hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(
      base.hostname
    );

  const isLocalHost = [
    "localhost",
    "127.0.0.1",
    "::1",
  ].includes(base.hostname);

  const allowedLocalHttp =
    process.env.NODE_ENV !== "production" &&
    base.protocol === "http:" &&
    (isLocalHost || isPrivateLan);

  if (
    base.protocol !== "https:" &&
    !allowedLocalHttp
  ) {
    throw new Error(
      "Use HTTPS for production or localhost/private LAN HTTP during development."
    );
  }

  if (!isValidAppReturnUrl(appUrl, bookingId)) {
    throw new Error("Invalid GlowAura app return URL.");
  }

  if (
    appUrl.searchParams.has("sessionId") ||
    appUrl.searchParams.has("session_id")
  ) {
    throw new Error(
      "App return URL must not contain a Stripe session ID."
    );
  }

  const successUrl = new URL(
    "/payment-success",
    base.origin
  );

  successUrl.searchParams.set(
    "booking_id",
    String(bookingId)
  );

  successUrl.searchParams.set(
    "app_return_url",
    appReturnUrl
  );

  // Stripe replaces this placeholder after checkout.
  const successUrlString =
    `${successUrl.toString()}&session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl = new URL(
    "/payment-cancel",
    base.origin
  );

  cancelUrl.searchParams.set(
    "booking_id",
    String(bookingId)
  );

  cancelUrl.searchParams.set(
    "app_return_url",
    appReturnUrl
  );

  return {
    successUrl: successUrlString,
    cancelUrl: cancelUrl.toString(),
  };
};

// ==========================================
// STRIPE SESSION OWNERSHIP VALIDATION
// ==========================================

const validateStripeSessionOwnership = (
  session,
  booking,
  userId
) => {
  return (
    session.metadata?.bookingId === String(booking._id) &&
    session.metadata?.userId === String(userId) &&
    String(session.client_reference_id || "") ===
      String(booking._id)
  );
};

// ==========================================
// CREATE STRIPE CHECKOUT SESSION
// POST /api/payments/create-checkout
// ==========================================

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return sendError(res, 401, "Please login first.");
    }

    const {
      bookingId,
      appReturnUrl,
    } = req.body || {};

    if (!bookingId || !appReturnUrl) {
      return sendError(
        res,
        400,
        "Booking ID and app return URL are required."
      );
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    if (!isBookingOwner(booking, userId)) {
      return sendError(
        res,
        403,
        "You cannot pay for this booking."
      );
    }

    if (booking.paymentStatus === "paid") {
      return res.status(409).json({
        success: false,
        paid: true,
        message: "This booking has already been paid.",
      });
    }

    if (booking.paymentStatus === "refunded") {
      return sendError(
        res,
        409,
        "This booking has already been refunded."
      );
    }

    if (
      String(booking.status).toLowerCase() === "cancelled"
    ) {
      return sendError(
        res,
        400,
        "Cancelled booking cannot be paid."
      );
    }

    if (
      String(booking.status).toLowerCase() !== "pending"
    ) {
      return sendError(
        res,
        409,
        "Only pending bookings can start a payment."
      );
    }

    const amount = getBookingAmountInPaise(booking);

    const {
      successUrl,
      cancelUrl,
    } = getReturnUrls(booking._id, appReturnUrl);

    const stripe = getStripe();

    // ======================================
    // CHECK PREVIOUS CHECKOUT SESSION
    // ======================================

    if (booking.stripeCheckoutSessionId) {
      let oldSession = null;

      try {
        oldSession =
          await stripe.checkout.sessions.retrieve(
            booking.stripeCheckoutSessionId
          );
      } catch (error) {
        if (error?.code !== "resource_missing") {
          throw error;
        }

        console.log(
          "Previous Stripe session not found. Creating a new session."
        );
      }

      if (oldSession) {
        // Payment already received by Stripe.
        if (oldSession.payment_status === "paid") {
          return res.status(409).json({
            success: false,
            paid: true,
            sessionId: oldSession.id,
            message:
              "Payment has already been received. Verify the existing payment.",
          });
        }

        // Check whether saved session has current return URLs.
        const sameReturnUrls =
          oldSession.success_url === successUrl &&
          oldSession.cancel_url === cancelUrl;

        // Reuse only a matching open session.
        if (
          oldSession.status === "open" &&
          oldSession.url &&
          sameReturnUrls
        ) {
          return res.status(200).json({
            success: true,
            paid: false,
            reused: true,
            checkoutUrl: oldSession.url,
            sessionId: oldSession.id,
            message:
              "Existing Stripe Checkout Session is ready.",
          });
        }

        // Expire outdated open sessions.
        if (oldSession.status === "open") {
          console.log(
            "Expiring old Checkout Session: return URLs are outdated or do not match."
          );

          await stripe.checkout.sessions.expire(
            oldSession.id
          );
        }

        // Do not create another session while payment
        // is completed but not yet marked paid.
        if (oldSession.status === "complete") {
          return res.status(409).json({
            success: false,
            paid: false,
            sessionId: oldSession.id,
            sessionStatus: oldSession.status,
            paymentStatus: oldSession.payment_status,
            message:
              "Your previous payment is still processing. Please verify its status.",
          });
        }
      }

      // Clear missing, expired or replaced session.
      booking.stripeCheckoutSessionId = null;
      await booking.save();
    }

    // ======================================
    // CREATE NEW CHECKOUT SESSION
    // ======================================

    const bookingVersion = booking.updatedAt
      ? new Date(booking.updatedAt).getTime()
      : new Date(booking.createdAt).getTime();

    const idempotencyKey =
      `glowaura-checkout-${String(booking._id)}-${bookingVersion}`;

    const session =
      await stripe.checkout.sessions.create(
        {
          mode: "payment",

          line_items: [
            {
              price_data: {
                currency: "inr",

                product_data: {
                  name:
                    booking.serviceName ||
                    "GlowAura Booking",

                  description:
                    booking.category ||
                    "Beauty appointment",
                },

                unit_amount: amount,
              },

              quantity: 1,
            },
          ],

          success_url: successUrl,
          cancel_url: cancelUrl,

          client_reference_id: String(booking._id),

          metadata: {
            bookingId: String(booking._id),
            userId: String(userId),
          },

          payment_intent_data: {
            metadata: {
              bookingId: String(booking._id),
              userId: String(userId),
            },
          },
        },
        {
          idempotencyKey,
        }
      );

    if (!session.url) {
      throw new Error(
        "Stripe did not return a Checkout URL."
      );
    }

    // Save session against booking.
    booking.stripeCheckoutSessionId = session.id;
    booking.paymentCurrency = "inr";

    await booking.save();

    console.log("====================================");
    console.log("GLOWAURA STRIPE CHECKOUT CREATED");
    console.log("BOOKING:", String(booking._id));
    console.log("SESSION:", session.id);
    console.log("AMOUNT IN PAISE:", amount);
    console.log("CURRENCY: INR");
    console.log("SUCCESS URL:", new URL(successUrl).origin);
    console.log("====================================");

    return res.status(201).json({
      success: true,
      paid: false,
      checkoutUrl: session.url,
      sessionId: session.id,
      message:
        "Stripe Checkout created successfully.",
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "CREATE CHECKOUT"
    );
  }
};

// ==========================================
// VERIFY STRIPE CHECKOUT SESSION
// POST /api/payments/verify-checkout
// ==========================================

exports.verifyCheckoutSession = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return sendError(res, 401, "Please login first.");
    }

    const {
      bookingId,
      sessionId,
    } = req.body || {};

    if (!bookingId || !sessionId) {
      return sendError(
        res,
        400,
        "Booking ID and Stripe session ID are required."
      );
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    if (
      !/^cs_(test|live)_[a-zA-Z0-9_]+$/.test(
        String(sessionId)
      )
    ) {
      return sendError(
        res,
        400,
        "Invalid Stripe Checkout Session ID."
      );
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    if (!isBookingOwner(booking, userId)) {
      return sendError(
        res,
        403,
        "You cannot verify this booking."
      );
    }

    if (
      String(booking.stripeCheckoutSessionId || "") !==
      String(sessionId)
    ) {
      return sendError(
        res,
        400,
        "Stripe session does not match this booking."
      );
    }

    const stripe = getStripe();

    // Retrieve real session directly from Stripe.
    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: ["payment_intent"],
        }
      );

    // ======================================
    // VERIFY SESSION OWNERSHIP
    // ======================================

    if (
      !validateStripeSessionOwnership(
        session,
        booking,
        userId
      )
    ) {
      return sendError(
        res,
        400,
        "Payment session details do not match this booking."
      );
    }

    if (session.mode !== "payment") {
      return sendError(
        res,
        400,
        "Invalid Stripe payment mode."
      );
    }

    // ======================================
    // VERIFY PAYMENT STATUS
    // ======================================

    if (
      session.status !== "complete" ||
      session.payment_status !== "paid"
    ) {
      return res.status(200).json({
        success: false,
        paid: false,
        sessionStatus: session.status,
        paymentStatus: session.payment_status,
        message:
          "Stripe has not confirmed this payment yet.",
      });
    }

    // ======================================
    // VERIFY AMOUNT AND CURRENCY
    // ======================================

    const expectedAmount =
      getBookingAmountInPaise(booking);

    if (
      session.amount_total !== expectedAmount ||
      String(session.currency).toLowerCase() !== "inr"
    ) {
      return sendError(
        res,
        400,
        "Payment amount or currency does not match the booking."
      );
    }

    // ======================================
    // VERIFY PAYMENT INTENT
    // ======================================

    const paymentIntent = session.payment_intent;

    if (
      !paymentIntent ||
      typeof paymentIntent === "string"
    ) {
      return sendError(
        res,
        409,
        "Stripe payment details are not available yet."
      );
    }

    if (paymentIntent.status !== "succeeded") {
      return res.status(200).json({
        success: false,
        paid: false,
        paymentStatus: session.payment_status,
        paymentIntentStatus: paymentIntent.status,
        message:
          "The Stripe payment has not succeeded yet.",
      });
    }

    if (
      paymentIntent.metadata?.bookingId !==
        String(booking._id) ||
      paymentIntent.metadata?.userId !==
        String(userId)
    ) {
      return sendError(
        res,
        400,
        "Payment Intent does not belong to this booking."
      );
    }

    // ======================================
    // SAVE VERIFIED PAYMENT
    // ======================================

    booking.paymentStatus = "paid";
    booking.paymentCurrency = "inr";
    booking.paymentIntentId = paymentIntent.id;

    const isCancelled = [
      "cancelled",
      "canceled",
    ].includes(
      String(booking.status || "").toLowerCase()
    );

    if (!isCancelled) {
      booking.status = "confirmed";
    }

    await booking.save();

    console.log("====================================");
    console.log("GLOWAURA PAYMENT VERIFIED");
    console.log("BOOKING:", String(booking._id));
    console.log("SESSION:", session.id);
    console.log("PAYMENT INTENT:", paymentIntent.id);
    console.log("AMOUNT:", session.amount_total);
    console.log("CURRENCY:", session.currency);
    console.log("BOOKING STATUS:", booking.status);
    console.log("PAYMENT STATUS:", booking.paymentStatus);
    console.log("====================================");

    return res.status(200).json({
      success: true,
      paid: true,
      paymentStatus: "paid",
      sessionStatus: "complete",

      message: isCancelled
        ? "Payment received, but this booking is cancelled. Please contact GlowAura support."
        : "Payment verified successfully.",

      booking,
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "VERIFY CHECKOUT"
    );
  }
};
