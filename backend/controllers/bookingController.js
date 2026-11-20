
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — PROFESSIONAL BOOKING CONTROLLER
   30 Services + Artist Validation
   Duration Overlap + Availability
   Secure Booking + Cancellation
===================================================== */

const mongoose = require("mongoose");
const Booking = require("../models/Booking");

// =====================================================
// SERVICE CATALOGUE — ALL 30 SERVICES
// Prices and artists are controlled by backend.
// =====================================================

const serviceCatalogue = {
  // SKIN CARE

  "skin-01": {
    title: "Radiance Glow Facial",
    category: "Skin Care",
    price: 1499,
    duration: "60 minutes",
    artist: "Sara Beauty Studio",
  },
  "skin-02": {
    title: "Hydra Care Facial",
    category: "Skin Care",
    price: 1999,
    duration: "75 minutes",
    artist: "Ayesha Khan",
  },
  "skin-03": {
    title: "Gold Radiance Facial",
    category: "Skin Care",
    price: 2499,
    duration: "75 minutes",
    artist: "Mehak Fatima",
  },
  "skin-04": {
    title: "Deep Cleansing Facial",
    category: "Skin Care",
    price: 1299,
    duration: "50 minutes",
    artist: "Maryam Khan",
  },
  "skin-05": {
    title: "Vitamin C Facial",
    category: "Skin Care",
    price: 2199,
    duration: "60 minutes",
    artist: "Saba Parveen",
  },
  "skin-06": {
    title: "Relaxing Face Massage",
    category: "Skin Care",
    price: 999,
    duration: "30 minutes",
    artist: "Neha Mishra",
  },
  "skin-07": {
    title: "Hydrating Skin Treatment",
    category: "Skin Care",
    price: 1799,
    duration: "60 minutes",
    artist: "Ananya Reddy",
  },
  "skin-08": {
    title: "Herbal Glow Facial",
    category: "Skin Care",
    price: 1599,
    duration: "60 minutes",
    artist: "Pooja Verma",
  },
  "skin-09": {
    title: "Luxury Spa Facial",
    category: "Skin Care",
    price: 2999,
    duration: "90 minutes",
    artist: "Rida Fatima",
  },
  "skin-10": {
    title: "Sensitive Skin Care",
    category: "Skin Care",
    price: 1899,
    duration: "60 minutes",
    artist: "Nisha Kumari",
  },

  // BRIDAL CARE

  "bridal-01": {
    title: "Bridal Glow Package",
    category: "Bridal Care",
    price: 7999,
    duration: "3 hours",
    artist: "Ayesha Khan",
  },
  "bridal-02": {
    title: "Engagement Makeup",
    category: "Bridal Care",
    price: 4999,
    duration: "2 hours",
    artist: "Meera Artistry",
  },
  "bridal-03": {
    title: "Royal Bridal Makeup",
    category: "Bridal Care",
    price: 12999,
    duration: "3 hours",
    artist: "Noor Jahan",
  },
  "bridal-04": {
    title: "HD Bridal Makeup",
    category: "Bridal Care",
    price: 9999,
    duration: "2.5 hours",
    artist: "Kavya Rao",
  },
  "bridal-05": {
    title: "Reception Makeup",
    category: "Bridal Care",
    price: 5999,
    duration: "2 hours",
    artist: "Farah Begum",
  },
  "bridal-06": {
    title: "Pre-Bridal Skin Package",
    category: "Bridal Care",
    price: 6999,
    duration: "2 hours",
    artist: "Sara Beauty Studio",
  },
  "bridal-07": {
    title: "Airbrush Bridal Makeup",
    category: "Bridal Care",
    price: 11999,
    duration: "3 hours",
    artist: "Shreya Kapoor",
  },
  "bridal-08": {
    title: "Bridal Hair Styling",
    category: "Bridal Care",
    price: 3499,
    duration: "90 minutes",
    artist: "Divya Rani",
  },
  "bridal-09": {
    title: "Party Makeup",
    category: "Bridal Care",
    price: 2999,
    duration: "90 minutes",
    artist: "Sneha Patel",
  },
  "bridal-10": {
    title: "Complete Bridal Styling",
    category: "Bridal Care",
    price: 14999,
    duration: "4 hours",
    artist: "Amina Sheikh",
  },

  // MEHNDI CARE

  "mehndi-01": {
    title: "Bridal Mehndi Design",
    category: "Mehndi Care",
    price: 5999,
    duration: "4 hours",
    artist: "Meera Artistry",
  },
  "mehndi-02": {
    title: "Arabic Mehndi Art",
    category: "Mehndi Care",
    price: 1499,
    duration: "90 minutes",
    artist: "Meera Artistry",
  },
  "mehndi-03": {
    title: "Royal Bridal Mehndi",
    category: "Mehndi Care",
    price: 7999,
    duration: "5 hours",
    artist: "Hiba Noor",
  },
  "mehndi-04": {
    title: "Minimal Mehndi Design",
    category: "Mehndi Care",
    price: 799,
    duration: "45 minutes",
    artist: "Sana Shaikh",
  },
  "mehndi-05": {
    title: "Rajasthani Mehndi",
    category: "Mehndi Care",
    price: 2499,
    duration: "2 hours",
    artist: "Alina Parveen",
  },
  "mehndi-06": {
    title: "Festival Mehndi Art",
    category: "Mehndi Care",
    price: 1199,
    duration: "60 minutes",
    artist: "Areeba Noor",
  },
  "mehndi-07": {
    title: "Engagement Mehndi",
    category: "Mehndi Care",
    price: 2999,
    duration: "2.5 hours",
    artist: "Sadia Khan",
  },
  "mehndi-08": {
    title: "Moroccan Mehndi",
    category: "Mehndi Care",
    price: 1799,
    duration: "90 minutes",
    artist: "Amina Sheikh",
  },
  "mehndi-09": {
    title: "Kids Mehndi Design",
    category: "Mehndi Care",
    price: 499,
    duration: "30 minutes",
    artist: "Nisha Kumari",
  },
  "mehndi-10": {
    title: "Full Hand Mehndi Art",
    category: "Mehndi Care",
    price: 3499,
    duration: "3 hours",
    artist: "Saba Parveen",
  },
};

