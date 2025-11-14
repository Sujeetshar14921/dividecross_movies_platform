import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/datasets";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await User.findOne({ email: "sujeetsharmadc56@gmail.com" });
    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Sharma@123", 10);
    const admin = new User({
      name: "Sujeet Sharma",
      email: "sujeetsharmadc56@gmail.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });

    await admin.save();
    console.log("🎉 Admin created successfully:");
    console.log("Email: sujeetsharmadc56@gmail.com");
    console.log("Password: Sharma@123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createAdmin();
