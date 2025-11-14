import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaHome } from "react-icons/fa";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [token, setToken] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-2xl relative border-b border-white/10 z-40">
        <div className="flex items-center justify-between">
          {/* Left Section: Menu Icon + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-xl sm:text-2xl text-gray-300 hover:text-white transition-colors p-1 flex items-center"
            >
              <FaBars />
            </button>

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

            {!token && (
              <>
                <button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-red-600 to-pink-600 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base text-white font-bold hover:from-red-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-red-500/50 flex items-center leading-none"
                >
                  Login
                </button>

                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center border-2 border-red-500 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base text-red-500 font-bold hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all shadow-lg leading-none"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
