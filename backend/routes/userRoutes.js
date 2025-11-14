const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { getUserProfile, updateUserProfile } = require("../controllers/userController");

// ✅ Get current user profile
router.get("/me", verifyToken, getUserProfile);

// ✅ Update user profile
router.put("/update-profile", verifyToken, updateUserProfile);

module.exports = router;
