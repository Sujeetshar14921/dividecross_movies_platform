const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");
const protect = require("../middlewares/auth");
const { verifyAdmin } = require("../middlewares/adminAuth");

// 📩 Submit support ticket (public - no auth required)
router.post("/contact", supportController.createSupportTicket);

// Protected routes (require authentication)
router.use(protect);

// 🎫 Get user's own tickets
router.get("/my-tickets", supportController.getUserTickets);

// Admin only routes
router.get("/all", verifyAdmin, supportController.getAllTickets);
router.put("/:id", verifyAdmin, supportController.updateTicket);

module.exports = router;