// =====================================================
// CONSTANTS
// =====================================================

const ACTIVE_STATUSES = ["pending", "confirmed"];

const MAX_NOTES_LENGTH = 500;

const MAX_NAME_LENGTH = 80;

// =====================================================
// AUTHENTICATION HELPER
// =====================================================

const getUserId = (req) => {
  const id =
    req.user?.id ||
    req.user?._id ||
    req.user?.userId;

  if (!id) return null;

  const value = String(id);

  return mongoose.Types.ObjectId.isValid(value)
    ? value
    : null;
};

// =====================================================
// DATE AND TIME VALIDATION
// Date format: YYYY-MM-DD
// Time format: HH:mm (24-hour)
// =====================================================

const isValidDateTime = (date, time) => {
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  if (
    typeof time !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  ) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);

  const [hour, minute] = time.split(":").map(Number);

  const check = new Date(
    Date.UTC(year, month - 1, day, hour, minute)
  );

  return (
    check.getUTCFullYear() === year &&
    check.getUTCMonth() === month - 1 &&
    check.getUTCDate() === day &&
    check.getUTCHours() === hour &&
    check.getUTCMinutes() === minute
  );
};

// =====================================================
// TIME CONVERSION
// =====================================================

const timeToMinutes = (time) => {
  if (
    typeof time !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  ) {
    return -1;
  }

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

// =====================================================
// DURATION CONVERSION
// Supports:
// 60 minutes
// 90 minutes
// 2 hours
// 2.5 hours
// 3 hours
// =====================================================

const durationToMinutes = (duration) => {
  if (typeof duration !== "string") {
    return 0;
  }

  const value = duration.toLowerCase().trim();

  const hoursMatch = value.match(
    /(\d+(?:\.\d+)?)\s*hours?/
  );

  const minutesMatch = value.match(
    /(\d+(?:\.\d+)?)\s*minutes?/
  );

  let total = 0;

  if (hoursMatch) {
    total += Number(hoursMatch[1]) * 60;
  }

  if (minutesMatch) {
    total += Number(minutesMatch[1]);
  }

  return Number.isFinite(total) && total > 0
    ? Math.round(total)
    : 0;
};

// =====================================================
// FUTURE APPOINTMENT VALIDATION
// Uses India Standard Time (IST).
// =====================================================

const isFutureAppointment = (date, time) => {
  if (!isValidDateTime(date, time)) {
    return false;
  }

  const appointment = new Date(
    `${date}T${time}:00+05:30`
  );

  return (
    !Number.isNaN(appointment.getTime()) &&
    appointment.getTime() > Date.now()
  );
};

// =====================================================
// OVERLAP VALIDATION
// =====================================================

const isOverlapping = (
  startA,
  durationA,
  startB,
  durationB
) => {
  const endA = startA + durationA;
  const endB = startB + durationB;

  return startA < endB && startB < endA;
};

// =====================================================
// SERVER ERROR HANDLER
// =====================================================

const sendServerError = (res, message, error) => {
  console.error(`❌ ${message}:`, error);

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? message
        : error.message || message,
  });
};

