
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp, purpose) => {
  const isRegister = purpose === "register";

  await transporter.sendMail({
    from: `"GlowAura Beauty" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: isRegister
      ? "Verify Your GlowAura Account"
      : "Your GlowAura Login OTP",

    html: `
      <div style="font-family:Georgia,serif;background:#F8F4EB;padding:35px;">
        <div style="max-width:480px;margin:auto;background:#fff;padding:35px;border-radius:16px;">
          <h1 style="color:#34483A;text-align:center;">GlowAura</h1>
          <p style="color:#777;text-align:center;">
            Your Beauty, Your Bridal Glow
          </p>
          <h2 style="color:#34483A;">
            ${isRegister ? "Welcome to GlowAura!" : "Welcome Back!"}
          </h2>
          <p style="color:#666;">
            Use this verification code to continue.
          </p>
          <h1 style="letter-spacing:10px;text-align:center;color:#B99A62;">
            ${otp}
          </h1>
          <p style="color:#777;">
            This OTP expires in 5 minutes.
            Do not share it with anyone.
          </p>
          <hr/>
          <p style="text-align:center;color:#999;">
            GlowAura Beauty Team
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = sendOTPEmail;
