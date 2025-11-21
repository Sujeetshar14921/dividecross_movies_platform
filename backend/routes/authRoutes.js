const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyOtp,
  requestResetOtp,
  verifyOtpAndResetPassword,
  resetPassword,
} = require("../controllers/authController");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/request-reset-otp", requestResetOtp);
router.post("/verify-reset-otp", verifyOtpAndResetPassword);
router.post("/reset-password", resetPassword); // Deprecated, kept for backward compatibility

module.exports = router;
