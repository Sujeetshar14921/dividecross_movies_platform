import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "./MovieCard";
import { FaFire, FaClock, FaTrophy } from "react-icons/fa";

export default function FeaturedMovies({ 
  movies, 
  mostSearched, 
  recentMovies, 
  activeCategory, 
  setActiveCategory, 
  loading 
}) {
  // Remove duplicates from each array based on movie ID
  const uniqueMovies = React.useMemo(() => {
    const seen = new Set();
    return movies.filter(movie => {
      const id = movie.id || movie._id || movie.tmdbId;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [movies]);

  const uniqueMostSearched = React.useMemo(() => {
    const seen = new Set();
    return mostSearched.filter(movie => {
      const id = movie.id || movie._id || movie.tmdbId;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [mostSearched]);

  const uniqueRecentMovies = React.useMemo(() => {
    const seen = new Set();
    return recentMovies.filter(movie => {
      const id = movie.id || movie._id || movie.tmdbId;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [recentMovies]);
  
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory("featured")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeCategory === "featured"
                ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/50"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            <FaFire className={activeCategory === "featured" ? "text-white" : "text-red-500"} />
            Featured
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory("recent")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeCategory === "recent"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            <FaClock className={activeCategory === "recent" ? "text-white" : "text-blue-500"} />
            Recently Added
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory("mostSearched")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeCategory === "mostSearched"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            <FaTrophy className={activeCategory === "mostSearched" ? "text-white" : "text-purple-500"} />
            Most Searched
          </motion.button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              className="relative w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 border-r-pink-600"></div>
              <motion.div
                className="absolute inset-2 rounded-full border-4 border-transparent border-b-red-500 border-l-pink-500"
                animate={{ rotate: -360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        )}

        {/* Category Content with Animation */}
        <AnimatePresence mode="wait">
          {!loading && activeCategory === "featured" && uniqueMovies.length > 0 && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <FaFire className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Featured Movies</h2>
                  <p className="text-gray-400 text-sm">Handpicked just for you</p>
                </div>
              </div>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                variants={{
                  show: { transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
              >
                {uniqueMovies.map((movie, index) => (
                  <motion.div
                    key={`featured-${movie.id || movie._id || movie.tmdbId}-${index}`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {!loading && activeCategory === "recent" && uniqueRecentMovies.length > 0 && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FaClock className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Recently Added</h2>
                  <p className="text-gray-400 text-sm">Fresh content for you</p>
                </div>
              </div>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                variants={{
                  show: { transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
              >
                {uniqueRecentMovies.map((movie, index) => (
                  <motion.div
                    key={`recent-${movie.id || movie._id || movie.tmdbId}-${index}`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {!loading && activeCategory === "mostSearched" && uniqueMostSearched.length > 0 && (
            <motion.div
              key="mostSearched"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FaTrophy className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Most Searched</h2>
                  <p className="text-gray-400 text-sm">Popular picks by viewers</p>
                </div>
              </div>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                variants={{
                  show: { transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
              >
                {uniqueMostSearched.map((movie, index) => (
                  <motion.div
                    key={`mostSearched-${movie.id || movie._id || movie.tmdbId}-${index}`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
