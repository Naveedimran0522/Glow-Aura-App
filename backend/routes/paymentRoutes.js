
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — SECURE STRIPE PAYMENT ROUTES */

const express = require("express");

const router = express.Router();

// ==========================================
// CONTROLLERS
// ==========================================

const {
  createCheckoutSession,
  verifyCheckoutSession,
} = require("../controllers/paymentController");

// ==========================================
// MIDDLEWARE
// ==========================================

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// CREATE STRIPE CHECKOUT SESSION
// POST /api/payments/create-checkout
// Authentication: Required
// ==========================================

router.post(
  "/create-checkout",
  protect,
  createCheckoutSession
);

// ==========================================
// VERIFY STRIPE CHECKOUT PAYMENT
// POST /api/payments/verify-checkout
// Authentication: Required
// ==========================================

router.post(
  "/verify-checkout",
  protect,
  verifyCheckoutSession
);

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;
