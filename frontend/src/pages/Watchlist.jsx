import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBookmark, FaTrash, FaStar } from "react-icons/fa";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await API.get("/api/movies/watchlist");
      setWatchlist(response.data.watchlist || []);
    } catch (err) {
      console.error("Error fetching watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await API.delete(`/api/movies/watchlist/${movieId}`);
      setWatchlist(watchlist.filter(item => item.movieId !== movieId));
    } catch (err) {
      console.error("Error removing from watchlist:", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <FaBookmark className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              My Watchlist
            </h1>
            <p className="text-gray-400">Movies saved for later</p>
          </div>
        </motion.div>

        {watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 md:py-20"
          >
            <FaBookmark className="text-4xl sm:text-5xl md:text-6xl text-gray-700 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">Your watchlist is empty</h2>
            <p className="text-sm sm:text-base text-gray-500">Start adding movies you want to watch later!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {watchlist.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer">
                  <img
                    src={item.moviePoster || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect fill='%231a1a1a' width='300' height='450'/%3E%3Ctext fill='%23ffffff' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                    alt={item.movieTitle}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                    onClick={() => navigate(`/movie/${item.movieId}`)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg mb-2">{item.movieTitle}</h3>
                    <button
                      onClick={() => removeFromWatchlist(item.movieId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center transition-colors"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
