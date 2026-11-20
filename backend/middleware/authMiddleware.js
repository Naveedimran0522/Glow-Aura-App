
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — AUTHENTICATION + ADMIN AUTHORIZATION */

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

// ==========================================
// PROTECT — VERIFY LOGIN TOKEN
// ==========================================

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in backend .env");

      return res.status(500).json({
        success: false,
        message: "Authentication configuration error.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId =
      decoded.id ||
      decoded._id ||
      decoded.userId ||
      decoded.sub;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication.",
      });
    }

    // Verify that the user still exists.
    const user = await User.findById(userId).select(
      "_id name email role isVerified"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    req.user = user;
    req.auth = decoded;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
  }
};

// ==========================================
// ADMIN ONLY — VERIFY ADMIN ROLE
// ==========================================

const adminOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first.",
      });
    }

    if (String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    req.adminUser = req.user;

    next();
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify admin permissions.",
    });
  }
};

// ==========================================
// EXPORT MIDDLEWARE
// ==========================================

module.exports = {
  protect,
  adminOnly,
};
