
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — PREMIUM SERVICE MODEL
   MongoDB + Mongoose
   Compatible with Modern Mongoose
===================================================== */

const mongoose = require("mongoose");

// =====================================================
// SERVICE SCHEMA
// =====================================================

const serviceSchema = new mongoose.Schema(
  {
    // ================================================
    // UNIQUE SERVICE ID
    // ================================================

    serviceId: {
      type: String,
      required: [true, "Service ID is required."],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    // ================================================
    // SERVICE NAME
    // ================================================

    name: {
      type: String,
      required: [true, "Service name is required."],
      trim: true,
      maxlength: [120, "Service name is too long."],
    },

    // ================================================
    // SERVICE DESCRIPTION
    // ================================================

    description: {
      type: String,
      required: [true, "Service description is required."],
      trim: true,
      maxlength: [2000, "Description is too long."],
    },

    // ================================================
    // SERVICE CATEGORY
    // ================================================

    category: {
      type: String,
      required: [true, "Service category is required."],
      enum: {
        values: [
          "Skin Care",
          "Bridal Care",
          "Mehndi Care",
        ],
        message:
          "Category must be Skin Care, Bridal Care, or Mehndi Care.",
      },
      trim: true,
      index: true,
    },

    // ================================================
    // SERVICE PRICE
    // ================================================

    price: {
      type: Number,
      required: [true, "Service price is required."],
      min: [0, "Price cannot be negative."],
    },

    // ================================================
    // SERVICE DURATION
    // ================================================

    duration: {
      type: String,
      required: [true, "Service duration is required."],
      trim: true,
      maxlength: [50, "Duration is too long."],
    },

    // ================================================
    // SERVICE IMAGE
    // Stores HTTP/HTTPS URL or relative upload path
    // ================================================

    image: {
      type: String,
      default: "",
      trim: true,
    },

    // ================================================
    // SERVICE RATING
    // ================================================

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be below 0."],
      max: [5, "Rating cannot exceed 5."],
    },

    // ================================================
    // SERVICE STATUS
    // ================================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },

  // ==================================================
  // SCHEMA OPTIONS
  // ==================================================

  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

// =====================================================
// NORMALIZE DATA BEFORE VALIDATION
// Modern Mongoose compatible — NO next() callback
// =====================================================

serviceSchema.pre("validate", function () {
  if (this.serviceId) {
    this.serviceId = this.serviceId
      .trim()
      .toLowerCase();
  }

  if (this.name) {
    this.name = this.name.trim();
  }

  if (this.description) {
    this.description = this.description.trim();
  }

  if (this.duration) {
    this.duration = this.duration.trim();
  }

  if (typeof this.category === "string") {
    const category = this.category
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "");

    const categories = {
      skincare: "Skin Care",
      skin: "Skin Care",
      facial: "Skin Care",

      bridalcare: "Bridal Care",
      bridal: "Bridal Care",
      engagement: "Bridal Care",

      mehndicare: "Mehndi Care",
      mehndi: "Mehndi Care",
      mehandi: "Mehndi Care",
      henna: "Mehndi Care",
    };

    if (categories[category]) {
      this.category = categories[category];
    } else {
      this.category = this.category.trim();
    }
  }

  if (typeof this.image === "string") {
    this.image = this.image.trim();
  }
});

// =====================================================
// INDEXES
// =====================================================

serviceSchema.index({
  category: 1,
  isActive: 1,
});

serviceSchema.index({
  name: "text",
  description: "text",
});

// =====================================================
// EXPORT MODEL
// =====================================================

module.exports =
  mongoose.models.Service ||
  mongoose.model("Service", serviceSchema);
