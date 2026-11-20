
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — COMPLETE BACKEND SERVER
   Express + MongoDB + Authentication
   Bookings + Stripe Payments + Gemini AI
   Admin Dashboard + Service Management
===================================================== */

require("dotenv").config();

const os = require("os");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const aiChatRoutes = require("./routes/aiChatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

// =====================================================
// APP INITIALIZATION
// =====================================================

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.disable("x-powered-by");

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile apps and requests without an Origin header.
      if (!origin) {
        return callback(null, true);
      }

      // If CLIENT_ORIGIN is not configured, allow all origins.
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS."));
    },

    credentials: true,
  })
);

// =====================================================
// REQUEST LOGGER
// =====================================================

app.use((req, res, next) => {
  const startedAt = Date.now();

  // Preserve the original URL for accurate logging.
  const originalMethod = req.method;
  const originalPath = req.originalUrl;
  const requestIP = req.ip;

  console.log("");
  console.log("📡 GLOWAURA INCOMING REQUEST");
  console.log("METHOD:", originalMethod);
  console.log("PATH:", originalPath);
  console.log("IP:", requestIP);

  res.on("finish", () => {
    console.log("📤 GLOWAURA RESPONSE");
    console.log("METHOD:", originalMethod);
    console.log("PATH:", originalPath);
    console.log("STATUS:", res.statusCode);
    console.log("TIME:", `${Date.now() - startedAt}ms`);
  });

  res.on("close", () => {
    if (!res.writableFinished) {
      console.error("⚠️ CONNECTION CLOSED BEFORE RESPONSE");
      console.error("METHOD:", originalMethod);
      console.error("PATH:", originalPath);
    }
  });

  next();
});

// =====================================================
// BODY PARSERS
// =====================================================

app.use(express.json({ limit: "2mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

// =====================================================
// SECURITY HELPERS
// =====================================================

const escapeHtml = (value) => {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) => entities[character]
  );
};

const isValidObjectId = (id) => {
  return (
    typeof id === "string" &&
    mongoose.Types.ObjectId.isValid(id)
  );
};

const isValidStripeSessionId = (id) => {
  return (
    typeof id === "string" &&
    /^cs_(test|live)_[a-zA-Z0-9_]+$/.test(id)
  );
};

// =====================================================
// APP DEEP LINK VALIDATION
// =====================================================

const isValidAppReturnUrl = (returnUrl, bookingId) => {
  try {
    if (
      typeof returnUrl !== "string" ||
      !returnUrl.trim() ||
      !isValidObjectId(String(bookingId))
    ) {
      return false;
    }

    const appUrl = new URL(returnUrl);

    const allowedSchemes = [
      "exp:",
      "exps:",
      "glowaura:",
    ];

    if (!allowedSchemes.includes(appUrl.protocol)) {
      return false;
    }

    if (appUrl.username || appUrl.password) {
      return false;
    }

    if (!appUrl.host && !appUrl.pathname) {
      return false;
    }

    const id = String(bookingId);

    const possiblePaths = [
      appUrl.pathname,
      `/${appUrl.host}${appUrl.pathname}`,
      `${appUrl.host}${appUrl.pathname}`,
    ];

    const normalizedPaths = possiblePaths.map((path) => {
      return decodeURIComponent(String(path || ""))
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
    });

    const allowedPaths = [
      `payment/verify/${id}`,
      `--/payment/verify/${id}`,
      `verify/${id}`,
    ];

    return normalizedPaths.some((path) =>
      allowedPaths.includes(path)
    );
  } catch (error) {
    console.error(
      "APP RETURN URL VALIDATION ERROR:",
      error.message
    );

    return false;
  }
};

// =====================================================
// SAFE JAVASCRIPT STRING
// =====================================================

const safeJsonForScript = (value) => {
  return JSON.stringify(String(value || ""))
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
};

// =====================================================
// PAYMENT STATUS PAGE
// =====================================================

const renderStatusPage = ({
  title,
  heading,
  message,
  appUrl,
  success = false,
  automaticRedirect = false,
}) => {
  const safeTitle = escapeHtml(title);
  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);
  const safeAppUrl = escapeHtml(appUrl || "");

  const scriptUrl = safeJsonForScript(appUrl || "");

  const icon = success ? "✓" : "!";
  const iconClass = success ? "success" : "cancel";

  const buttonText = success
    ? "Open GlowAura App"
    : "Return to GlowAura";

  const button = appUrl
    ? `
      <a
        class="app-button"
        href="${safeAppUrl}"
        id="openAppButton"
      >
        ${buttonText}
      </a>
    `
    : "";

  const redirectScript =
    automaticRedirect && appUrl
      ? `
        <script>
          const appLink = ${scriptUrl};

          window.addEventListener("load", function () {
            setTimeout(function () {
              window.location.assign(appLink);
            }, 1200);
          });
        </script>
      `
      : "";

  return `
    <!DOCTYPE html>
    <html lang="en">

      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <meta
          name="theme-color"
          content="#100D19"
        />

        <meta
          name="referrer"
          content="no-referrer"
        />

        <title>${safeTitle}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 22px;
            font-family: Arial, sans-serif;
            background:
              radial-gradient(
                circle at top,
                #382442,
                #100D19 65%
              );
            color: #ffffff;
          }

          .container {
            width: 100%;
            max-width: 460px;
            padding: 38px 25px;
            text-align: center;
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid rgba(232, 199, 131, 0.3);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
          }

          .icon {
            width: 85px;
            height: 85px;
            margin: 0 auto 24px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 45px;
            font-weight: bold;
          }

          .success {
            background: rgba(60, 190, 120, 0.15);
            border: 2px solid #55D69A;
            color: #55D69A;
          }

          .cancel {
            background: rgba(230, 100, 100, 0.15);
            border: 2px solid #F08080;
            color: #F08080;
          }

          h1 {
            color: #E8C783;
            font-size: 27px;
            margin: 0 0 15px;
          }

          p {
            color: #D6CEDB;
            font-size: 15px;
            line-height: 1.8;
            margin: 0 0 25px;
          }

          .app-button {
            display: inline-block;
            width: 100%;
            padding: 17px 20px;
            border-radius: 13px;
            text-decoration: none;
            color: #17111D;
            font-weight: bold;
            font-size: 15px;
            background: linear-gradient(
              135deg,
              #F5DCA5,
              #D6AB62
            );
          }

          .note {
            margin-top: 22px;
            font-size: 12px;
            color: #AFA3B7;
          }

          .brand {
            margin-top: 25px;
            color: #E8C783;
            font-weight: bold;
            letter-spacing: 2px;
            font-size: 13px;
          }
        </style>
      </head>

      <body>
        <main class="container">

          <div class="icon ${iconClass}">
            ${icon}
          </div>

          <h1>${safeHeading}</h1>

          <p>${safeMessage}</p>

          ${button}

          <div class="note">
            ${
              success
                ? "Open the app to verify your payment and booking."
                : "Return to GlowAura to check your booking."
            }
          </div>

          <div class="brand">
            GLOWAURA
          </div>

        </main>

        ${redirectScript}

      </body>
    </html>
  `;
};

