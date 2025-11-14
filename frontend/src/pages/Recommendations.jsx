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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 blur-3xl"></div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative container mx-auto px-6 py-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-16 bg-gradient-to-b from-purple-500 via-pink-500 to-red-500 rounded-full"></div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
              Recommended For You
            </h1>
          </div>
          <p className="text-gray-400 text-lg font-light ml-6">
            Trending movies picked just for you
          </p>
        </motion.div>
      </div>

      {/* Movies Grid */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
