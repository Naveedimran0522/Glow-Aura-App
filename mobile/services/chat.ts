
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* ==========================================
   GLOWAURA — AI CHAT SERVICE
========================================== */

import apiRequest from "./api";
import { getAuthToken } from "./auth";

// ==========================================
// TYPES
// ==========================================

export type ChatRole = "user" | "model";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: Date;
};

type ApiHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

type ChatApiResponse = {
  success: boolean;
  message?: string;
  reply?: string;
};

// ==========================================
// ERROR MESSAGE HANDLER
// ==========================================

const getFriendlyErrorMessage = (error: unknown): string => {
  const message =
    error instanceof Error
      ? error.message
      : String(error || "");

  if (
    /network request failed|network error|fetch failed|timeout|timed out/i.test(
      message
    )
  ) {
    return "Internet connection problem. Please check your connection and try again.";
  }

  if (/429|too many requests|rate limit/i.test(message)) {
    return "GlowAura AI is receiving too many requests. Please try again shortly.";
  }

  if (/503|502|504|temporarily unavailable/i.test(message)) {
    return "GlowAura AI is temporarily unavailable. Please try again in a few moments.";
  }

  if (/401|403|unauthorized|authentication/i.test(message)) {
    return "Your session may have expired. Please login again.";
  }

  return (
    message ||
    "GlowAura AI could not generate a reply. Please try again."
  );
};

// ==========================================
// SEND BEAUTY MESSAGE
// ==========================================

export async function sendBeautyMessage(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  try {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      throw new Error("Please enter a message.");
    }

    if (cleanMessage.length > 3000) {
      throw new Error(
        "Message cannot exceed 3000 characters."
      );
    }

    if (!Array.isArray(history)) {
      throw new Error("Invalid conversation history.");
    }

    // Authentication
    const token = await getAuthToken();

    if (!token) {
      throw new Error(
        "Please login again to use GlowAura AI."
      );
    }

    // Convert mobile chat history to Groq API format
    const apiHistory: ApiHistoryItem[] = history
      .filter(
        (item) =>
          item &&
          ["user", "model"].includes(item.role) &&
          typeof item.text === "string" &&
          item.text.trim()
      )
      .slice(-10)
      .map((item) => ({
        role:
          item.role === "model"
            ? "assistant"
            : "user",
        content: item.text.slice(0, 3000),
      }));

    // API request
    const response = (await apiRequest(
      "/ai-chat",
      "POST",
      {
        message: cleanMessage,
        history: apiHistory,
      },
      token
    )) as ChatApiResponse;

    // Validate API response
    if (!response || typeof response !== "object") {
      throw new Error(
        "Invalid response received from GlowAura server."
      );
    }

    if (!response.success) {
      throw new Error(
        response.message ||
          "GlowAura AI could not generate a reply."
      );
    }

    if (
      typeof response.reply !== "string" ||
      !response.reply.trim()
    ) {
      throw new Error(
        "GlowAura AI returned an empty response. Please try again."
      );
    }

    return response.reply.trim();
  } catch (error) {
    const friendlyMessage =
      getFriendlyErrorMessage(error);

    console.error(
      "GLOWAURA MOBILE AI ERROR:",
      error instanceof Error ? error.message : error
    );

    throw new Error(friendlyMessage);
  }
}
