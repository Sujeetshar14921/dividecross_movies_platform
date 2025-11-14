const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middlewares/adminAuth"); // ✅ correct path
const adminController = require("../controllers/adminController");

// 📊 Dashboard Stats
router.get("/dashboard", verifyAdmin, adminController.getDashboardStats);

// 🌟 Toggle Featured Movie
router.put("/toggle-feature/:id", verifyAdmin, adminController.toggleFeatured);

// 🗑️ Bulk Delete Movies
router.post("/bulk-delete", verifyAdmin, adminController.bulkDeleteMovies);

module.exports = router;
