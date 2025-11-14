import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Play } from "lucide-react";
import API from "../api/axios";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullMovie, setShowFullMovie] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessType, setAccessType] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/movies/${id}`);
        setMovie(response.data.movie);
        
        // Check if user has access
        try {
          const accessResponse = await API.get(`/api/payments/movie/access/${id}`);
          setHasAccess(accessResponse.data.hasAccess);
          setAccessType(accessResponse.data.accessType);
        } catch (error) {
          // User not logged in or no access
          setHasAccess(false);
        }
        setCheckingAccess(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (!movie) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl text-white mb-4">Movie not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );

  const backdropUrl = movie.backdrop_path 
    ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}`
    : movie.backdropUrl;

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.posterUrl;

  const getRatingColor = (rating) => {
    if (rating >= 7.5) return 'text-green-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        {backdropUrl && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center transform scale-105 blur-sm"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
          </>
        )}
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-8 w-full"
          >
            {/* Poster with Glow Effect */}
            {posterUrl && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden md:block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 blur-2xl rounded-lg"></div>
                <img 
                  src={posterUrl}
                  alt={movie.title}
                  className="relative w-56 h-80 object-cover rounded-xl shadow-2xl border-4 border-white/10 transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </motion.div>
            )}
            
            {/* Title & Basic Info */}
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl font-black mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-lg"
              >
                {movie.title}
              </motion.h1>
              
              {movie.tagline && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-300 italic mb-6 font-light"
                >
                  "{movie.tagline}"
                </motion.p>
              )}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 items-center mb-6"
              >
                {movie.vote_average > 0 && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10`}>
                    <span className="text-3xl">⭐</span>
                    <span className={`text-2xl font-bold ${getRatingColor(movie.vote_average)}`}>
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400">/10</span>
                  </div>
                )}
                
                {movie.release_date && (
                  <span className="px-4 py-2 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-full text-gray-200 font-semibold border border-white/10">
                    📅 {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
                
                {movie.runtime && (
                  <span className="px-4 py-2 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-full text-gray-200 font-semibold border border-white/10">
                    ⏱️ {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                )}
                
                {movie.status && (
                  <span className="px-4 py-2 bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm rounded-full text-white font-semibold border border-white/10">
                    ✓ {movie.status}
                  </span>
                )}
              </motion.div>
              
              {/* Genres with Gradient */}
              {movie.genres && movie.genres.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-3"
                >
                  {movie.genres.map((genre, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-full text-sm font-bold shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all border border-white/20"
                    >
                      {genre}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Access Control / Payment Section */}
        {!hasAccess && !checkingAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-gradient-to-r from-red-900/30 to-pink-900/30 border-2 border-red-500/50 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Lock className="w-12 h-12 text-red-400" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    🔒 Premium Content
                  </h3>
                  <p className="text-gray-300">
                    Subscribe or rent this movie to watch full content
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/subscription')}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                >
                  Subscribe Now
                </button>
                <button
                  onClick={() => navigate(`/checkout/movie/${id}`, { state: { movie } })}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold border border-white/20 transition-all hover:scale-105"
                >
                  Rent for ₹49
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Access Badge (if user has access) */}
        {hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6 text-green-400" />
              <p className="text-white font-semibold">
                ✨ You have access to this movie
                {accessType === 'subscription' ? ' through your subscription' : ' (Rental expires in 48 hours)'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Trailer Section with Glass Effect */}
        {movie.trailer && !showFullMovie && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Official Trailer
              </h2>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-2">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={movie.trailer.url}
                  title={movie.trailer.name}
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        )}

        {/* Full Movie Player with Glass Effect */}
        {showFullMovie && hasAccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-2">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://vidsrc.xyz/embed/movie/${movie.tmdbId || movie.id}`}
                  title={`Watch ${movie.title}`}
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <button
                onClick={() => setShowFullMovie(false)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-gray-500/50 border border-white/10"
              >
                <span className="text-xl">←</span>
                <span>Back to Details</span>
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Play Full Movie Button - Animated & Attractive */}
        {!showFullMovie && hasAccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <button
              onClick={() => setShowFullMovie(true)}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-1 shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl py-6 px-8 flex items-center justify-center gap-4">
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-5xl drop-shadow-lg"
                >
                  ▶
                </motion.span>
                <span className="text-2xl font-black tracking-wide">WATCH FULL MOVIE</span>
              </div>
            </button>
          </motion.div>
        )}

        {/* Overview & Details with Glass Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Overview Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="md:col-span-2 space-y-8"
          >
            {/* Overview Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Story Overview
                </h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Director */}
            {movie.director && (
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🎬</span>
                  <h3 className="text-xl font-bold">Director</h3>
                </div>
                <p className="text-gray-200 text-lg font-semibold">{movie.director.name}</p>
              </div>
            )}

            {/* Cast with Hover Effects */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🎭</span>
                  <h3 className="text-2xl font-bold">Cast</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {movie.cast.map((actor) => (
                    <motion.div 
                      key={actor.id} 
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center group"
                    >
                      {actor.profilePath ? (
                        <div className="relative mb-3">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <img 
                            src={actor.profilePath}
                            alt={actor.name}
                            className="relative w-24 h-24 rounded-full mx-auto object-cover border-2 border-white/20 group-hover:border-white/40 transition-all shadow-lg"
                            onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ccircle fill="%231a1a1a" cx="50" cy="50" r="50"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="40" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E?%3C/text%3E%3C/svg%3E'}
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full mx-auto mb-3 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-3xl border-2 border-white/20 group-hover:border-white/40 transition-all">
                          👤
                        </div>
                      )}
                      <p className="text-sm font-semibold text-white">{actor.name}</p>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar Info with Glass Effect */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">ℹ️</span>
                <h3 className="text-2xl font-bold">Movie Details</h3>
              </div>
              
              <div className="space-y-4">
                {movie.budget > 0 && (
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-sm font-semibold">Budget</p>
                    <p className="text-green-400 font-bold text-lg">
                      ${(movie.budget / 1000000).toFixed(1)}M
                    </p>
                  </div>
                )}
                
                {movie.revenue > 0 && (
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-sm font-semibold">Revenue</p>
                    <p className="text-blue-400 font-bold text-lg">
                      ${(movie.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                )}
                
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-sm font-semibold mb-2">Production</p>
                    <p className="text-white text-sm leading-relaxed">
                      {movie.production_companies.slice(0, 3).join(', ')}
                    </p>
                  </div>
                )}
                
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-sm font-semibold mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {movie.spoken_languages.map((lang, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg text-xs text-white border border-white/10">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Movies with Gradient Header */}
        {movie.similarMovies && movie.similarMovies.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-10 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movie.similarMovies.map((similarMovie, index) => (
                <motion.div
                  key={similarMovie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.05 }}
                >
                  <MovieCard movie={similarMovie} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
