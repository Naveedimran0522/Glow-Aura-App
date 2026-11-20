
/* Bismillah ❤️ */
/* GLOWAURA — AUTH ROUTES */

const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  sendOTP,
  verifyOTP,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Try again later.",
  },
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many verification attempts. Try later.",
  },
});

router.post("/send-otp", otpLimiter, sendOTP);
router.post("/verify-otp", verifyLimiter, verifyOTP);
router.get("/me", protect, getMe);

module.exports = router;
