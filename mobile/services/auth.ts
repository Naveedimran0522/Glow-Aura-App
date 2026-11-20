
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — COMPLETE AUTH SERVICE */

import * as SecureStore from "expo-secure-store";
import { apiRequest } from "./api";

const TOKEN_KEY = "glowaura_auth_token";

// ==========================================
// SEND OTP
// ==========================================

export async function sendOTP(data: {
  name?: string;
  email: string;
  phone?: string;
  purpose: "register" | "login";
}) {
  return apiRequest(
    "/auth/send-otp",
    "POST",
    data
  );
}

// ==========================================
// VERIFY OTP
// ==========================================

export async function verifyOTP(data: {
  email: string;
  otp: string;
  purpose: "register" | "login";
}) {
  const result = await apiRequest(
    "/auth/verify-otp",
    "POST",
    data
  );

  if (result?.token) {
    await SecureStore.setItemAsync(
      TOKEN_KEY,
      result.token
    );
  }

  return result;
}

// ==========================================
// GET AUTH TOKEN
// ==========================================

export async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

// ==========================================
// GET CURRENT USER
// ==========================================

export async function getCurrentUser(token?: string) {
  const authToken = token || await getAuthToken();

  if (!authToken) {
    return null;
  }

  const result = await apiRequest(
    "/auth/me",
    "GET",
    undefined,
    authToken
  );

  if (!result?.success || !result?.user) {
    return null;
  }

  return result.user;
}

// ==========================================
// CHECK ADMIN ACCESS
// ==========================================

export async function isAdminUser(): Promise<boolean> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return false;
    }

    const user = await getCurrentUser(token);

    const adminAccess = user?.role === "admin";

    console.log(
      "GLOWAURA ACCOUNT ROLE:",
      user?.role || "unknown"
    );

    return adminAccess;
  } catch (error) {
    console.error(
      "ADMIN AUTH CHECK ERROR:",
      error
    );

    return false;
  }
}

// ==========================================
// LOGOUT
// ==========================================

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
