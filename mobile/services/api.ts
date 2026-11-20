
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — COMPLETE API SERVICE */
/* Physical Android + Expo Go Support */
/* Admin Dashboard + Favourite Artists API */

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

// ==========================================
// API CONFIGURATION
// ==========================================

const DEFAULT_API_URL =
  "http://10.80.184.141:5000/api";

const RAW_API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  DEFAULT_API_URL;

const API_BASE = RAW_API_URL.trim().replace(/\/+$/, "");

const API_TIMEOUT_MS = Math.max(
  5000,
  Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 20000
);

// ==========================================
// API URL VALIDATION
// ==========================================

if (!API_BASE) {
  throw new Error("GlowAura API URL is missing.");
}

if (!/^https?:\/\/[^/\s]+(?:\/.*)?$/i.test(API_BASE)) {
  throw new Error(
    "Invalid API URL. Use a valid HTTP or HTTPS URL."
  );
}

console.log("GLOWAURA API BASE:", API_BASE);

// ==========================================
// API ERROR CLASS
// ==========================================

export class ApiRequestError extends Error {
  status: number;
  data: any;

  constructor(
    message: string,
    status: number,
    data: any = {}
  ) {
    super(message);

    this.name = "ApiRequestError";
    this.status = status;
    this.data = data;

    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  paid?: boolean;
}

export interface ApiRequestOptions {
  token?: string;
  timeout?: number;
}

// ==========================================
// API REQUEST FUNCTION
// ==========================================

export async function apiRequest<T = any>(
  endpoint: string,
  method: HttpMethod = "GET",
  data?: any,
  token?: string,
  customTimeout?: number
): Promise<T> {

  // ========================================
  // VALIDATE ENDPOINT
  // ========================================

  if (
    !endpoint ||
    typeof endpoint !== "string" ||
    !endpoint.trim()
  ) {
    throw new Error("API endpoint is required.");
  }

  const cleanEndpoint = endpoint.trim();

  // ========================================
  // NORMALIZE ENDPOINT
  // ========================================

  const normalizedEndpoint = cleanEndpoint.startsWith("/")
    ? cleanEndpoint
    : `/${cleanEndpoint}`;

  // Prevent duplicate /api/api
  const endpointWithoutApi = normalizedEndpoint.replace(
    /^\/api(?=\/|$)/,
    ""
  );

  const url = `${API_BASE}${endpointWithoutApi}`;

  // ========================================
  // REQUEST HEADERS
  // ========================================

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token?.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  // ========================================
  // TIMEOUT
  // ========================================

  const timeoutDuration = Math.max(
    5000,
    customTimeout || API_TIMEOUT_MS
  );

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutDuration);

  // ========================================
  // REQUEST LOG
  // ========================================

  console.log("GLOWAURA API REQUEST:", method, endpoint);

  try {
    // ======================================
    // FETCH REQUEST
    // ======================================

    const response = await fetch(url, {
      method,
      headers,
      ...(data !== undefined
        ? { body: JSON.stringify(data) }
        : {}),
      signal: controller.signal,
    });

    // ======================================
    // READ RESPONSE
    // ======================================

    const responseText = await response.text();

    let result: any = {};

    if (responseText.trim()) {
      try {
        result = JSON.parse(responseText);
      } catch {
        result = {
          message: responseText,
        };
      }
    }

    console.log(
      "GLOWAURA API RESPONSE:",
      response.status,
      response.ok ? "SUCCESS" : "ERROR"
    );

    // ======================================
    // HANDLE HTTP ERRORS
    // ======================================

    if (!response.ok) {
      const message =
        result?.message ||
        result?.error ||
        `Request failed with status ${response.status}`;

      throw new ApiRequestError(
        message,
        response.status,
        result
      );
    }

    return result as T;

  } catch (error: any) {

    // ======================================
    // TIMEOUT ERROR
    // ======================================

    if (
      error?.name === "AbortError" ||
      controller.signal.aborted
    ) {
      throw new Error(
        `GlowAura server request timed out after ${
          timeoutDuration / 1000
        } seconds. Check your backend connection.`
      );
    }

    // ======================================
    // PRESERVE SERVER ERROR DETAILS
    // ======================================

    if (error instanceof ApiRequestError) {
      throw error;
    }

    // ======================================
    // NETWORK ERROR
    // ======================================

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to GlowAura server. Check Wi-Fi, API URL and backend."
      );
    }

    // ======================================
    // OTHER ERRORS
    // ======================================

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unexpected GlowAura API error.");

  } finally {
    clearTimeout(timeoutId);
  }
}

// ==========================================
// ADMIN DASHBOARD TYPES
// ==========================================

export interface AdminOverview {
  totalUsers: number;
  totalArtists: number;
  totalBookings: number;
  activeBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: number;
  currency: string;
}

export interface AdminOverviewResponse {
  success: boolean;
  message?: string;
  overview: AdminOverview;
}

// ==========================================
// ADMIN DASHBOARD API
// GET /api/admin/overview
// ==========================================

export async function getAdminOverview(
  token: string
): Promise<AdminOverviewResponse> {
  if (!token?.trim()) {
    throw new Error(
      "Admin login token is missing. Please login again."
    );
  }

  return apiRequest<AdminOverviewResponse>(
    "/admin/overview",
    "GET",
    undefined,
    token
  );
}

// ==========================================
// FAVOURITE ARTISTS TYPES
// ==========================================

export interface FavoriteArtist {
  _id: string;
  name: string;
  role: string;
  isVerified?: boolean;
  image?: string;
  profileImage?: string;
  avatar?: string;
  speciality?: string;
  rating?: string | number;
}

export interface FavoriteArtistsResponse {
  success: boolean;
  count: number;
  artists: FavoriteArtist[];
  message?: string;
}

// ==========================================
// GET AVAILABLE VERIFIED ARTISTS
// GET /api/favorites/artists
// ==========================================

export async function getAvailableArtists(
  token: string
): Promise<FavoriteArtistsResponse> {
  if (!token?.trim()) {
    throw new Error("Login token is missing.");
  }

  return apiRequest<FavoriteArtistsResponse>(
    "/favorites/artists",
    "GET",
    undefined,
    token
  );
}

// ==========================================
// GET CUSTOMER FAVOURITE ARTISTS
// GET /api/favorites
// ==========================================

export async function getFavoriteArtists(
  token: string
): Promise<FavoriteArtistsResponse> {
  if (!token?.trim()) {
    throw new Error("Login token is missing.");
  }

  return apiRequest<FavoriteArtistsResponse>(
    "/favorites",
    "GET",
    undefined,
    token
  );
}

// ==========================================
// ADD ARTIST TO FAVOURITES
// POST /api/favorites/:artistId
// ==========================================

export async function addFavoriteArtist(
  artistId: string,
  token: string
): Promise<any> {
  if (!artistId?.trim() || !token?.trim()) {
    throw new Error(
      "Artist ID or login token is missing."
    );
  }

  return apiRequest(
    `/favorites/${encodeURIComponent(artistId)}`,
    "POST",
    undefined,
    token
  );
}

// ==========================================
// REMOVE ARTIST FROM FAVOURITES
// DELETE /api/favorites/:artistId
// ==========================================

export async function removeFavoriteArtist(
  artistId: string,
  token: string
): Promise<any> {
  if (!artistId?.trim() || !token?.trim()) {
    throw new Error(
      "Artist ID or login token is missing."
    );
  }

  return apiRequest(
    `/favorites/${encodeURIComponent(artistId)}`,
    "DELETE",
    undefined,
    token
  );
}

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default apiRequest;
