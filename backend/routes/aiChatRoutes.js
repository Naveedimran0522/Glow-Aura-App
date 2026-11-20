
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* ==========================================
   GLOWAURA — AI CHAT ROUTES
========================================== */

const express = require("express");
const router = express.Router();

// Controllers
const {
  chatWithAI,
} = require("../controllers/aiChatController");

// Authentication middleware
const {
  protect,
} = require("../middleware/authMiddleware");

// Protected AI chat route
router.post("/", protect, chatWithAI);

// Export router
module.exports = router;