// =====================================================
// API ROUTES
// IMPORTANT: Register routes before API NOT FOUND.
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/ai-chat", aiChatRoutes);

// SERVICE MANAGEMENT ROUTES
app.use("/api/services", serviceRoutes);

app.use("/api/favorites", favoriteRoutes);

// ADMIN DASHBOARD ROUTES
app.use("/api/admin", adminRoutes);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "GlowAura API is running.",

    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",

    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// PAYMENT SUCCESS RETURN
// =====================================================

app.get("/payment-success", (req, res) => {
  try {
    const bookingId = String(req.query.booking_id || "");
    const sessionId = String(req.query.session_id || "");
    const appReturnUrl = String(req.query.app_return_url || "");

    console.log("");
    console.log("======================================");
    console.log("GLOWAURA PAYMENT SUCCESS RETURN");
    console.log("======================================");

    if (!bookingId || !sessionId || !appReturnUrl) {
      return res.status(400).send(
        renderStatusPage({
          title: "Invalid Payment Return",
          heading: "Payment Return Error",
          message:
            "Required payment return details are missing. Please open GlowAura and check your booking.",
        })
      );
    }

    if (!isValidObjectId(bookingId)) {
      return res.status(400).send(
        renderStatusPage({
          title: "Invalid Booking",
          heading: "Invalid Booking Details",
          message: "The booking reference is invalid.",
        })
      );
    }

    if (!isValidStripeSessionId(sessionId)) {
      return res.status(400).send(
        renderStatusPage({
          title: "Invalid Stripe Session",
          heading: "Payment Session Error",
          message: "The Stripe payment session ID is invalid.",
        })
      );
    }

    if (!isValidAppReturnUrl(appReturnUrl, bookingId)) {
      return res.status(400).send(
        renderStatusPage({
          title: "Invalid App Return URL",
          heading: "App Return Error",
          message: "The GlowAura app return URL is invalid.",
        })
      );
    }

    const appUrl = new URL(appReturnUrl);

    appUrl.searchParams.set("sessionId", sessionId);

    const finalAppUrl = appUrl.toString();

    console.log("BOOKING ID VALID:", true);
    console.log("STRIPE SESSION VALID:", true);
    console.log("APP RETURN URL VALID:", true);
    console.log("Redirect prepared.");

    return res
      .status(200)
      .set("Cache-Control", "no-store")
      .send(
        renderStatusPage({
          title: "GlowAura Payment Return",
          heading: "Payment Received ❤️",
          message:
            "Thank you for choosing GlowAura. Open the GlowAura app to verify your payment. Your booking will be confirmed only after successful server-side verification.",
          appUrl: finalAppUrl,
          success: true,
          automaticRedirect: true,
        })
      );
  } catch (error) {
    console.error(
      "PAYMENT SUCCESS RETURN ERROR:",
      error.message
    );

    return res.status(500).send(
      renderStatusPage({
        title: "Payment Return Error",
        heading: "Something Went Wrong",
        message:
          "We received your payment return, but could not prepare the app redirect. Please open GlowAura and verify your booking.",
      })
    );
  }
});

