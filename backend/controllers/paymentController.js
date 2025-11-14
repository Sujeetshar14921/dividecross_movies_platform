const Razorpay = require("razorpay");
const crypto = require("crypto");
const UserSubscription = require("../models/userSubscriptionModel");
const MoviePurchase = require("../models/moviePurchaseModel");
const Transaction = require("../models/transactionModel");
const SubscriptionPlan = require("../models/subscriptionPlanModel");

// Initialize Razorpay (only if keys are provided)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID.trim(),
      key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
    });
    console.log("✅ Razorpay initialized successfully");
    console.log("   Key ID:", process.env.RAZORPAY_KEY_ID.trim().substring(0, 15) + "...");
  } catch (error) {
    console.error("❌ Razorpay initialization failed:", error.message);
    razorpay = null;
  }
} else {
  console.warn("⚠️  Razorpay keys not found - Payment features disabled");
  console.warn("   KEY_ID present:", !!process.env.RAZORPAY_KEY_ID);
  console.warn("   KEY_SECRET present:", !!process.env.RAZORPAY_KEY_SECRET);
}

/**
 * 📋 Get all subscription plans
 */
exports.getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ status: 'active' }).sort({ price: 1 });
    res.status(200).json({ plans });
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    res.status(500).json({ message: "Error fetching plans", error: error.message });
  }
};

/**
 * 💳 Create Razorpay order for subscription
 */
