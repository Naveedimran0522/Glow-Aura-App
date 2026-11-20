
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — PROFESSIONAL BOOKING + STRIPE PAYMENT MODEL */

const mongoose = require("mongoose");

// ==========================================
// VALIDATION HELPERS
// ==========================================

const isValidDate = (value) => {
  if (typeof value !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

const isValidTime = (value) => {
  return (
    typeof value === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
  );
};

const isValidDuration = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  const duration = value.trim();

  // Accept formats such as:
  // 30 minutes
  // 1 hour
  // 1.5 hours
  // 2 hours 30 minutes
  const hoursMatch = duration.match(
    /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i
  );

  const minutesMatch = duration.match(
    /(\d+)\s*(?:minutes?|mins?|m)\b/i
  );

  const hours = hoursMatch
    ? Number(hoursMatch[1])
    : 0;

  const minutes = minutesMatch
    ? Number(minutesMatch[1])
    : 0;

  const hasRecognizedUnit =
    Boolean(hoursMatch) || Boolean(minutesMatch);

  const totalMinutes = hours * 60 + minutes;

  return (
    hasRecognizedUnit &&
    Number.isFinite(totalMinutes) &&
    totalMinutes > 0 &&
    totalMinutes <= 1440
  );
};

// ==========================================
// BOOKING SCHEMA
// ==========================================

const bookingSchema = new mongoose.Schema(
  {
    // ======================================
    // USER REFERENCE
    // ======================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ======================================
    // SERVICE INFORMATION
    // ======================================

    serviceId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // ======================================
    // ARTIST INFORMATION
    // ======================================

    artistName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // ======================================
    // APPOINTMENT INFORMATION
    // ======================================

    appointmentDate: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidDate,
        message: "Appointment date must be a valid YYYY-MM-DD date.",
      },
    },

    appointmentTime: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidTime,
        message: "Appointment time must be in HH:mm format.",
      },
    },

    duration: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidDuration,
        message: "Please provide a valid appointment duration.",
      },
    },

    // ======================================
    // PRICING
    // ======================================

    price: {
      type: Number,
      required: true,
      min: [
        0.01,
        "Booking price must be greater than zero.",
      ],
      validate: {
        validator: Number.isFinite,
        message: "Booking price must be a valid number.",
      },
    },

    // ======================================
    // CUSTOMER INFORMATION
    // ======================================

    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },

    // ======================================
    // ADDITIONAL NOTES
    // ======================================

    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    // ======================================
    // BOOKING STATUS
    // ======================================

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    // ======================================
    // PAYMENT STATUS
    // ======================================

    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "paid",
        "refunded",
      ],
      default: "unpaid",
    },

    // ======================================
    // STRIPE PAYMENT INFORMATION
    // ======================================

    paymentIntentId: {
      type: String,
      default: null,
      trim: true,
    },

    stripeCheckoutSessionId: {
      type: String,
      default: null,
      trim: true,
    },

    paymentCurrency: {
      type: String,
      default: "inr",
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
      match: [
        /^[a-z]{3}$/,
        "Payment currency must be a valid three-letter currency code.",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

// ==========================================
// DATABASE INDEXES
// ==========================================

// 1. USER BOOKING HISTORY

bookingSchema.index(
  {
    user: 1,
    createdAt: -1,
  },
  {
    name: "user_booking_history",
  }
);

// 2. ARTIST AVAILABILITY LOOKUP

bookingSchema.index(
  {
    artistName: 1,
    appointmentDate: 1,
    status: 1,
  },
  {
    name: "artist_availability_lookup",
  }
);

// 3. PREVENT DUPLICATE ACTIVE EXACT-TIME SLOTS
//
// Only pending and confirmed bookings reserve
// an exact artist/date/time combination.
//
// NOTE: This does not prevent overlapping durations.

bookingSchema.index(
  {
    artistName: 1,
    appointmentDate: 1,
    appointmentTime: 1,
  },
  {
    unique: true,
    name: "unique_active_artist_slot",
    partialFilterExpression: {
      status: {
        $in: ["pending", "confirmed"],
      },
    },
  }
);

// 4. PREVENT DUPLICATE STRIPE CHECKOUT SESSION IDs

bookingSchema.index(
  {
    stripeCheckoutSessionId: 1,
  },
  {
    unique: true,
    name: "unique_stripe_checkout_session",
    partialFilterExpression: {
      stripeCheckoutSessionId: {
        $type: "string",
      },
    },
  }
);

// 5. PREVENT DUPLICATE STRIPE PAYMENT INTENT IDs

bookingSchema.index(
  {
    paymentIntentId: 1,
  },
  {
    unique: true,
    name: "unique_stripe_payment_intent",
    partialFilterExpression: {
      paymentIntentId: {
        $type: "string",
      },
    },
  }
);

// ==========================================
// EXPORT BOOKING MODEL
// ==========================================

const Booking =
  mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);

module.exports = Booking;
