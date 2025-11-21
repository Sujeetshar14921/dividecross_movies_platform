const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { verifyToken } = require("../middlewares/auth");

// 🧪 Debug middleware to log all payment route requests
router.use((req, res, next) => {
  console.log(`\n📨 Payment Route Hit: ${req.method} ${req.path}`);
  console.log("   Headers:", req.headers.authorization ? "✅ Auth header present" : "❌ No auth header");
  console.log("   Body:", JSON.stringify(req.body));
  next();
});

// 📋 Get all subscription plans (public)
router.get("/plans", paymentController.getSubscriptionPlans);

// 💳 Subscription routes (require authentication)
router.post("/subscription/create-order", verifyToken, paymentController.createSubscriptionOrder);
router.post("/subscription/verify", verifyToken, paymentController.verifySubscriptionPayment);
router.get("/subscription/current", verifyToken, paymentController.getUserSubscription);
router.post("/subscription/cancel", verifyToken, paymentController.cancelSubscription);

// 🎬 Movie purchase routes
router.post("/movie/create-order", paymentController.createMoviePurchaseOrder);
router.post("/movie/verify", paymentController.verifyMoviePurchasePayment);
router.get("/movie/purchased", paymentController.getPurchasedMovies);
router.get("/movie/access/:movieId", paymentController.checkMovieAccess);

// 📜 Transaction history
router.get("/transactions", paymentController.getTransactionHistory);

module.exports = router;
