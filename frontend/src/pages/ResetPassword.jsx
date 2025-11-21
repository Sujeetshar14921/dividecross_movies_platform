import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import API from "../api/axios";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromLink = location.state?.email || "";

  const [email, setEmail] = useState(emailFromLink);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/api/auth/verify-reset-otp", {
        email,
        otp,
        newPassword,
      });
      alert("✅ Password reset successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setMessage("Please enter your email to resend OTP.");
      return;
    }
    try {
      setResending(true);
      await API.post("/api/auth/request-reset-otp", { email });
      setMessage("📩 New OTP sent to your email!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Failed to resend OTP. Try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg shadow-purple-500/50">
                <FaShieldAlt className="text-4xl text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              Create New Password
            </h2>
            <p className="text-gray-400">Enter OTP and new password</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex gap-2">
                <div className="relative group flex-1">
                  <FaCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-blue-400 hover:bg-white/10 hover:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  {resending ? "..." : "Resend"}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </motion.div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-3 text-blue-400 text-sm text-center"
              >
                {message}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

