
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — MONGODB DATABASE CONNECTION
   Mongoose + MongoDB Atlas
===================================================== */

const mongoose = require("mongoose");

// =====================================================
// DATABASE CONNECTION
// =====================================================

const connectDB = async () => {
  try {
    // Check MongoDB environment variable
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI || !mongoURI.trim()) {
      throw new Error(
        "MONGO_URI is missing. Please configure it in backend/.env"
      );
    }

    // Prevent duplicate connection attempts
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB is already connected.");

      return mongoose.connection;
    }

    console.log("⏳ Connecting to GlowAura MongoDB...");

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 0,
      autoIndex: process.env.NODE_ENV !== "production",
    });

    console.log("");
    console.log("======================================");
    console.log("✅ GLOWAURA MONGODB CONNECTED");
    console.log("======================================");

    console.log(
      "DATABASE:",
      mongoose.connection.name
    );

    console.log(
      "HOST:",
      mongoose.connection.host
    );

    console.log(
      "READY STATE:",
      mongoose.connection.readyState
    );

    console.log("======================================");
    console.log("");

    return mongoose.connection;
  } catch (error) {
    console.error("");
    console.error("======================================");
    console.error("❌ GLOWAURA MONGODB CONNECTION FAILED");
    console.error("======================================");
    console.error("ERROR:", error.message);
    console.error("======================================");
    console.error("");

    throw error;
  }
};

// =====================================================
// DATABASE CONNECTION EVENTS
// =====================================================

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connection established.");
});

mongoose.connection.on("reconnected", () => {
  console.log("🟢 MongoDB reconnected.");
});

mongoose.connection.on("disconnected", () => {
  console.warn("🟠 MongoDB disconnected.");
});

mongoose.connection.on("error", (error) => {
  console.error(
    "🔴 MongoDB connection error:",
    error.message
  );
});

// =====================================================
// EXPORT
// =====================================================

module.exports = connectDB;
