import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function SearchBar({ onSearchResults }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // 🔍 Search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      onSearchResults(null); // Clear search
      return;
    }

    try {
      const res = await API.get(`/api/movies/search?q=${query}`);
      onSearchResults(res.data.movies || res.data.results || []);
      setShowDropdown(false);
    } catch (err) {
      console.error("Search failed", err);
      onSearchResults([]);
    }
  };

  // ⚡ Live search suggestions
  const fetchSuggestions = async (text) => {
    setQuery(text);
    if (!text.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await API.get(`/api/movies/suggestions?q=${text}`);
      setSuggestions(res.data.suggestions || []);
      setShowDropdown(res.data.suggestions?.length > 0);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  const handleSelectSuggestion = (movie) => {
    setShowDropdown(false);
    setQuery("");
    // Navigate to movie details page
    navigate(`/movie/${movie.id || movie.tmdbId}`);
  };

  return (
    <div className="relative border-b border-white/5 mb-8 z-50">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/30 blur-3xl rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 right-1/4 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-24 sm:pb-32"
      >
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
            dividecross
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 text-lg sm:text-xl font-light mb-2"
          >
            Discover Your Next Favorite Movie
          </motion.p>
        </motion.div>

        {/* 🔎 Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative flex justify-center z-50"
        >
          <form onSubmit={handleSearch} className="relative w-full max-w-3xl z-50">
            <div className="relative group z-50">
              {/* Search Icon */}
              <FaSearch className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl group-focus-within:text-red-500 transition-colors z-10" />

              <input
                type="text"
                placeholder="Search for movies, actors, directors..."
                value={query}
                onChange={(e) => fetchSuggestions(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="w-full p-4 sm:p-5 pl-12 sm:pl-16 pr-24 sm:pr-36 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-white/10 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all text-base sm:text-lg shadow-2xl placeholder-gray-500"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-2 top-2 bg-gradient-to-r from-red-600 to-pink-600 px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-red-700 hover:to-pink-700 transition-all font-bold shadow-lg hover:shadow-red-500/50 flex items-center gap-2 text-sm sm:text-base"
              >
                <FaSearch />
                <span className="hidden sm:inline">Search</span>
              </motion.button>

              {/* ✨ Suggestions Dropdown - Subtle & Clean */}
              {showDropdown && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[99999] max-h-[400px] overflow-y-auto"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4b5563 #1f2937'
                  }}
                >
                  {/* Header */}
                  <div className="px-4 py-2 bg-white/5 border-b border-white/10">
                    <p className="text-xs text-gray-400">
                      {suggestions.length} {suggestions.length === 1 ? 'result' : 'results'}
                    </p>
                  </div>

                  {/* Suggestions List */}
                  <div className="divide-y divide-white/5">
                    {suggestions.map((s, idx) => (
                      <motion.div
                        key={s._id || s.id || s.tmdbId || `sug-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => handleSelectSuggestion(s)}
                        className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-all duration-200 flex items-center gap-3 group"
                      >
                        {/* Search Icon */}
                        <FaSearch className="text-gray-500 text-sm flex-shrink-0 group-hover:text-gray-400 transition-colors" />

                        {/* Movie Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate group-hover:text-gray-100 transition-colors">
                            {s.title}
                          </p>
                          {(s.release_date || s.releaseDate) && (
                            <p className="text-gray-500 text-xs mt-0.5">
                              {new Date(s.release_date || s.releaseDate).getFullYear()}
                            </p>
                          )}
                        </div>

                        {/* Rating Badge */}
                        {(s.vote_average || s.rating) && (
                          <span className="text-yellow-400 text-xs font-medium flex-shrink-0">
                            ⭐ {(s.vote_average || s.rating).toFixed(1)}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
