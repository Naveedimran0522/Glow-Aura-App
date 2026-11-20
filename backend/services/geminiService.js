
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* ==========================================
   GLOWAURA — GROQ AI BEAUTY SERVICE
========================================== */

const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

const GROQ_MODEL =
  process.env.GROQ_MODEL || "openai/gpt-oss-20b";

/* ==========================================
   GLOWAURA AI SYSTEM PROMPT
========================================== */

const SYSTEM_PROMPT = `
You are GlowAura AI, the friendly AI beauty assistant
inside the GlowAura mobile application.

YOUR RESPONSIBILITIES:
1. Help users with skincare routines and beauty tips.
2. Explain GlowAura skincare, facial, bridal makeup,
   haircare and mehndi services.
3. Give practical and easy-to-understand beauty advice.
4. Understand Hindi, Urdu, English and Hinglish.
5. Reply in the same language and style used by the user.
6. Respond naturally to greetings and casual conversation.
7. If the user says Assalamualaikum, reply
   Wa Alaikum Assalam.
8. Be polite, warm, friendly and conversational.
9. Recommend a qualified dermatologist for serious skin
   concerns. Never diagnose medical conditions.
10. Never invent appointments, bookings, payments,
    booking status or prices.

APP GUIDANCE:
GlowAura has these main sections:
- Home
- Services
- Bookings
- AI Beauty
- Profile

When users ask where to find something, explain the
appropriate section clearly.

IMPORTANT:
You are currently a conversational AI assistant.
Do not claim that you have opened a screen, created a
booking, cancelled a booking or completed a payment.
Only say an action was completed when the application
has actually confirmed it.

Keep answers clear, helpful and appropriately detailed.
`;

/* ==========================================
   GENERATE BEAUTY RESPONSE
========================================== */

const generateBeautyResponse = async (message, history = []) => {
  let timeout;

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      const error = new Error("GROQ_API_KEY is missing.");
      error.status = 500;
      throw error;
    }

    if (typeof message !== "string" || !message.trim()) {
      const error = new Error("A valid message is required.");
      error.status = 400;
      throw error;
    }

    if (message.length > 3000) {
      const error = new Error("Message cannot exceed 3000 characters.");
      error.status = 400;
      throw error;
    }

    // Sanitize conversation history.
    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              typeof item.content === "string" &&
              ["user", "assistant"].includes(item.role)
          )
          .slice(-10)
          .map((item) => ({
            role: item.role,
            content: item.content.slice(0, 3000),
          }))
      : [];

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...safeHistory,
      {
        role: "user",
        content: message.trim(),
      },
    ];

    // Request timeout: 30 seconds.
    const controller = new AbortController();

    timeout = setTimeout(() => {
      controller.abort();
    }, 30000);

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_completion_tokens: 1024,
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const apiMessage =
        data?.error?.message || "Groq API request failed.";

      console.error(
        "GROQ API ERROR:",
        response.status,
        apiMessage
      );

      const error = new Error(apiMessage);
      error.status = response.status;
      throw error;
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      const error = new Error("Groq returned an empty response.");
      error.status = 503;
      throw error;
    }

    console.log("GLOWAURA GROQ AI RESPONSE GENERATED ❤️");

    return reply.trim();
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error("Groq request timed out.");
      timeoutError.status = 504;
      timeoutError.retryable = true;
      throw timeoutError;
    }

    console.error(
      "GLOWAURA GROQ SERVICE ERROR:",
      error?.message || error
    );

    throw error;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
};

/* ==========================================
   EXPORT
========================================== */

module.exports = {
  generateBeautyResponse,
};
