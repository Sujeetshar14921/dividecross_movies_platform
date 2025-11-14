const express = require("express");
const router = express.Router();

// ✅ Import all controller functions
const {
  register,
  login,
  verifyOtp,
  requestResetOtp,
  resetPasswordOtp,
} = require("../controllers/authController");

// ✅ Define routes
router.post("/register", register); // Registration + OTP send
router.post("/login", login); // Login (only if verified)
router.post("/verify-otp", verifyOtp); // Verify registration OTP
router.post("/request-reset-otp", requestResetOtp); // Forgot password OTP
router.post("/reset-password-otp", resetPasswordOtp); // Reset password using OTP

module.exports = router;
