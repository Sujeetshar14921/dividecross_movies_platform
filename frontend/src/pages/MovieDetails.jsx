import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Play, Heart, Share2, Send, Trash2 } from "lucide-react";
import API from "../api/axios";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";
import { AuthContext } from "../context/AuthContext";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullMovie, setShowFullMovie] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessType, setAccessType] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  // Engagement states
  const [engagement, setEngagement] = useState({ likes: 0, shares: 0, hasLiked: false, hasShared: false });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

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
        
        // Fetch engagement and comments
        fetchEngagement();
        fetchComments();
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const fetchEngagement = async () => {
    try {
      const response = await API.get(`/api/movies/engagement/${id}`);
      setEngagement(response.data);
    } catch (error) {
      setEngagement({ likes: 0, shares: 0, hasLiked: false, hasShared: false });
    }
  };

  const fetchComments = async () => {
    try {
      const response = await API.get(`/api/movies/comments/${id}`);
      setComments(response.data.comments || []);
    } catch (error) {
      setComments([]);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await API.post(`/api/movies/engagement/${id}/like`);
      setEngagement(prev => ({
        ...prev,
        likes: response.data.likes,
        hasLiked: response.data.hasLiked
      }));
    } catch (error) {
      // Silently fail
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on dividecross!`,
          url
        });
        await API.post(`/api/movies/engagement/${id}/share`);
        setEngagement(prev => ({ ...prev, shares: prev.shares + 1, hasShared: true }));
      } catch (error) {}
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
      try {
        await API.post(`/api/movies/engagement/${id}/share`);
        setEngagement(prev => ({ ...prev, shares: prev.shares + 1, hasShared: true }));
      } catch (error) {}
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await API.post(`/api/movies/comments/${id}`, {
        comment: newComment.trim()
      });
      setComments([response.data.comment, ...comments]);
      setNewComment("");
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await API.delete(`/api/movies/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

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
      <div className="relative h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
        {backdropUrl && (
          <>
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            ></motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
          </>
        )}

        {/* Like & Share Buttons - Top Right */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex gap-2 sm:gap-3"
        >
          {/* Like Button */}
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/60 transition-all group"
          >
            <Heart 
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                engagement.hasLiked 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-white group-hover:text-red-400'
              }`}
            />
          </motion.button>

          {/* Share Button */}
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/60 transition-all group"
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-blue-400 transition-colors" />
          </motion.button>
        </motion.div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-6 sm:pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-4 sm:gap-8 w-full"
          >
            {/* Poster with Glow Effect */}
            {posterUrl && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden md:block"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500/40 via-pink-500/40 to-purple-500/40 blur-3xl rounded-lg opacity-70"></div>
                <motion.img 
                  src={posterUrl}
                  alt={movie.title}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-44 h-64 lg:w-60 lg:h-[360px] object-cover rounded-2xl shadow-2xl border-4 border-white/20"
                  style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}
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
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 sm:mb-3 md:mb-4"
                style={{
                  textShadow: '0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.8)',
                  color: '#ffffff',
                  letterSpacing: '-0.02em'
                }}
              >
                {movie.title}
              </motion.h1>
              
              {movie.tagline && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6 md:mb-8 font-light line-clamp-2 max-w-4xl"
                  style={{
                    fontStyle: 'italic',
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                  }}
                >
                  {movie.tagline}
                </motion.p>
              )}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 sm:gap-4 md:gap-5 items-center mb-5 sm:mb-7 md:mb-8"
              >
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="text-2xl sm:text-3xl md:text-4xl">⭐</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl sm:text-3xl md:text-4xl font-black ${getRatingColor(movie.vote_average)}`}
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className="text-sm sm:text-base text-gray-400 font-medium">/10</span>
                    </div>
                  </div>
                )}
                
                {movie.release_date && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-200">
                    <span className="text-lg sm:text-xl">📅</span>
                    <span className="text-base sm:text-lg md:text-xl font-semibold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-200">
                    <span className="text-lg sm:text-xl">⏱️</span>
                    <span className="text-base sm:text-lg md:text-xl font-semibold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}
                
                <div className="w-px h-8 bg-gray-600 hidden sm:block"></div>
                
                {movie.status && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-lg sm:text-xl">✓</span>
                    <span className="text-base sm:text-lg md:text-xl font-semibold text-green-400" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                      {movie.status}
                    </span>
                  </div>
                )}
              </motion.div>
              
              {/* Genres with Gradient */}
              {movie.genres && movie.genres.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-2 sm:gap-3"
                >
                  {movie.genres.map((genre, index) => (
                    <motion.span 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-full text-sm sm:text-base font-bold shadow-lg transition-all border border-white/30 cursor-default"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                    >
                      {genre}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-12">
        {/* Access Control / Payment Section */}
        {!hasAccess && !checkingAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-10 bg-gradient-to-r from-red-900/30 to-pink-900/30 border-2 border-red-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-red-400" />
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">
                    🔒 Premium Content
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300">
                    Subscribe or rent this movie to watch full content
                  </p>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/subscription')}
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all hover:scale-105"
                >
                  Subscribe Now
                </button>
                <button
                  onClick={() => navigate(`/checkout/movie/${id}`, { state: { movie } })}
                  className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold border border-white/20 transition-all hover:scale-105"
                >
                  Rent ₹49
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
            className="mb-4 sm:mb-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500/50 rounded-lg sm:rounded-xl p-3 sm:p-4"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              <p className="text-sm sm:text-base text-white font-semibold">
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
            className="mb-6 sm:mb-10"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Official Trailer
              </h2>
            </div>
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-1 sm:p-2">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={movie.trailer.url}
                  title={movie.trailer.name}
                  className="absolute top-0 left-0 w-full h-full rounded-lg sm:rounded-xl"
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
            className="mb-6 sm:mb-10"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-1 sm:p-2">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://vidsrc.xyz/embed/movie/${movie.tmdbId || movie.id}`}
                  title={`Watch ${movie.title}`}
                  className="absolute top-0 left-0 w-full h-full rounded-lg sm:rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 sm:mt-4"
            >
              <button
                onClick={() => setShowFullMovie(false)}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg hover:shadow-gray-500/50 border border-white/10"
              >
                <span className="text-lg sm:text-xl">←</span>
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
            className="mb-8 sm:mb-12"
          >
            <button
              onClick={() => setShowFullMovie(true)}
              className="group relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-1 shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 flex items-center justify-center gap-3 sm:gap-4">
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-3xl sm:text-5xl drop-shadow-lg"
                >
                  ▶
                </motion.span>
                <span className="text-lg sm:text-2xl font-black tracking-wide">WATCH FULL MOVIE</span>
              </div>
            </button>
          </motion.div>
        )}

        {/* Overview & Details with Glass Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Overview Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="lg:col-span-2 space-y-6 sm:space-y-8">
          >
            {/* Overview Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Story Overview
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed break-words">
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Comments Section */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl relative z-10 overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full flex-shrink-0"></div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Comments ({comments.length})
                </h2>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={user ? "Add a comment..." : "Login to comment"}
                    disabled={!user || commentLoading}
                    maxLength={500}
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!user || !newComment.trim() || commentLoading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-sm sm:text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Post</span>
                  </motion.button>
                </div>
                {newComment.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">{newComment.length}/500 characters</p>
                )}
              </form>

              {/* Comments List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          {comment.userProfilePicture ? (
                            <img 
                              src={comment.userProfilePicture} 
                              alt={comment.username}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {comment.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-white">{comment.username}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                              {user && comment.userId === user._id && (
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm break-words">{comment.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Director */}
            {movie.director && (
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20 shadow-xl overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-2xl sm:text-3xl flex-shrink-0">🎬</span>
                  <h3 className="text-lg sm:text-xl font-bold">Director</h3>
                </div>
                <p className="text-gray-200 text-base sm:text-lg font-semibold break-words">{movie.director.name}</p>
              </div>
            )}

            {/* Cast with Hover Effects */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl flex-shrink-0">🎭</span>
                  <h3 className="text-xl sm:text-2xl font-bold">Cast</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                  {movie.cast.map((actor) => (
                    <motion.div 
                      key={actor.id} 
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center group"
                    >
                      {actor.profilePath ? (
                        <div className="relative mb-2 sm:mb-3">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <img 
                            src={actor.profilePath}
                            alt={actor.name}
                            className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full mx-auto object-cover border-2 border-white/20 group-hover:border-white/40 transition-all shadow-lg"
                            onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ccircle fill="%231a1a1a" cx="50" cy="50" r="50"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="40" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E?%3C/text%3E%3C/svg%3E'}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl sm:text-3xl border-2 border-white/20 group-hover:border-white/40 transition-all">
                          👤
                        </div>
                      )}
                      <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">{actor.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-2">{actor.character}</p>
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
            className="space-y-4 sm:space-y-6"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl lg:sticky lg:top-4 overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl flex-shrink-0">ℹ️</span>
                <h3 className="text-xl sm:text-2xl font-bold">Movie Details</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {movie.budget > 0 && (
                  <div className="flex justify-between items-center p-2.5 sm:p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-xs sm:text-sm font-semibold">Budget</p>
                    <p className="text-green-400 font-bold text-base sm:text-lg">
                      ${(movie.budget / 1000000).toFixed(1)}M
                    </p>
                  </div>
                )}
                
                {movie.revenue > 0 && (
                  <div className="flex justify-between items-center p-2.5 sm:p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-xs sm:text-sm font-semibold">Revenue</p>
                    <p className="text-blue-400 font-bold text-base sm:text-lg">
                      ${(movie.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                )}
                
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="p-2.5 sm:p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-xs sm:text-sm font-semibold mb-2">Production</p>
                    <p className="text-white text-xs sm:text-sm leading-relaxed break-words">
                      {movie.production_companies.slice(0, 3).join(', ')}
                    </p>
                  </div>
                )}
                
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <div className="p-2.5 sm:p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-xs sm:text-sm font-semibold mb-2">Languages</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {movie.spoken_languages.map((lang, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg text-[10px] sm:text-xs text-white border border-white/10">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-red-900/20 to-pink-900/20 rounded-lg border border-red-500/20">
                  <p className="text-gray-400 text-xs sm:text-sm font-semibold mb-2">Engagement</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-300 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        Likes
                      </span>
                      <span className="text-sm sm:text-base font-bold text-red-400">
                        {engagement.likes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-300 flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-blue-400" />
                        Shares
                      </span>
                      <span className="text-sm sm:text-base font-bold text-blue-400">
                        {engagement.shares.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
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
