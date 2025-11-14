import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHistory, FaTrash, FaCheckCircle, FaClock, FaSearch, FaTimes } from "react-icons/fa";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const History = () => {
  const [history, setHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    fetchSearchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await API.get("/api/movies/history");
      setHistory(response.data.history || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const response = await API.get("/api/movies/search-history");
      setSearchHistory(response.data.searchHistory || []);
    } catch (err) {
      console.error("Error fetching search history:", err);
    }
  };

  const clearAllHistory = async () => {
    if (window.confirm("Are you sure you want to clear all watch history?")) {
      try {
        await API.delete("/api/movies/history");
        setHistory([]);
      } catch (err) {
        console.error("Error clearing history:", err);
      }
    }
  };

  const clearAllSearchHistory = async () => {
    if (window.confirm("Are you sure you want to clear all search history?")) {
      try {
        await API.delete("/api/movies/search-history");
        setSearchHistory([]);
      } catch (err) {
        console.error("Error clearing search history:", err);
      }
    }
  };

  const deleteSearchKeyword = async (id) => {
    try {
      await API.delete(`/api/movies/search-history/${id}`);
      setSearchHistory(searchHistory.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error deleting search keyword:", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search History Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FaSearch className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Search History
                </h2>
                <p className="text-gray-400">Your recent search keywords</p>
              </div>
            </div>
            {searchHistory.length > 0 && (
              <button
                onClick={clearAllSearchHistory}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <FaTrash /> Clear All
              </button>
            )}
          </div>

          {searchHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 bg-gray-800/30 rounded-xl border border-gray-700/50"
            >
              <FaSearch className="text-4xl text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No search history yet</p>
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {searchHistory.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/30 rounded-full px-5 py-2.5 flex items-center gap-3 transition-all duration-300"
                >
                  <FaSearch className="text-blue-400 text-sm" />
                  <span className="text-white font-medium">{item.query}</span>
                  <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-0.5 rounded-full">
                    {item.searchCount}
                  </span>
                  <button
                    onClick={() => deleteSearchKeyword(item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                    title="Remove"
                  >
                    <FaTimes />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Watch History Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <FaHistory className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  Watch History
                </h2>
                <p className="text-gray-400">Recently watched movies</p>
              </div>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <FaTrash /> Clear All
              </button>
            )}
          </div>

        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FaHistory className="text-6xl text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No watch history</h2>
            <p className="text-gray-500">Movies you watch will appear here</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/movie/${item.movieId}`)}
                className="bg-gray-800/50 hover:bg-gray-700/70 rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 border border-gray-700/50 hover:border-purple-500/50"
              >
                <img
                  src={item.moviePoster || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='150'%3E%3Crect fill='%231a1a1a' width='100' height='150'/%3E%3Ctext fill='%23ffffff' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                  alt={item.movieTitle}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.movieTitle}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaClock /> {new Date(item.watchedAt).toLocaleDateString()}
                    </span>
                    {item.completed && (
                      <span className="flex items-center gap-1 text-green-500">
                        <FaCheckCircle /> Completed
                      </span>
                    )}
                  </div>
                  {item.progress > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.progress}% watched</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