exports.createSubscriptionOrder = async (req, res) => {
  try {
    console.log("📥 Received request body:", req.body);
    console.log("👤 User from auth middleware:", req.user);

    if (!razorpay) {
      console.error("❌ Payment service not available - Razorpay not initialized");
      return res.status(503).json({ 
        message: "Payment service temporarily unavailable. Please contact support or try again later.",
        error: "Razorpay gateway not configured properly"
      });
    }

    const { planId } = req.body;
    
    // Fix: Use req.user.id instead of req.user._id
    const userId = req.user.id || req.user._id;

    if (!userId) {
      console.error("❌ User ID not found in request");
      return res.status(401).json({ message: "User authentication failed. Please login again." });
    }

    if (!planId) {
      console.error("❌ Plan ID not provided");
      return res.status(400).json({ message: "Plan ID is required" });
    }

    console.log("📊 Creating subscription order:");
    console.log("   Plan ID:", planId);
    console.log("   User ID:", userId);

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      console.error("❌ Plan not found for ID:", planId);
      return res.status(404).json({ message: "Plan not found" });
    }

    console.log("✅ Plan found:", plan.name, "- ₹", plan.price);

    // Create Razorpay order
    // Receipt must be max 40 characters
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const userIdShort = userId.toString().slice(-8); // Last 8 chars of userId
    const receipt = `sub_${userIdShort}_${timestamp}`; // Total: 4 + 8 + 1 + 8 = 21 chars
    
    const options = {
      amount: plan.price * 100, // Amount in paise
      currency: "INR",
      receipt: receipt,
      notes: {
        userId: userId.toString(),
        planId: planId.toString(),
        planName: plan.name,
        type: 'subscription'
      }
    };

    console.log("📤 Creating Razorpay order with options:", options);
    
    let order;
    try {
      order = await razorpay.orders.create(options);
      console.log("✅ Razorpay order created successfully:", order.id);
    } catch (razorpayError) {
      console.error("❌ Razorpay API Error:");
      console.error("   Status:", razorpayError.statusCode);
      console.error("   Error:", razorpayError.error);
      console.error("   Message:", razorpayError.error?.description || razorpayError.message);
      throw new Error(`Razorpay API failed: ${razorpayError.error?.description || razorpayError.message || 'Unknown error'}`);
    }

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planDetails: plan
    });
  } catch (error) {
    console.error("❌ Error creating subscription order:");
    console.error("   Message:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

/**
 * ✅ Verify subscription payment and activate
 */
exports.verifySubscriptionPayment = async (req, res) => {
  try {
    console.log("🔍 Verifying subscription payment...");
    console.log("   Request body:", req.body);
    console.log("   User:", req.user);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    const userId = req.user.id || req.user._id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("❌ Missing payment details");
      return res.status(400).json({ message: "Missing payment details" });
    }

    if (!planId) {
      console.error("❌ Plan ID not provided");
      return res.status(400).json({ message: "Plan ID is required" });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    console.log("🔐 Signature verification:");
    console.log("   Received:", razorpay_signature);
    console.log("   Expected:", expectedSign);

    if (razorpay_signature !== expectedSign) {
      console.error("❌ Invalid payment signature");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    console.log("✅ Signature verified successfully");

    // Get plan details
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      console.error("❌ Plan not found for ID:", planId);
      return res.status(404).json({ message: "Plan not found" });
    }

    console.log("📋 Plan details:", plan.name, "-", plan.duration, "days");

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    console.log("📅 Subscription period:", startDate, "to", endDate);

    // Cancel any existing active subscriptions
    const cancelResult = await UserSubscription.updateMany(
      { userId, status: 'active' },
      { status: 'cancelled' }
    );
    console.log("🔄 Cancelled existing subscriptions:", cancelResult.modifiedCount);

    // Create new subscription
    const subscription = await UserSubscription.create({
      userId,
      planId: plan._id,
      planName: plan.name,
      startDate,
      endDate,
      status: 'active',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

    console.log("✅ Subscription created:", subscription._id);

    // Create transaction record
    await Transaction.create({
      userId,
      type: 'subscription',
      amount: plan.price,
      currency: 'INR',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentMethod: 'card', // Can be detected from payment details
      status: 'success',
      itemId: plan._id,
      itemName: plan.name,
      gateway: 'razorpay'
    });

    console.log("✅ Transaction recorded");

    res.status(200).json({
      success: true,
      message: "Subscription activated successfully",
      subscription,
      expiryDate: endDate
    });
  } catch (error) {
    console.error("❌ Error verifying subscription payment:", error);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};

/**
 * 🎬 Create order for single movie purchase
 */
exports.createMoviePurchaseOrder = async (req, res) => {
  try {
    console.log("🎬 Creating movie purchase order...");
    console.log("   Request body:", req.body);
    console.log("   User:", req.user);

    if (!razorpay) {
      console.error("❌ Payment service not available");
      return res.status(503).json({ 
        message: "Payment service temporarily unavailable. Please try again later." 
      });
    }

    const { movieId, movieTitle, price } = req.body;
    const userId = req.user.id || req.user._id;

    if (!userId) {
      console.error("❌ User ID not found");
      return res.status(401).json({ message: "User authentication failed" });
    }

    if (!movieId || !movieTitle || !price) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ message: "Missing required fields: movieId, movieTitle, price" });
    }

    console.log("📊 Movie purchase details:");
    console.log("   Movie ID:", movieId);
    console.log("   Movie Title:", movieTitle);
    console.log("   Price: ₹", price);
    console.log("   User ID:", userId);

    // Create Razorpay order
    // Receipt must be max 40 characters
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits
    const userIdShort = userId.toString().slice(-6); // Last 6 chars
    const movieIdShort = movieId.toString().slice(-6); // Last 6 chars
    const receipt = `mov_${userIdShort}_${movieIdShort}_${timestamp}`; // Total: 4+6+1+6+1+6 = 24 chars
    
    const options = {
      amount: price * 100, // Amount in paise
      currency: "INR",
      receipt: receipt,
      notes: {
        userId: userId.toString(),
        movieId: movieId.toString(),
        movieTitle: movieTitle,
        type: 'movie_purchase'
      }
    };

    console.log("📤 Creating Razorpay order...");
    const order = await razorpay.orders.create(options);
    console.log("✅ Order created:", order.id);

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Error creating movie purchase order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

/**
 * ✅ Verify movie purchase payment
 */
exports.verifyMoviePurchasePayment = async (req, res) => {
  try {
    console.log("🔍 Verifying movie purchase payment...");
    console.log("   Request body:", req.body);
    console.log("   User:", req.user);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, movieId, movieTitle, price } = req.body;
    const userId = req.user.id || req.user._id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("❌ Missing payment details");
      return res.status(400).json({ message: "Missing payment details" });
    }

    if (!movieId || !movieTitle || !price) {
      console.error("❌ Missing movie details");
      return res.status(400).json({ message: "Missing movie details" });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error("❌ Invalid payment signature");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    console.log("✅ Signature verified successfully");

    // Set expiry date (48 hours from purchase)
    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 48);

    console.log("📅 Purchase date:", purchaseDate);
    console.log("📅 Expiry date:", expiryDate);

    // Create movie purchase record
    console.log("💾 Creating movie purchase record...");
    const purchase = await MoviePurchase.create({
      userId,
      movieId,
      movieTitle,
      price,
      purchaseDate,
      expiryDate,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'active'
    });
    console.log("✅ Purchase record created:", purchase._id);

    // Create transaction record
    console.log("📝 Creating transaction record...");
    await Transaction.create({
      userId,
      type: 'movie_purchase',
      amount: price,
      currency: 'INR',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentMethod: 'card',
      status: 'success',
      itemId: movieId,
      itemName: movieTitle,
      gateway: 'razorpay'
    });
    console.log("✅ Transaction recorded");

    console.log("🎉 Movie purchase completed successfully!");
    res.status(200).json({
      success: true,
      message: "Movie purchase successful",
      purchase,
      expiresAt: expiryDate
    });
  } catch (error) {
    console.error("Error verifying movie purchase:", error);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};

/**
 * 📊 Get user's current subscription
 */
exports.getUserSubscription = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    }).populate('planId');

    if (!subscription) {
      return res.status(200).json({ subscription: null, hasActiveSubscription: false });
    }

    res.status(200).json({
      subscription,
      hasActiveSubscription: true,
      daysRemaining: Math.ceil((subscription.endDate - new Date()) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    res.status(500).json({ message: "Error fetching subscription", error: error.message });
  }
};

/**
 * 🎬 Check if user has access to a movie
 */
exports.checkMovieAccess = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { movieId } = req.params;

    // Check active subscription
    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    });

    if (subscription) {
      return res.status(200).json({
        hasAccess: true,
        accessType: 'subscription',
        subscription
      });
    }

    // Check movie purchase
    const purchase = await MoviePurchase.findOne({
      userId,
      movieId,
      status: 'active',
      expiryDate: { $gt: new Date() }
    });

    if (purchase) {
      return res.status(200).json({
        hasAccess: true,
        accessType: 'purchase',
        purchase
      });
    }

    res.status(200).json({
      hasAccess: false,
      message: "No active subscription or purchase found"
    });
  } catch (error) {
    console.error("Error checking movie access:", error);
    res.status(500).json({ message: "Error checking access", error: error.message });
  }
};

/**
 * 📜 Get user's transaction history
 */
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId })
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ userId });

    res.status(200).json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};

/**
 * ❌ Cancel subscription
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    res.status(200).json({
      message: "Subscription cancelled successfully",
      subscription
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ message: "Error cancelling subscription", error: error.message });
  }
};

/**
 * 🎬 Get user's purchased movies
 */
exports.getPurchasedMovies = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const purchases = await MoviePurchase.find({
      userId,
      status: 'active',
      expiryDate: { $gt: new Date() }
    }).sort({ purchaseDate: -1 });

    res.status(200).json({ purchases });
  } catch (error) {
    console.error("Error fetching purchased movies:", error);
    res.status(500).json({ message: "Error fetching purchases", error: error.message });
  }
};

module.exports = exports;
