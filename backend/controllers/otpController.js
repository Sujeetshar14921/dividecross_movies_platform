const User = require("../models/userModel");
const { sendOtpEmail } = require("../services/otpService");

// Temporary in-memory OTP store (for production, use Redis)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =========================================================
// SEND OTP - For registration or password reset
// =========================================================
exports.sendOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body; // purpose: "registration" or "password-reset"

    if (!email || !purpose) {
      return res.status(400).json({ message: "Email and purpose are required" });
    }

    // Check if user exists for password reset
    if (purpose === "password-reset") {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    // Check if user already exists for registration
    if (purpose === "registration") {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isVerified) {
        return res.status(409).json({ message: "User already exists" });
      }
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP in memory
    otpStore.set(email, { otp, expiresAt, purpose });

    // Send OTP email
    const subject = purpose === "registration" 
      ? "Verify your CineVerse account" 
      : "CineVerse Password Reset OTP";

    await sendOtpEmail(email, otp, subject);

    res.status(200).json({
      message: "OTP sent to your email successfully",
      expiresIn: "5 minutes"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// =========================================================
// VERIFY OTP - For registration or password reset
// =========================================================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    if (!email || !otp || !purpose) {
      return res.status(400).json({ message: "Email, OTP, and purpose are required" });
    }

    // Check if OTP exists
    const storedData = otpStore.get(email);
    if (!storedData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check if OTP matches and is not expired
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    // Check if purpose matches
    if (storedData.purpose !== purpose) {
      return res.status(400).json({ message: "OTP purpose mismatch" });
    }

    // Remove OTP from store after verification
    otpStore.delete(email);

    res.status(200).json({
      message: "OTP verified successfully",
      verified: true
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify OTP", error: error.message });
  }
};
