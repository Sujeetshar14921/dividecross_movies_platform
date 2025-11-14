import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaTimes, 
  FaCrown, 
  FaHeadset, 
  FaBookmark, 
  FaHistory, 
  FaCog, 
  FaDownload,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaBell,
  FaGift,
  FaLanguage,
  FaChevronRight
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  const menuItems = [
    { 
      icon: FaHome, 
      label: "Home", 
      path: "/", 
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      icon: FaCrown, 
      label: "Subscription Plans", 
      path: "/subscription", 
      color: "from-yellow-500 to-orange-500",
      badge: "Premium"
    },
    { 
      icon: FaBookmark, 
      label: "My Watchlist", 
      path: "/watchlist", 
      color: "from-pink-500 to-rose-500" 
    },
    { 
      icon: FaHistory, 
      label: "Watch History", 
      path: "/history", 
      color: "from-purple-500 to-indigo-500" 
    },
    { 
      icon: FaDownload, 
      label: "Downloads", 
      path: "/downloads", 
      color: "from-green-500 to-emerald-500",
      badge: "New"
    },
    { 
      icon: FaBell, 
      label: "Notifications", 
      path: "/notifications", 
      color: "from-red-500 to-pink-500" 
    },
    { 
      icon: FaGift, 
      label: "Offers & Rewards", 
      path: "/offers", 
      color: "from-amber-500 to-yellow-500" 
    },
    { 
      icon: FaLanguage, 
      label: "Language Settings", 
      path: "/language", 
      color: "from-teal-500 to-cyan-500" 
    },
    { 
      icon: FaHeadset, 
      label: "Support & Help", 
      path: "/support", 
      color: "from-indigo-500 to-blue-500" 
    },
    { 
      icon: FaInfoCircle, 
      label: "About", 
      path: "/about", 
      color: "from-gray-500 to-slate-500" 
    },
    { 
      icon: FaCog, 
      label: "Settings", 
      path: "/settings", 
      color: "from-slate-500 to-gray-500" 
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-72 sm:w-80 bg-gradient-to-b from-gray-900 via-black to-gray-900 shadow-2xl z-[9999] flex flex-col overflow-hidden"
            style={{ 
              boxShadow: '4px 0 30px rgba(239, 68, 68, 0.4), 8px 0 60px rgba(236, 72, 153, 0.2)'
            }}
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 bg-gradient-to-r from-red-600 via-pink-600 to-red-700 p-3 sm:p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg sm:text-xl font-black text-white"
                >
                  MENU
                </motion.h2>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all duration-200"
                >
                  <FaTimes className="text-base sm:text-lg" />
                </motion.button>
              </div>
              
              {/* User Profile Section - Clickable */}
              <motion.div
                onClick={() => handleNavigation("/profile")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black/20 backdrop-blur-md rounded-xl p-2.5 sm:p-3 cursor-pointer hover:bg-black/30 transition-all duration-300 border border-white/10"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {user ? (
                    <>
                      <div className="relative">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.username || user.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/30 shadow-lg"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-500 via-pink-500 to-red-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg border-2 border-white/30">
                            {(user.username || user.name || user.email)?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-400 rounded-full border-2 border-gray-900"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-sm sm:text-base truncate">{user.username || user.name || "User"}</h3>
                        <p className="text-purple-100 text-[10px] sm:text-xs truncate opacity-80">{user.email}</p>
                      </div>
                      <FaChevronRight className="text-white/60 text-xs flex-shrink-0" />
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white border-2 border-white/30">
                        <FaUser className="text-lg sm:text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm sm:text-base">Guest</h3>
                        <p className="text-purple-100 text-[10px] sm:text-xs opacity-80">Sign in</p>
                      </div>
                      <FaChevronRight className="text-white/60 text-xs" />
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Menu Items - Scrollable with smooth behavior */}
            <div 
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2"
              style={{
                scrollBehavior: 'smooth',
                overscrollBehavior: 'contain'
              }}
            >
              <style>{`
                .flex-1.overflow-y-auto::-webkit-scrollbar {
                  width: 6px;
                }
                .flex-1.overflow-y-auto::-webkit-scrollbar-track {
                  background: rgba(31, 41, 55, 0.5);
                  border-radius: 10px;
                }
                .flex-1.overflow-y-auto::-webkit-scrollbar-thumb {
                  background: linear-gradient(180deg, #ef4444, #ec4899);
                  border-radius: 10px;
                }
                .flex-1.overflow-y-auto::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(180deg, #dc2626, #db2777);
                }
              `}</style>
              
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, type: "spring", stiffness: 100 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNavigation(item.path);
                  }}
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 hover:from-gray-700/80 hover:to-gray-800/80 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all duration-300 border border-gray-700/40 hover:border-red-500/60 shadow-lg hover:shadow-2xl hover:shadow-red-500/30 backdrop-blur-sm cursor-pointer"
                  style={{ userSelect: 'none' }}
                >
                  {/* Animated Shimmer Effect */}
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
                    }}
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Icon with Enhanced Glow */}
                  <motion.div 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-xl relative z-10 group-hover:shadow-2xl`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    style={{
                      boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)'
                    }}
                  >
                    <item.icon className="text-lg sm:text-xl" />
                  </motion.div>

                  {/* Label with better typography */}
                  <span className="text-white font-bold text-sm sm:text-base flex-1 text-left relative z-10 group-hover:text-purple-100 transition-colors tracking-wide">
                    {item.label}
                  </span>

                  {/* Badge with animation */}
                  {item.badge && (
                    <motion.span 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 + index * 0.04, type: "spring" }}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-[10px] sm:text-xs font-bold text-white shadow-xl relative z-10 animate-pulse"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  
                  {/* Animated Arrow */}
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaChevronRight className="text-gray-400 group-hover:text-purple-300 transition-colors text-xs sm:text-sm" />
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Bottom Section - Fixed with minimalist design */}
            <div className="flex-shrink-0 bg-gray-900/95 backdrop-blur-md p-2.5 sm:p-3 border-t border-gray-700/30">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/30 transition-all duration-300 cursor-pointer text-sm sm:text-base"
                  style={{ userSelect: 'none' }}
                >
                  <FaSignOutAlt className="text-sm sm:text-base" />
                  <span>Logout</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNavigation("/login");
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer"
                  style={{ userSelect: 'none' }}
                >
                  <FaUser className="text-base" />
                  <span>Sign In</span>
                </motion.button>
              )}

              {/* App Version - Compact */}
              <div className="text-center mt-2 text-gray-500 text-xs">
                <p>© 2025 DivideCross Movies</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