// =====================================================
// FIND OVERLAPPING BOOKING
// =====================================================

const findOverlappingBooking = async ({
  artistName,
  appointmentDate,
  appointmentTime,
  duration,
  excludeBookingId = null,
}) => {
  const requestedStart = timeToMinutes(appointmentTime);

  const requestedDuration = durationToMinutes(duration);

  if (requestedStart < 0 || !requestedDuration) {
    throw new Error("Invalid appointment time or duration.");
  }

  const query = {
    artistName,
    appointmentDate,
    status: { $in: ACTIVE_STATUSES },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingBookings = await Booking.find(query)
    .select("appointmentTime duration")
    .lean();

  return existingBookings.find((booking) => {
    const existingStart = timeToMinutes(
      booking.appointmentTime
    );

    const existingDuration = durationToMinutes(
      booking.duration
    );

    if (existingStart < 0 || !existingDuration) {
      return false;
    }

    return isOverlapping(
      requestedStart,
      requestedDuration,
      existingStart,
      existingDuration
    );
  }) || null;
};

// =====================================================
// GET ARTIST AVAILABILITY
// GET /api/bookings/availability
// =====================================================

const getAvailability = async (req, res) => {
  try {
    const artistName = String(
      req.query.artistName || ""
    ).trim();

    const appointmentDate = String(
      req.query.appointmentDate || ""
    ).trim();

    if (!artistName || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Artist and appointment date are required.",
      });
    }

    const isKnownArtist = Object.values(
      serviceCatalogue
    ).some((service) => service.artist === artistName);

    if (!isKnownArtist) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid artist.",
      });
    }

    if (!isValidDateTime(appointmentDate, "12:00")) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date.",
      });
    }

    const bookings = await Booking.find({
      artistName,
      appointmentDate,
      status: { $in: ACTIVE_STATUSES },
    })
      .select("appointmentTime duration -_id")
      .lean();

    const busyIntervals = bookings
      .map((booking) => {
        const start = timeToMinutes(
          booking.appointmentTime
        );

        const duration = durationToMinutes(
          booking.duration
        );

        if (start < 0 || duration <= 0) {
          return null;
        }

        return {
          startTime: booking.appointmentTime,
          startMinutes: start,
          endMinutes: start + duration,
        };
      })
      .filter(Boolean);

    // Keep bookedSlots for existing frontend compatibility.
    const bookedSlots = bookings.map(
      (booking) => booking.appointmentTime
    );

    return res.status(200).json({
      success: true,
      artistName,
      appointmentDate,
      bookedSlots,
      busyIntervals,
    });
  } catch (error) {
    return sendServerError(
      res,
      "Unable to fetch artist availability.",
      error
    );
  }
};

// =====================================================
// CREATE BOOKING
// POST /api/bookings
// Authentication required
// =====================================================