// =====================================================
// PAYMENT CANCEL RETURN
// =====================================================

app.get("/payment-cancel", (req, res) => {
  try {
    const bookingId = String(req.query.booking_id || "");
    const appReturnUrl = String(req.query.app_return_url || "");

    console.log("");
    console.log("======================================");
    console.log("GLOWAURA PAYMENT CANCEL RETURN");
    console.log("======================================");

    let finalAppUrl = "";

    if (
      bookingId &&
      isValidObjectId(bookingId) &&
      appReturnUrl &&
      isValidAppReturnUrl(appReturnUrl, bookingId)
    ) {
      finalAppUrl = new URL(appReturnUrl).toString();
    }

    return res
      .status(200)
      .set("Cache-Control", "no-store")
      .send(
        renderStatusPage({
          title: "GlowAura Payment Cancelled",
          heading: "Payment Cancelled",
          message:
            "Your checkout was cancelled. No successful payment has been confirmed. Return to GlowAura and try again whenever you are ready.",
          appUrl: finalAppUrl,
          success: false,
          automaticRedirect: false,
        })
      );
  } catch (error) {
    console.error(
      "PAYMENT CANCEL ERROR:",
      error.message
    );

    return res.status(500).send(
      renderStatusPage({
        title: "Payment Cancel Error",
        heading: "Something Went Wrong",
        message:
          "Unable to process the payment cancellation return.",
      })
    );
  }
});

// =====================================================
// API NOT FOUND
// =====================================================

app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint not found.",
    path: req.originalUrl,
  });
});

// =====================================================
// PAGE NOT FOUND
// =====================================================

app.use((req, res) => {
  return res.status(404).send(
    renderStatusPage({
      title: "GlowAura Page Not Found",
      heading: "Page Not Found",
      message: "The page you are looking for does not exist.",
    })
  );
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("GLOBAL SERVER ERROR:", error);

  if (res.headersSent) {
    return next(error);
  }

  const status =
    Number(error.status || error.statusCode) || 500;

  return res.status(status).json({
    success: false,

    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : error.message || "Internal server error.",
  });
});

// =====================================================
// GET LOCAL NETWORK IP ADDRESSES
// =====================================================

const getLocalNetworkAddresses = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const interfaceName of Object.keys(interfaces)) {
    const networkAddresses = interfaces[interfaceName] || [];

    for (const address of networkAddresses) {
      if (
        address.family === "IPv4" &&
        !address.internal
      ) {
        addresses.push(address.address);
      }
    }
  }

  return [...new Set(addresses)];
};

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
  try {
    console.log("");
    console.log("======================================");
    console.log("GLOWAURA BACKEND STARTING");
    console.log("======================================");

    await connectDB();

    console.log("MongoDB connected successfully.");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log("");
      console.log("======================================");
      console.log("GLOWAURA SERVER RUNNING");
      console.log("======================================");

      console.log(
        `LOCAL API: http://localhost:${PORT}/api`
      );

      console.log(
        `HEALTH: http://localhost:${PORT}/api/health`
      );

      const addresses = getLocalNetworkAddresses();

      if (addresses.length > 0) {
        console.log("");
        console.log("MOBILE / LAN API ADDRESSES:");

        addresses.forEach((address) => {
          console.log(
            `http://${address}:${PORT}/api`
          );
        });
      }

      console.log("");
      console.log("PAYMENT SUCCESS:");
      console.log(
        `http://localhost:${PORT}/payment-success`
      );

      console.log("");
      console.log("PAYMENT CANCEL:");
      console.log(
        `http://localhost:${PORT}/payment-cancel`
      );

      console.log("");
      console.log("ADMIN API:");
      console.log(
        `http://localhost:${PORT}/api/admin/overview`
      );

      console.log("");
      console.log("SERVICE API:");
      console.log(
        `http://localhost:${PORT}/api/services`
      );

      console.log("");
      console.log("ADMIN SERVICES API:");
      console.log(
        `http://localhost:${PORT}/api/services/admin`
      );

      console.log("");
      console.log("======================================");
      console.log("GLOWAURA BACKEND READY ❤️");
      console.log("======================================");
      console.log("");
    });

    server.on("error", (error) => {
      console.error(
        "GLOWAURA SERVER LISTEN ERROR:",
        error
      );
    });

    return server;
  } catch (error) {
    console.error("");
    console.error("SERVER START ERROR:", error);
    console.error("");

    process.exitCode = 1;
    throw error;
  }
};

// =====================================================
// START ONLY WHEN EXECUTED DIRECTLY
// =====================================================

if (require.main === module) {
  startServer().catch(() => {
    // Error already logged inside startServer.
  });
}

// =====================================================
// EXPORT
// =====================================================

module.exports = app;
module.exports.startServer = startServer;
