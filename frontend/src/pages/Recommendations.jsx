import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import API from "../api/axios";

export default function Recommendations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await API.get("/api/recommendations/trending");
        console.log("Recommendations data:", res.data); // Debug log
        setData(res.data.movies || res.data || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Header */}
            <div className="relative z-10 bg-gradient-to-b from-black/80 to-transparent py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 sm:px-6"
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-1.5 sm:w-2 h-12 sm:h-16 bg-gradient-to-b from-purple-500 via-pink-500 to-red-500 rounded-full"></div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
              Recommended For You
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg font-light ml-5 sm:ml-6">
            Trending movies picked just for you
          </p>

      {/* Movies Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {data.map((movie, index) => (
                <motion.div
                  key={movie._id || movie.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-400 text-xl">No recommendations available at the moment</p>
              <p className="text-gray-500 text-sm mt-2">Try searching for movies on the home page</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
