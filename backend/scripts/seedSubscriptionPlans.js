require("dotenv").config();
const mongoose = require("mongoose");
const SubscriptionPlan = require("../models/subscriptionPlanModel");

const plans = [
  {
    name: "Free",
    price: 0,
    duration: 999999, // Forever
    features: [
      "Watch trailers only",
      "Browse all movies",
      "480p quality",
      "With advertisements"
    ],
    maxResolution: "480p",
    canDownload: false,
    adsEnabled: true,
    status: "active"
  },
  {
    name: "Basic",
    price: 199,
    duration: 30, // 30 days
    features: [
      "Watch full movies",
      "720p HD quality",
      "No advertisements",
      "Download up to 5 movies",
      "Watch on 1 device"
    ],
    maxResolution: "720p",
    canDownload: true,
    adsEnabled: false,
    status: "active"
  },
  {
    name: "Premium",
    price: 499,
    duration: 30,
    features: [
      "Watch full movies",
      "1080p Full HD quality",
      "No advertisements",
      "Download up to 20 movies",
      "Watch on 2 devices",
      "Early access to new releases"
    ],
    maxResolution: "1080p",
    canDownload: true,
    adsEnabled: false,
    status: "active"
  },
  {
    name: "Ultra",
    price: 999,
    duration: 30,
    features: [
      "Watch full movies",
      "4K Ultra HD quality",
      "No advertisements",
      "Unlimited downloads",
      "Watch on 4 devices",
      "Exclusive content",
      "Priority support"
    ],
    maxResolution: "4K",
    canDownload: true,
    adsEnabled: false,
    status: "active"
  }
];

async function seedPlans() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing plans
    await SubscriptionPlan.deleteMany({});
    console.log("🗑️  Cleared existing plans");

    // Insert new plans
    await SubscriptionPlan.insertMany(plans);
    console.log("✅ Successfully seeded subscription plans");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    process.exit(1);
  }
}

seedPlans();
