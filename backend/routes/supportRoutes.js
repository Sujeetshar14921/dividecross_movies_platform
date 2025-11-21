const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");
const { verifyToken } = require("../middlewares/auth");
const { verifyAdmin } = require("../middlewares/adminAuth");

// 📩 Submit support ticket (public - no auth required)
router.post("/contact", supportController.createSupportTicket);

// 🎫 Get user's own tickets (requires authentication)
router.get("/my-tickets", verifyToken, supportController.getUserTickets);

// Admin only routes
router.get("/all", verifyAdmin, supportController.getAllTickets);
router.put("/:id", verifyAdmin, supportController.updateTicket);

module.exports = router;
