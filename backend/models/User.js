
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — USER MODEL WITH FAVOURITE ARTISTS */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "artist"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    // CUSTOMER FAVOURITE ARTISTS
    favoriteArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
