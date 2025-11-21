import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaHome } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  // Check if user is on a public page (login, register, etc.)
  const isPublicPage = ['/login', '/register', '/otp-verify', '/forgot-password', '/reset-password'].includes(location.pathname);
  
  // Only show sidebar if user is logged in OR not on a public page
  const showSidebar = user || !isPublicPage;

  return (
    <>
      {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-2xl relative border-b border-white/10 z-40">
        <div className="flex items-center justify-between">
          {/* Left Section: Menu Icon + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {showSidebar && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-xl sm:text-2xl text-gray-300 hover:text-white transition-colors p-1 flex items-center"
              >
                <FaBars />
              </button>
            )}

            <Link
              to="/"
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent hover:from-red-400 hover:to-pink-400 transition-all flex items-center leading-none"
            >
              dividecross
            </Link>
          </div>

          {/* Right Section: Home, About, Login/Signup */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {/* Home Icon for Mobile, Text for Desktop */}
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white font-semibold transition-colors relative group flex items-center"
            >
              <span className="sm:hidden text-xl flex items-center">
                <FaHome />
              </span>
              <span className="hidden sm:inline-block text-sm md:text-base">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>

            <Link 
              to="/about" 
              className="hidden sm:inline-flex items-center text-sm md:text-base text-gray-300 hover:text-white font-semibold transition-colors relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
