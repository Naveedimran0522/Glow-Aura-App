
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — PROFESSIONAL ADMIN CONTROLLER */

const mongoose = require("mongoose");
const User = require("../models/User");
const Booking = require("../models/Booking");

// ==========================================
// HELPER: SAFE SEARCH REGEX
// ==========================================

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ==========================================
// HELPER: PAGINATION
// ==========================================

const getPagination = (query) => {
  const requestedPage = parseInt(query.page, 10);
  const requestedLimit = parseInt(query.limit, 10);

  const page =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const limit =
    Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 50)
      : 10;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

// ==========================================
// ADMIN DASHBOARD OVERVIEW
// ==========================================

const getDashboardOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalArtists,
      totalBookings,
      activeBookings,
      cancelledBookings,
      completedBookings,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),

      User.countDocuments({ role: "artist" }),

      Booking.countDocuments(),

      Booking.countDocuments({
        status: { $in: ["pending", "confirmed"] },
      }),

      Booking.countDocuments({
        status: "cancelled",
      }),

      Booking.countDocuments({
        status: "completed",
      }),

      Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$price",
            },
          },
        },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    return res.status(200).json({
      success: true,
      message: "Admin dashboard overview loaded.",
      overview: {
        totalUsers,
        totalArtists,
        totalBookings,
        activeBookings,
        cancelledBookings,
        completedBookings,
        totalRevenue,
        currency: "INR",
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard.",
    });
  }
};

// ==========================================
// GET ALL USERS
// ONLY NORMAL CUSTOMER ACCOUNTS
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const filter = {
      role: "user",
    };

    if (search) {
      const safeSearch = escapeRegex(search);

      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("name email phone role isVerified createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      success: true,
      message: "Users loaded successfully.",
      users,
      pagination: {
        page,
        currentPage: page,
        limit,
        total: totalUsers,
        totalUsers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("ADMIN GET USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};

// ==========================================
// GET ALL ARTISTS
// ONLY ARTIST ACCOUNTS
// ==========================================

const getAllArtists = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const filter = {
      role: "artist",
    };

    if (search) {
      const safeSearch = escapeRegex(search);

      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const [artists, totalArtists] = await Promise.all([
      User.find(filter)
        .select("name email phone role isVerified createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalArtists / limit);

    return res.status(200).json({
      success: true,
      message: "Artists loaded successfully.",
      artists,
      pagination: {
        page,
        currentPage: page,
        limit,
        total: totalArtists,
        totalArtists,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("ADMIN GET ARTISTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load artists.",
    });
  }
};

// ==========================================
// GET ALL BOOKINGS
// SEARCH + FILTER + PAGINATION
// ==========================================

const getAllBookings = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status.trim().toLowerCase()
        : "";

    const paymentStatus =
      typeof req.query.paymentStatus === "string"
        ? req.query.paymentStatus.trim().toLowerCase()
        : "";

    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];

    // EXACT VALUES FROM Booking.js
    const allowedPaymentStatuses = [
      "unpaid",
      "paid",
      "refunded",
    ];

    const filter = {};

    // Booking status filter
    if (status && status !== "all") {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking status.",
        });
      }

      filter.status = status;
    }

    // Payment status filter
    if (paymentStatus && paymentStatus !== "all") {
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status.",
        });
      }

      filter.paymentStatus = paymentStatus;
    }

    // Search customer, service, artist, appointment, etc.
    if (search) {
      const safeSearch = escapeRegex(search);

      const searchableFields = [
        "serviceId",
        "serviceName",
        "category",
        "artistName",
        "appointmentDate",
        "appointmentTime",
        "duration",
        "customerName",
        "customerPhone",
        "notes",
        "status",
        "paymentStatus",
        "paymentIntentId",
        "stripeCheckoutSessionId",
        "paymentCurrency",
      ];

      filter.$or = searchableFields.map((field) => ({
        [field]: {
          $regex: safeSearch,
          $options: "i",
        },
      }));
    }

    const [bookings, totalBookings] = await Promise.all([
      Booking.find(filter)
        .populate("user", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Booking.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalBookings / limit);

    return res.status(200).json({
      success: true,
      message: "Bookings loaded successfully.",
      bookings,
      pagination: {
        page,
        currentPage: page,
        limit,
        total: totalBookings,
        totalBookings,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("ADMIN GET BOOKINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load bookings.",
    });
  }
};

// ==========================================
// UPDATE BOOKING STATUS
// ==========================================

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const status =
      typeof req.body?.status === "string"
        ? req.body.status.trim().toLowerCase()
        : "";

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // A completed booking must already be paid.
    if (
      status === "completed" &&
      booking.paymentStatus !== "paid"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only paid bookings can be completed.",
      });
    }

    // Refunded bookings cannot be reactivated.
    if (
      booking.paymentStatus === "refunded" &&
      ["pending", "confirmed", "completed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Refunded bookings cannot be reactivated.",
      });
    }

    // Cancelled bookings are terminal in this admin flow.
    if (
      booking.status === "cancelled" &&
      status !== "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cancelled bookings cannot be reactivated.",
      });
    }

    booking.status = status;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      booking,
    });
  } catch (error) {
    // Duplicate active artist/date/time slot.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This artist already has an active booking for that time slot.",
      });
    }

    console.error("ADMIN UPDATE BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update booking status.",
    });
  }
};

// ==========================================
// EXPORT ADMIN CONTROLLERS
// ==========================================

module.exports = {
  getDashboardOverview,
  getAllUsers,
  getAllArtists,
  getAllBookings,
  updateBookingStatus,
};
