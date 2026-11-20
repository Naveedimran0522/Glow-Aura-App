
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* ==========================================
   GLOWAURA — GROQ AI CHAT CONTROLLER
========================================== */

const {
  generateBeautyResponse,
} = require("../services/geminiService");

/* ==========================================
   CHAT WITH GLOWAURA AI
========================================== */

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};

    // Validate message.
    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid message.",
      });
    }

    if (message.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 3000 characters.",
      });
    }

    // Validate history.
    if (!Array.isArray(history)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation history.",
      });
    }

    // Generate AI response.
    const reply = await generateBeautyResponse(
      message.trim(),
      history
    );

    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(503).json({
        success: false,
        message: "GlowAura AI could not generate a response.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "GlowAura AI response generated successfully.",
      reply: reply.trim(),
    });
  } catch (error) {
    console.error(
      "GLOWAURA GROQ AI CONTROLLER ERROR:",
      error?.message || error
    );

    const status = Number(error?.status);

    let httpStatus = 500;
    let userMessage =
      "GlowAura AI is temporarily unavailable. Please try again.";

    if (status === 400) {
      httpStatus = 400;
      userMessage = "Please check your message and try again.";
    } else if (status === 429) {
      httpStatus = 429;
      userMessage =
        "GlowAura AI is busy right now. Please try again later.";
    } else if (status === 401 || status === 403) {
      httpStatus = 503;
      userMessage =
        "GlowAura AI configuration error. Please contact support.";
    } else if (
      [408, 500, 502, 503, 504].includes(status) ||
      error?.retryable === true
    ) {
      httpStatus = 503;
      userMessage =
        "GlowAura AI is temporarily unavailable. Please try again in a few moments.";
    }

    return res.status(httpStatus).json({
      success: false,
      message: userMessage,
    });
  }
};

/* ==========================================
   EXPORT
========================================== */

module.exports = {
  chatWithAI,
};
