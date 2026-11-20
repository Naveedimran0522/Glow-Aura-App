
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — COMPLETE ADMIN ROUTES */

const express = require("express");
const router = express.Router();

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const {
  getDashboardOverview,
  getAllUsers,
  getAllArtists,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/adminController");

// ==========================================
// ADMIN DASHBOARD OVERVIEW
// ==========================================

router.get(
  "/overview",
  protect,
  adminOnly,
  getDashboardOverview
);

// ==========================================
// ADMIN USERS MANAGEMENT
// ==========================================

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

// ==========================================
// ADMIN ARTISTS MANAGEMENT
// ==========================================

router.get(
  "/artists",
  protect,
  adminOnly,
  getAllArtists
);

// ==========================================
// ADMIN BOOKINGS MANAGEMENT
// ==========================================

router.get(
  "/bookings",
  protect,
  adminOnly,
  getAllBookings
);

// ==========================================
// UPDATE BOOKING STATUS
// ==========================================

router.patch(
  "/bookings/:id/status",
  protect,
  adminOnly,
  updateBookingStatus
);

module.exports = router;
