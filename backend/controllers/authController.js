const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../services/otpService");

// Temporary in-memory OTP store
const otpStore = new Map();

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =========================================================
// REGISTER USER (Step 1: Create user and send OTP)
// =========================================================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or update user
    let user;
    if (existingUser) {
      user = existingUser;
      user.name = name;
      user.password = hashedPassword;
      user.isVerified = false;
    } else {
      user = new User({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      });
    }

    await user.save();

    // Generate and send OTP
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(email, { otp, expiresAt, purpose: "registration" });

    console.log(`📧 Sending OTP to ${email}...`);
    
    // Send OTP email
    try {
      await sendOtpEmail(email, otp, "Verify Your Email - CineVerse");
      console.log(`✅ OTP sent successfully to ${email}`);
    } catch (emailError) {
      console.error(`❌ Failed to send OTP to ${email}:`, emailError.message);
      // Don't fail registration if email fails
      return res.status(201).json({
        message: "Registration successful but email failed. Please contact support for OTP.",
        email: user.email,
        warning: "Email delivery issue - check spam folder or contact support"
      });
    }

    res.status(201).json({
      message: "OTP sent to your email. Please check your inbox and spam folder.",
      email: user.email
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================
// VERIFY OTP (Step 2: Verify email with OTP)
// =========================================================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const storedOtpData = otpStore.get(email);
    
    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as verified
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    // Clear OTP
    otpStore.delete(email);

    res.status(200).json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================
// USER LOGIN
// =========================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Admin login check
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET || "mysecretkey",
        { expiresIn: "7d" }
      );
      return res.status(200).json({
        message: "Admin login successful",
        role: "admin",
        token,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        message: "Please verify your email before login.",
        requiresVerification: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({ 
      message: "Login successful", 
      role: "user", 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================
// REQUEST PASSWORD RESET OTP
// =========================================================
exports.requestResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and send OTP
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(email, { otp, expiresAt, purpose: "password-reset" });

    console.log(`📧 Sending password reset OTP to ${email}...`);
    
    // Send OTP email
    try {
      await sendOtpEmail(email, otp, "Reset Your Password - CineVerse");
      console.log(`✅ Password reset OTP sent to ${email}`);
    } catch (emailError) {
      console.error(`❌ Failed to send reset OTP to ${email}:`, emailError.message);
      return res.status(500).json({ 
        message: "Failed to send OTP email. Please check your email address or try again later.",
        error: emailError.message 
      });
    }

    res.status(200).json({ 
      message: "OTP sent to your email. Please check your inbox and spam folder." 
    });
  } catch (error) {
    console.error("Request reset OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================
// VERIFY OTP AND RESET PASSWORD
// =========================================================
exports.verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const storedOtpData = otpStore.get(email);
    
    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (storedOtpData.purpose !== "password-reset") {
      return res.status(400).json({ message: "Invalid OTP purpose" });
    }

    // Reset password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear OTP
    otpStore.delete(email);

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Verify OTP and reset password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================
// RESET PASSWORD (Deprecated - use verifyOtpAndResetPassword)
// =========================================================
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
