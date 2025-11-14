import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <motion.div
        className="relative w-16 h-16 sm:w-20 sm:h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-transparent border-t-red-600 border-r-pink-600"></div>
        <motion.div
          className="absolute inset-2 rounded-full border-3 sm:border-4 border-transparent border-b-red-500 border-l-pink-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/20 to-pink-600/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}