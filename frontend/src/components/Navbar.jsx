import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
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
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 md:px-6 py-4 shadow-2xl relative border-b border-white/10">
        <div className="flex items-center justify-between">
          {/* Left Section: Menu Icon + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl text-gray-300 hover:text-white transition-colors"
            >
              <FaBars />
            </button>

            <Link
              to="/"
              className="text-2xl md:text-3xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent hover:from-red-400 hover:to-pink-400 transition-all"
            >
              dividecross
            </Link>
          </div>

          {/* Right Section: Home, About, Login/Signup */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white font-semibold transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white font-semibold transition-colors relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {!token && (
              <>
                <button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-2 rounded-lg text-white font-bold hover:from-red-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-red-500/50"
                >
                  Login
                </button>

                <Link
                  to="/register"
                  className="border-2 border-red-500 px-6 py-2 rounded-lg text-red-500 font-bold hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all shadow-lg"
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
