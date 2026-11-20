
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — COMPLETE BOOKING ROUTES */

const express = require("express");
const router = express.Router();

// Authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Booking controller functions
const {
  createBooking,
  getAvailability,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");

// ======================================
// 1. CHECK ARTIST AVAILABILITY
// GET /api/bookings/availability
// ======================================

router.get("/availability", getAvailability);

// ======================================
// 2. CREATE NEW BOOKING
// POST /api/bookings
// Login required
// ======================================

router.post("/", protect, createBooking);

// ======================================
// 3. GET LOGGED-IN USER BOOKINGS
// GET /api/bookings/my-bookings
// Login required
// ======================================

router.get("/my-bookings", protect, getMyBookings);

// ======================================
// 4. CANCEL BOOKING
// PATCH /api/bookings/:id/cancel
// Login required
// ======================================

router.patch("/:id/cancel", protect, cancelBooking);

// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router;
