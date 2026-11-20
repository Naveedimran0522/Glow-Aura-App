
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — BOOKING API SERVICE */
/* Create Booking + Availability + My Bookings + Cancel */

import { apiRequest } from "./api";
import { getAuthToken } from "./auth";

// ==========================================
// TYPES
// ==========================================

export type CreateBookingData = {
  serviceId: string;
  artistName: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
};

export type BusyInterval = {
  startTime: string;
  startMinutes: number;
  endMinutes: number;
};

export type ArtistAvailability = {
  success: boolean;
  artistName: string;
  appointmentDate: string;
  bookedSlots: string[];
  busyIntervals: BusyInterval[];
};

export type BookingResponse = {
  success?: boolean;
  message?: string;
  booking?: {
    _id?: string;
    id?: string;
    status?: string;
    [key: string]: any;
  };
  data?: any;
  [key: string]: any;
};

// ==========================================
// AUTH HELPER
// ==========================================

async function requireAuthToken(): Promise<string> {
  const token = await getAuthToken();

  if (!token || typeof token !== "string") {
    throw new Error("Please login before continuing.");
  }

  return token;
}

// ==========================================
// CREATE BOOKING
// ==========================================

export async function createBooking(
  data: CreateBookingData
): Promise<BookingResponse> {
  const token = await requireAuthToken();

  if (!data.serviceId?.trim()) {
    throw new Error("Service ID is required.");
  }

  if (!data.artistName?.trim()) {
    throw new Error("Artist name is required.");
  }

  if (!data.appointmentDate?.trim()) {
    throw new Error("Appointment date is required.");
  }

  if (!data.appointmentTime?.trim()) {
    throw new Error("Appointment time is required.");
  }

  if (!data.customerName?.trim()) {
    throw new Error("Customer name is required.");
  }

  const cleanPhone = data.customerPhone?.trim() || "";

  if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
    throw new Error("Please enter a valid phone number.");
  }

  const payload: CreateBookingData = {
    serviceId: data.serviceId.trim(),
    artistName: data.artistName.trim(),
    appointmentDate: data.appointmentDate.trim(),
    appointmentTime: data.appointmentTime.trim(),
    customerName: data.customerName.trim(),
    customerPhone: cleanPhone,
    notes: data.notes?.trim() || "",
  };

  return apiRequest(
    "/bookings",
    "POST",
    payload,
    token
  );
}

// ==========================================
// GET MY BOOKINGS
// ==========================================

export async function getMyBookings() {
  const token = await requireAuthToken();

  return apiRequest(
    "/bookings/my-bookings",
    "GET",
    undefined,
    token
  );
}

// ==========================================
// CANCEL MY BOOKING
// ==========================================

export async function cancelMyBooking(
  bookingId: string
) {
  const token = await requireAuthToken();

  if (!bookingId?.trim()) {
    throw new Error("Invalid booking ID.");
  }

  return apiRequest(
    `/bookings/${encodeURIComponent(bookingId.trim())}/cancel`,
    "PATCH",
    {},
    token
  );
}

// ==========================================
// GET ARTIST AVAILABILITY
// PUBLIC API
// ==========================================

export async function getArtistAvailability(
  artistName: string,
  appointmentDate: string
): Promise<ArtistAvailability> {
  if (!artistName?.trim()) {
    throw new Error("Artist name is required.");
  }

  if (!appointmentDate?.trim()) {
    throw new Error("Appointment date is required.");
  }

  const query =
    `?artistName=${encodeURIComponent(artistName.trim())}` +
    `&appointmentDate=${encodeURIComponent(appointmentDate.trim())}`;

  const response: any = await apiRequest(
    `/bookings/availability${query}`,
    "GET"
  );

  // Handle direct and wrapped API responses.
  const result =
    response?.data?.data ??
    response?.data ??
    response;

  if (!result || !Array.isArray(result.bookedSlots)) {
    throw new Error(
      "Invalid availability response from server."
    );
  }

  const rawIntervals = Array.isArray(result.busyIntervals)
    ? result.busyIntervals
    : [];

  const busyIntervals: BusyInterval[] = rawIntervals
    .filter((item: any) => {
      return (
        typeof item?.startTime === "string" &&
        Number.isFinite(item?.startMinutes) &&
        Number.isFinite(item?.endMinutes) &&
        item.endMinutes > item.startMinutes
      );
    })
    .map((item: any) => ({
      startTime: item.startTime,
      startMinutes: item.startMinutes,
      endMinutes: item.endMinutes,
    }));

  return {
    success: result.success ?? true,
    artistName: result.artistName ?? artistName,
    appointmentDate:
      result.appointmentDate ?? appointmentDate,
    bookedSlots: result.bookedSlots.filter(
      (slot: any) => typeof slot === "string"
    ),
    busyIntervals,
  };
}