const createBooking = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      serviceId,
      artistName,
      appointmentDate,
      appointmentTime,
      customerName,
      customerPhone,
      notes,
    } = req.body || {};

    // Required fields
    if (
      !serviceId ||
      !artistName ||
      !appointmentDate ||
      !appointmentTime ||
      !customerName ||
      !customerPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required booking details.",
      });
    }

    // Validate service
    const service = serviceCatalogue[
      String(serviceId).trim()
    ];

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Selected service was not found.",
      });
    }

    // Validate assigned artist
    if (
      typeof artistName !== "string" ||
      artistName.trim() !== service.artist
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_SERVICE_ARTIST",
        message:
          "This artist is not assigned to the selected service.",
      });
    }

    // Validate customer name
    const cleanName = String(customerName).trim();

    if (
      cleanName.length < 2 ||
      cleanName.length > MAX_NAME_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid customer name.",
      });
    }

    // Validate appointment date and time
    if (
      !isValidDateTime(
        appointmentDate,
        appointmentTime
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date or time.",
      });
    }

    if (
      !isFutureAppointment(
        appointmentDate,
        appointmentTime
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a future appointment time.",
      });
    }

    // Validate phone
    const cleanPhone = String(customerPhone)
      .trim()
      .replace(/[\s()-]/g, "");

    if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    // Validate notes
    const cleanNotes = String(notes || "").trim();

    if (cleanNotes.length > MAX_NOTES_LENGTH) {
      return res.status(400).json({
        success: false,
        message: "Notes cannot exceed 500 characters.",
      });
    }

    // Validate server-side service duration and price
    const requestedDuration = durationToMinutes(
      service.duration
    );

    if (!requestedDuration || service.price <= 0) {
      return res.status(500).json({
        success: false,
        message: "Service configuration is invalid.",
      });
    }

    // Check artist's existing appointments.
    const overlappingBooking =
      await findOverlappingBooking({
        artistName: service.artist,
        appointmentDate,
        appointmentTime,
        duration: service.duration,
      });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        code: "SLOT_ALREADY_BOOKED",
        message:
          "This artist has another appointment during this time. Please select another time.",
      });
    }

    // Create booking using trusted server-side service details.
    const booking = await Booking.create({
      user: userId,

      serviceId: String(serviceId).trim(),

      serviceName: service.title,

      category: service.category,

      artistName: service.artist,

      appointmentDate,

      appointmentTime,

      duration: service.duration,

      price: service.price,

      customerName: cleanName,

      customerPhone: cleanPhone,

      notes: cleanNotes,

      status: "pending",

      paymentStatus: "unpaid",

      paymentCurrency: "inr",
    });

    return res.status(201).json({
      success: true,
      message: "Your booking request has been submitted.",
      booking,
    });
  } catch (error) {
    // Handle duplicate exact-time unique index.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        code: "SLOT_ALREADY_BOOKED",
        message:
          "This time slot has just been booked. Please select another time.",
      });
    }

    return sendServerError(
      res,
      "Unable to create booking.",
      error
    );
  }
};

// =====================================================
// GET MY BOOKINGS
// GET /api/bookings/my-bookings
// Authentication required
// =====================================================

const getMyBookings = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const bookings = await Booking.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return sendServerError(
      res,
      "Unable to fetch your bookings.",
      error
    );
  }
};

// =====================================================
// CANCEL BOOKING
// PATCH /api/bookings/:id/cancel
// Authentication required
// =====================================================

const cancelBooking = async (req, res) => {
  try {
    const userId = getUserId(req);

    const bookingId = String(req.params.id || "");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    // Only the owner can cancel their booking.
    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (!ACTIVE_STATUSES.includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled.",
      });
    }

    // Paid bookings need a refund workflow.
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        code: "REFUND_REQUIRED",
        message:
          "This booking has already been paid. Please contact GlowAura support for cancellation and refund.",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    return sendServerError(
      res,
      "Unable to cancel booking.",
      error
    );
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  createBooking,
  getAvailability,
  getMyBookings,
  cancelBooking,
};
