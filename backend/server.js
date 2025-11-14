require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { verifyEmailConfig } = require("./config/emailConfig");

const tmdbRoutes = require("./routes/tmdbRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const recommendRoutes = require("./routes/recommendRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const supportRoutes = require("./routes/supportRoutes");

const app = express();

// ✅ Simple, safe JSON parser
app.use(express.json({ limit: "10mb" }));

// ✅ Enable CORS for frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://dividecross-movies-platform-na3z.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ Mount API Routes
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/recommendations", recommendRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/support", supportRoutes);

// ✅ Root Health Check
app.get("/", (req, res) => {
  res.send("🎬 CineVerse Backend Running Successfully!");
});

// ✅ Global Error Handler (prevents crashes)
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎬 TMDb API ready - Direct fetching enabled`);
  
  // Verify email configuration (non-blocking)
  verifyEmailConfig().catch(err => {
    console.log('⚠️ Email verification skipped:', err.message);
  });
});
