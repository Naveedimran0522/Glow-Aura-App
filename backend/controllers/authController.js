
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — AUTH CONTROLLER WITH SINGLE ADMIN ACCOUNT */

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/Otp");
const sendOTPEmail = require("../utils/sendEmail");

// DESIGNATED ADMIN EMAIL
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "")
  .trim()
  .toLowerCase();

// HASH OTP
const hashOTP = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

// SYNC ADMIN ROLE
const syncAdminRole = async (user, email) => {
  if (!ADMIN_EMAIL) {
    console.warn("ADMIN_EMAIL is not configured in backend .env");
    return;
  }

  const shouldBeAdmin = email === ADMIN_EMAIL;
  const newRole = shouldBeAdmin
    ? "admin"
    : user.role === "admin"
      ? "user"
      : user.role;

  if (user.role !== newRole) {
    user.role = newRole;
    await user.save();
  }
};

// GENERATE JWT
const createToken = (user) => {
  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET.length < 32
  ) {
    throw new Error(
      "JWT_SECRET must contain at least 32 characters."
    );
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// SEND OTP
exports.sendOTP = async (req, res) => {
  try {
    let { name, email, phone, purpose } = req.body;

    name = typeof name === "string" ? name.trim() : "";
    email =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : "";
    phone = typeof phone === "string" ? phone.trim() : "";

    if (!email || !["register", "login"].includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: "Valid email and purpose are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    const user = await User.findOne({ email });

    if (purpose === "register") {
      if (user) {
        return res.status(409).json({
          success: false,
          message: "Account already exists. Please login.",
        });
      }

      if (!name || name.length < 2 || !phone) {
        return res.status(400).json({
          success: false,
          message: "Valid name and phone are required.",
        });
      }

      if (!/^\+?[0-9]{10,15}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid phone number.",
        });
      }
    }

    if (purpose === "login" && !user) {
      return res.status(404).json({
        success: false,
        message: "Account not found. Please register first.",
      });
    }

    const existingOTP = await Otp.findOne({ email, purpose });

    if (
      existingOTP &&
      Date.now() - existingOTP.createdAt.getTime() < 60000
    ) {
      return res.status(429).json({
        success: false,
        message:
          "Please wait 60 seconds before requesting another OTP.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    await Otp.findOneAndUpdate(
      { email, purpose },
      {
        $set: {
          email,
          purpose,
          otpHash: hashOTP(otp),
          name: purpose === "register" ? name : undefined,
          phone: purpose === "register" ? phone : undefined,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 0,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    try {
      await sendOTPEmail(email, otp, purpose);
    } catch (emailError) {
      await Otp.deleteOne({ email, purpose });

      console.error("OTP Email Error:", emailError.message);

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
      expiresIn: 300,
      resendAfter: 60,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending OTP.",
    });
  }
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const otp = String(req.body.otp || "");
    const purpose = req.body.purpose;

    if (
      !email ||
      !/^\d{6}$/.test(otp) ||
      !["register", "login"].includes(purpose)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification details.",
      });
    }

    const otpRecord = await Otp.findOne({ email, purpose });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      await Otp.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });

      return res.status(429).json({
        success: false,
        message: "Too many attempts. Request a new OTP.",
      });
    }

    if (hashOTP(otp) !== otpRecord.otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    let user;

    if (purpose === "register") {
      user = await User.findOne({ email });

      if (user) {
        await Otp.deleteOne({ _id: otpRecord._id });

        return res.status(409).json({
          success: false,
          message: "Account already exists. Please login.",
        });
      }

      const isDesignatedAdmin =
        ADMIN_EMAIL && email === ADMIN_EMAIL;

      user = await User.create({
        name: otpRecord.name,
        email,
        phone: otpRecord.phone,
        isVerified: true,
        role: isDesignatedAdmin ? "admin" : "user",
      });
    } else {
      user = await User.findOne({ email });

      if (!user) {
        await Otp.deleteOne({ _id: otpRecord._id });

        return res.status(404).json({
          success: false,
          message: "Account not found. Please register.",
        });
      }

      await syncAdminRole(user, email);
    }

    const token = createToken(user);

    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: "Authentication successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed.",
    });
  }
};

// CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile.",
    });
  }
};
