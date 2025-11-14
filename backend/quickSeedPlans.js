// Quick test script to seed plans
require("dotenv").config();
const mongoose = require("mongoose");

const plans = [
  {
    name: "Basic",
    price: 199,
    duration: 30,
    features: ["Watch full movies", "720p HD", "No ads", "5 downloads"],
    maxResolution: "720p",
    canDownload: true,
    adsEnabled: false,
    status: "active"
  },
  {
    name: "Premium",
    price: 499,
    duration: 30,
    features: ["1080p Full HD", "No ads", "20 downloads", "2 devices"],
    maxResolution: "1080p",
    canDownload: true,
    adsEnabled: false,
    status: "active"
  },
  {
    name: "Ultra",
    price: 999,
    duration: 30,
    features: ["4K Ultra HD", "Unlimited downloads", "4 devices"],
    maxResolution: "4K",
    canDownload: true,
    adsEnabled: false,
    status: "active"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    const SubscriptionPlan = mongoose.model("SubscriptionPlan", new mongoose.Schema({
      name: String,
      price: Number,
      duration: Number,
      features: [String],
      maxResolution: String,
      canDownload: Boolean,
      adsEnabled: Boolean,
      status: String
    }));
    
    await SubscriptionPlan.deleteMany({});
    await SubscriptionPlan.insertMany(plans);
    
    console.log("✅ Plans seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

seed();
