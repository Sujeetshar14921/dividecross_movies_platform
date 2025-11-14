import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function MovieCard({ movie }) {
  // TMDb image base URL
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
  
  // Track movie click
  const handleMovieClick = async () => {
    try {
      await API.post("/api/movies/track-activity", {
        movieId: movie.id || movie.tmdbId || movie._id,
        activityType: "view",
        timestamp: new Date()
      });
    } catch (err) {
      // Silent fail for analytics
    }
  };
  
  // Handle different poster path formats
  const getPosterUrl = () => {
    const poster = movie.poster_path || movie.posterPath || movie.poster || '';
    
    // If poster starts with http, use it directly
    if (poster.startsWith('http')) return poster;
    
    // If poster starts with /, prepend TMDb base URL
    if (poster.startsWith('/')) return `${TMDB_IMAGE_BASE}${poster}`;
    
    // If no poster, return SVG placeholder
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="750"%3E%3Crect fill="%231a1a1a" width="500" height="750"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Poster%3C/text%3E%3C/svg%3E';
  };
  
  // Check if movie is new (added in last 7 days)
  const isNew = () => {
    if (!movie.createdAt) return false;
    const movieDate = new Date(movie.createdAt);
    const currentDate = new Date();
    const daysDiff = (currentDate - movieDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  };
  
  // Get rating color based on score
  const getRatingColor = (rating) => {
    if (rating >= 7.5) return 'text-green-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Get rating background color for glow effect
  const getRatingBgColor = (rating) => {
    if (rating >= 7.5) return 'bg-green-400';
    if (rating >= 6) return 'bg-yellow-400';
    return 'bg-red-400';
  };
  
  const rating = movie.vote_average || movie.rating || 0;
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -8 }} 
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="relative group"
    >
      <Link 
        to={`/movie/${movie._id || movie.id || movie.movieId}`}
        onClick={handleMovieClick}
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-500/20 relative border border-white/10 transform transition-all duration-300">
          {/* NEW Badge with Pulse Animation */}
          {isNew() && (
            <div className="absolute top-3 right-3 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-md animate-pulse"></div>
                <span className="relative bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                  NEW
                </span>
              </div>
            </div>
          )}
          
          {/* Rating Badge with Better Design */}
          {rating > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <div className="relative">
                <div className={`absolute inset-0 ${getRatingBgColor(rating)} opacity-20 blur-md rounded-lg`}></div>
                <span className={`relative flex items-center gap-1 bg-black/70 backdrop-blur-sm ${getRatingColor(rating)} text-sm font-bold px-2.5 py-1.5 rounded-lg border border-white/20`}>
                  <span className="text-yellow-400">⭐</span>
                  <span>{rating.toFixed(1)}</span>
                </span>
              </div>
            </div>
          )}
          
          {/* Movie Poster with Gradient Overlay */}
          <div className="relative overflow-hidden h-80">
            <img 
              src={getPosterUrl()} 
              alt={movie.title || 'Movie Poster'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="750"%3E%3Crect fill="%231a1a1a" width="500" height="750"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Poster%3C/text%3E%3C/svg%3E';
              }}
            />
            
            {/* Enhanced Hover Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white text-sm line-clamp-4 leading-relaxed">
                  {movie.overview || movie.description || 'Discover this amazing movie and dive into an unforgettable cinematic experience.'}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold rounded-full">
                    Watch Now
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Movie Info with Better Design */}
          <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm">
            <h3 className="font-bold text-white text-base mb-2 line-clamp-1 group-hover:text-red-400 transition-colors">
              {movie.title || 'Untitled'}
            </h3>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-semibold">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 
                 movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
              </span>
              
              {movie.genres && movie.genres.length > 0 && (
                <span className="text-xs bg-gradient-to-r from-red-600/80 to-pink-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold border border-white/20">
                  {Array.isArray(movie.genres) ? movie.genres[0] : movie.genres}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
