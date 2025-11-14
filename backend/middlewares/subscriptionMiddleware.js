const UserSubscription = require("../models/userSubscriptionModel");
const MoviePurchase = require("../models/moviePurchaseModel");

/**
 * Middleware to check if user has active subscription
 */
exports.checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    });

    if (subscription) {
      req.subscription = subscription;
      req.hasSubscription = true;
      return next();
    }

    req.hasSubscription = false;
    res.status(403).json({
      message: "Active subscription required",
      hasAccess: false
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({ message: "Error checking subscription" });
  }
};

/**
 * Middleware to check if user has access to specific movie
 * Either through subscription or individual purchase
 */
exports.checkMovieAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.id || req.params.movieId;

    // Check subscription first
    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    });

    if (subscription) {
      req.accessType = 'subscription';
      req.hasAccess = true;
      return next();
    }

    // Check individual movie purchase
    const purchase = await MoviePurchase.findOne({
      userId,
      movieId,
      status: 'active',
      expiryDate: { $gt: new Date() }
    });

    if (purchase) {
      req.accessType = 'purchase';
      req.hasAccess = true;
      return next();
    }

    req.hasAccess = false;
    res.status(403).json({
      message: "You need to purchase this movie or have an active subscription",
      hasAccess: false,
      requiresPayment: true
    });
  } catch (error) {
    console.error("Movie access check error:", error);
    res.status(500).json({ message: "Error checking movie access" });
  }
};

/**
 * Optional middleware - checks access but doesn't block
 * Useful for showing limited content to non-subscribers
 */
exports.checkMovieAccessOptional = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      req.hasAccess = false;
      return next();
    }

    const movieId = req.params.id || req.params.movieId;

    // Check subscription
    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    });

    if (subscription) {
      req.accessType = 'subscription';
      req.hasAccess = true;
      return next();
    }

    // Check purchase
    const purchase = await MoviePurchase.findOne({
      userId,
      movieId,
      status: 'active',
      expiryDate: { $gt: new Date() }
    });

    if (purchase) {
      req.accessType = 'purchase';
      req.hasAccess = true;
      return next();
    }

    req.hasAccess = false;
    next();
  } catch (error) {
    console.error("Movie access check error:", error);
    req.hasAccess = false;
    next();
  }
};
