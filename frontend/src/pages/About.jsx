import React from "react";
import { motion } from "framer-motion";
import { FaFilm, FaUsers, FaRocket, FaStar, FaHeart, FaPlay, FaSearch, FaMobile } from "react-icons/fa";

export default function About() {
  const features = [
    {
      icon: <FaFilm className="text-4xl" />,
      title: "Vast Movie Library",
      description: "Access thousands of movies from various genres, eras, and languages. From Hollywood blockbusters to indie gems.",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: <FaSearch className="text-4xl" />,
      title: "Smart Search",
      description: "Find exactly what you're looking for with our intelligent search engine and instant suggestions.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaStar className="text-4xl" />,
      title: "Personalized Recommendations",
      description: "Get movie suggestions tailored to your taste. Our AI learns what you love and recommends accordingly.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <FaPlay className="text-4xl" />,
      title: "Instant Streaming",
      description: "Watch trailers and full movies instantly with high-quality streaming. No waiting, just entertainment.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <FaMobile className="text-4xl" />,
      title: "Responsive Design",
      description: "Enjoy seamless experience across all devices - desktop, tablet, or mobile. Watch anywhere, anytime.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <FaHeart className="text-4xl" />,
      title: "User Friendly",
      description: "Beautiful, intuitive interface designed for movie lovers. Easy navigation, stunning visuals.",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Movies", icon: <FaFilm /> },
    { number: "50,000+", label: "Active Users", icon: <FaUsers /> },
    { number: "100+", label: "Genres", icon: <FaStar /> },
    { number: "24/7", label: "Support", icon: <FaRocket /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/30 blur-3xl rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full"
          />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-500 mb-4 sm:mb-6 shadow-2xl shadow-red-500/50"
            >
              <FaFilm className="text-3xl sm:text-4xl md:text-5xl text-white" />
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              About Dividecross
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8 px-4">
              Your ultimate destination for discovering and streaming movies from around the world. 
              We bring entertainment right to your fingertips with a vast collection of films, 
              personalized recommendations, and an unmatched viewing experience.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm md:text-base text-gray-400"
            >
              <span className="flex items-center gap-1.5 sm:gap-2">
                <FaFilm className="text-red-500" />
                Movies Platform
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <FaStar className="text-yellow-500" />
                Premium Quality
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 text-center hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl text-red-500 mb-2 sm:mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-400 font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-red-600/10 to-purple-600/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 mb-4 sm:mb-6 shadow-lg">
              <FaRocket className="text-2xl sm:text-2xl md:text-3xl text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-4 sm:mb-6">
              At Dividecross, we believe that everyone deserves access to quality entertainment. 
              Our mission is to create the most comprehensive and user-friendly movie platform that 
              connects film enthusiasts with the stories they love.
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed">
              We're constantly innovating to bring you the best features, from AI-powered recommendations 
              to seamless streaming, ensuring that your movie-watching experience is nothing short of exceptional.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Why Choose Dividecross?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Discover what makes us the premier choice for movie lovers worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all group overflow-hidden"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-red-500 group-hover:to-pink-500 transition-all break-words">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed break-words">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 overflow-hidden"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Built with Modern Technology
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-4 sm:mb-6 px-2 break-words">
              Dividecross is powered by cutting-edge technology stack including React, Node.js, 
              MongoDB, and advanced AI algorithms. We leverage TMDb API to provide you with 
              comprehensive movie information, ratings, and metadata.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-6 sm:mt-8">
              <span className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/5 rounded-full border border-white/10 font-semibold text-xs sm:text-sm">
                React.js
              </span>
              <span className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/5 rounded-full border border-white/10 font-semibold text-xs sm:text-sm">
                Node.js
              </span>
              <span className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/5 rounded-full border border-white/10 font-semibold text-xs sm:text-sm">
                MongoDB
              </span>
              <span className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/5 rounded-full border border-white/10 font-semibold text-xs sm:text-sm">
                TMDb API
              </span>
              <span className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/5 rounded-full border border-white/10 font-semibold text-xs sm:text-sm">
                AI/ML
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-2xl shadow-red-500/50 overflow-hidden"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-white">
            Ready to Start Watching?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 break-words">
            Join thousands of movie enthusiasts and discover your next favorite film today!
          </p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-white text-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <FaPlay />
            Explore Movies Now
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
