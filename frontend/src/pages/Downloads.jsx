import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaTrash, FaClock, FaHdd } from "react-icons/fa";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await API.get("/api/movies/downloads");
      setDownloads(response.data.downloads || []);
    } catch (err) {
      // Error fetching downloads
    } finally {
      setLoading(false);
    }
  };

  const removeDownload = async (movieId) => {
    if (window.confirm("Are you sure you want to remove this download?")) {
      try {
        await API.delete(`/api/movies/downloads/${movieId}`);
        setDownloads(downloads.filter(item => item.movieId !== movieId));
      } catch (err) {
        // Error removing download
      }
    }
  };

  const calculateDaysLeft = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
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
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <FaDownload className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              My Downloads
            </h1>
            <p className="text-gray-400">Offline movies available for viewing</p>
          </div>
        </motion.div>

        {downloads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FaDownload className="text-6xl text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No downloads yet</h2>
            <p className="text-gray-500">Download movies to watch offline</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((item, index) => {
              const daysLeft = calculateDaysLeft(item.expiresAt);
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={item.moviePoster || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%231a1a1a' width='400' height='250'/%3E%3Ctext fill='%23ffffff' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                      alt={item.movieTitle}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/movie/${item.movieId}`)}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {item.quality}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{item.movieTitle}</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-yellow-500" />
                        <span>
                          {daysLeft > 0 ? `Expires in ${daysLeft} days` : "Expired"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaHdd className="text-blue-500" />
                        <span>Downloaded on {new Date(item.downloadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/movie/${item.movieId}`)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                      >
                        Watch Now
                      </button>
                      <button
                        onClick={() => removeDownload(item.movieId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;
