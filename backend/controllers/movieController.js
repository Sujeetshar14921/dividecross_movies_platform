const {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  searchMovies: tmdbSearchMovies,
  getMovieDetails,
  getMoviesByGenre,
  getGenres
} = require('../services/tmdbService');
const UserActivity = require('../models/userActivityModel');
const SearchHistory = require('../models/searchHistoryModel');
const Watchlist = require('../models/watchlistModel');
const ViewingHistory = require('../models/viewingHistoryModel');
const Download = require('../models/downloadModel');
const MovieEngagement = require('../models/movieEngagementModel');
const Comment = require('../models/commentModel');

exports.getAllMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await getPopularMovies(page);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching movies", error: err.message });
  }
};

exports.getTrendingMovies = async (req, res) => {
  try {
    const movies = await getTrendingMovies(req.query.time || 'week');
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ message: "Error fetching trending movies", error: err.message });
  }
};

exports.getTopRatedMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await getTopRatedMovies(page);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching top rated movies", error: err.message });
  }
};

exports.getNowPlayingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await getNowPlayingMovies(page);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching now playing movies", error: err.message });
  }
};

exports.getUpcomingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await getUpcomingMovies(page);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching upcoming movies", error: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json({ suggestions: [] });

    const searchResult = await tmdbSearchMovies(q, 1);
    res.json({ suggestions: searchResult.movies.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ message: "Error fetching suggestions", error: err.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q: searchQuery, page = 1 } = req.query;
    if (!searchQuery) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const movies = await tmdbSearchMovies(searchQuery, page);
    
    // Track search history
    if (movies && movies.length > 0) {
      const userId = req.user?._id;
      const movieIds = movies.slice(0, 10).map(m => m.id || m.tmdbId).filter(Boolean);
      const existingSearch = await SearchHistory.findOne({ 
        query: searchQuery.toLowerCase().trim(),
        userId: userId || null 
      });
      
      if (existingSearch) {
        existingSearch.searchCount += 1;
        existingSearch.lastSearched = new Date();
        existingSearch.movieIds = [...new Set([...existingSearch.movieIds, ...movieIds])];
        await existingSearch.save();
      } else {
        await SearchHistory.create({
          userId: userId || null,
          query: searchQuery.toLowerCase().trim(),
          movieIds,
          searchCount: 1
        });
      }
    }
    
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await getMovieDetails(req.params.id);
    res.json({ movie });
  } catch (err) {
    res.status(500).json({ message: "Error fetching movie details", error: err.message });
  }
};

// Export as getMovieDetails for route compatibility
exports.getMovieDetails = exports.getMovieById;

exports.addMovie = async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
};

exports.updateMovie = async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
};

exports.deleteMovie = async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
};

// Get most searched movies - Smart TMDB-based with user data
exports.getMostSearched = async (req, res) => {
  try {
    // Get search history
    const searches = await SearchHistory.find()
      .sort({ searchCount: -1, lastSearched: -1 })
      .limit(30);
    
    const movieIds = [...new Set(searches.flatMap(s => s.movieIds))].slice(0, 15);
    
    // Fetch from TMDB in parallel
    const [trending, popular] = await Promise.all([
      getTrendingMovies('week'),
      getPopularMovies(1)
    ]);
    
    let movies = [];
    
    // If we have search history, fetch those movies from TMDB
    if (movieIds.length > 0) {
      const moviesPromises = movieIds.map(id => getMovieDetails(id).catch(() => null));
      const searchedMovies = (await Promise.all(moviesPromises)).filter(m => m !== null);
      movies = searchedMovies;
    }
    
    // Mix with trending if not enough
    if (movies.length < 15) {
      const additionalMovies = [...trending, ...(popular.movies || [])]
        .filter(m => !movieIds.includes(m.id))
        .slice(0, 20 - movies.length);
      movies = [...movies, ...additionalMovies];
    }
    
    // Sort by popularity
    movies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    
    res.json({ movies: movies.slice(0, 20) });
  } catch (err) {
    console.error('Most searched error:', err);
    // Fallback to TMDB trending
    try {
      const trending = await getTrendingMovies('week');
      res.json({ movies: trending.slice(0, 20) });
    } catch (fallbackErr) {
      res.status(500).json({ message: "Error fetching most searched", error: err.message });
    }
  }
};

// Get recently added movies - Direct TMDB with discover API
exports.getRecentlyAdded = async (req, res) => {
  try {
    // Use TMDB discover for freshest content
    const [discover, nowPlaying, upcoming] = await Promise.all([
      api.get('/discover/movie', {
        params: {
          api_key: process.env.TMDB_API_KEY,
          sort_by: 'release_date.desc',
          'release_date.lte': new Date().toISOString().split('T')[0],
          'vote_count.gte': 50,
          page: 1
        }
      }),
      getNowPlayingMovies(1),
      getUpcomingMovies(1)
    ]);
    
    // Combine all sources
    const allMovies = [
      ...(discover.data.results || []).map(m => ({
        id: m.id,
        tmdbId: m.id,
        title: m.title,
        overview: m.overview,
        release_date: m.release_date,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        vote_average: m.vote_average,
        popularity: m.popularity
      })),
      ...(nowPlaying.movies || []),
      ...(upcoming.movies || [])
    ];
    
    // Remove duplicates based on movie id
    const uniqueMovies = Array.from(
      new Map(allMovies.map(movie => [movie.id || movie.tmdbId, movie])).values()
    );
    
    // Sort by release date (newest first)
    const sorted = uniqueMovies
      .filter(m => m.release_date)
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
      .slice(0, 20);
    
    res.json({ movies: sorted });
  } catch (err) {
    console.error('Recently added error:', err);
    // Fallback to now playing
    try {
      const nowPlaying = await getNowPlayingMovies(1);
      res.json({ movies: nowPlaying.movies || [] });
    } catch (fallbackErr) {
      res.status(500).json({ message: "Error fetching recently added", error: err.message });
    }
  }
};

// Need axios for discover API
const axios = require('axios');
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000
});

// Get personalized recommendations based on user activity
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    // For non-logged users, return popular + trending mix
    if (!userId) {
      const [popular, trending] = await Promise.all([
        getPopularMovies(1),
        getTrendingMovies('week')
      ]);
      const mixed = [...(popular.movies || []).slice(0, 10), ...trending.slice(0, 10)];
      return res.json({ movies: mixed });
    }
    
    // Get user activities with better scoring
    const activities = await UserActivity.find({ userId })
      .sort({ timestamp: -1 })
      .limit(100);
    
    if (activities.length === 0) {
      const [popular, trending, topRated] = await Promise.all([
        getPopularMovies(1),
        getTrendingMovies('week'),
        getTopRatedMovies(1)
      ]);
      const mixed = [
        ...(popular.movies || []).slice(0, 7),
        ...trending.slice(0, 7),
        ...(topRated.movies || []).slice(0, 6)
      ];
      return res.json({ movies: mixed });
    }
    
    // Enhanced weight system
    const weights = { 
      play: 10, 
      purchase: 8,
      like: 6, 
      share: 5, 
      view: 3, 
      search: 2, 
      comment: 4,
      page_view: 1
    };
    
    const movieScores = {};
    const recentMovies = new Set();
    
    activities.forEach((activity, index) => {
      const weight = weights[activity.activityType] || 1;
      const recencyBonus = 1 + (50 - index) / 100; // Recent activities get bonus
      const score = weight * recencyBonus;
      
      if (activity.movieId) {
        movieScores[activity.movieId] = (movieScores[activity.movieId] || 0) + score;
        if (index < 20) recentMovies.add(activity.movieId);
      }
    });
    
    const topMovieIds = Object.entries(movieScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([id]) => parseInt(id));
    
    // Get similar movies based on top viewed movies
    const similarMoviesPromises = topMovieIds.map(id => 
      getMovieDetails(id)
        .then(movie => movie.similarMovies || [])
        .catch(() => [])
    );
    
    const similarMoviesArrays = await Promise.all(similarMoviesPromises);
    let recommendations = similarMoviesArrays
      .flat()
      .filter(movie => !recentMovies.has(movie.id)) // Exclude recently viewed
      .slice(0, 15);
    
    // If not enough recommendations, add trending
    if (recommendations.length < 15) {
      const trending = await getTrendingMovies('week');
      const additional = trending
        .filter(movie => !recentMovies.has(movie.id))
        .slice(0, 20 - recommendations.length);
      recommendations = [...recommendations, ...additional];
    }
    
    res.json({ movies: recommendations });
  } catch (err) {
    console.error('Personalized recommendations error:', err);
    // Ultimate fallback
    try {
      const popular = await getPopularMovies(1);
      res.json({ movies: popular.movies || [] });
    } catch (fallbackErr) {
      res.status(500).json({ message: "Error fetching recommendations", error: err.message });
    }
  }
};

// Track user activity
exports.trackActivity = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { movieId, activityType, metadata } = req.body;
    
    // For non-movie activities (like page_view), movieId is optional
    if (!activityType) {
      return res.status(400).json({ message: "activityType is required" });
    }
    
    // For movie-specific activities, movieId is required
    if (!movieId && !['page_view'].includes(activityType)) {
      return res.status(400).json({ message: "movieId is required for this activity type" });
    }
    
    await UserActivity.create({
      userId: userId || null,
      movieId: movieId || null,
      activityType,
      metadata
    });
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error tracking activity", error: err.message });
  }
};

// Watchlist Management
exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { movieId, movieTitle, moviePoster } = req.body;

    if (!movieId || !movieTitle) {
      return res.status(400).json({ message: "Movie ID and title are required" });
    }

    const watchlistItem = await Watchlist.findOneAndUpdate(
      { userId, movieId },
      { movieId, movieTitle, moviePoster, addedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, watchlistItem });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }
    res.status(500).json({ message: "Error adding to watchlist", error: err.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.params;

    await Watchlist.findOneAndDelete({ userId, movieId: parseInt(movieId) });
    res.json({ success: true, message: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ message: "Error removing from watchlist", error: err.message });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const watchlist = await Watchlist.find({ userId }).sort({ addedAt: -1 });
    res.json({ watchlist });
  } catch (err) {
    res.status(500).json({ message: "Error fetching watchlist", error: err.message });
  }
};

// Viewing History
exports.addToHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { movieId, movieTitle, moviePoster, progress, completed } = req.body;

    if (!movieId || !movieTitle) {
      return res.status(400).json({ message: "Movie ID and title are required" });
    }

    const historyItem = await ViewingHistory.findOneAndUpdate(
      { userId, movieId },
      { 
        movieTitle, 
        moviePoster, 
        watchedAt: new Date(),
        progress: progress || 0,
        completed: completed || false
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, historyItem });
  } catch (err) {
    res.status(500).json({ message: "Error adding to history", error: err.message });
  }
};

exports.getViewingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 50;
    const history = await ViewingHistory.find({ userId })
      .sort({ watchedAt: -1 })
      .limit(limit);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await ViewingHistory.deleteMany({ userId });
    res.json({ success: true, message: "History cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing history", error: err.message });
  }
};

// Downloads Management
exports.addDownload = async (req, res) => {
  try {
    const userId = req.user._id;
    const { movieId, movieTitle, moviePoster, quality } = req.body;

    if (!movieId || !movieTitle) {
      return res.status(400).json({ message: "Movie ID and title are required" });
    }

    const download = await Download.create({
      userId,
      movieId,
      movieTitle,
      moviePoster,
      quality: quality || '1080p'
    });

    res.json({ success: true, download });
  } catch (err) {
    res.status(500).json({ message: "Error adding download", error: err.message });
  }
};

exports.getDownloads = async (req, res) => {
  try {
    const userId = req.user._id;
    const downloads = await Download.find({ 
      userId, 
      status: 'downloaded',
      expiresAt: { $gt: new Date() }
    }).sort({ downloadedAt: -1 });
    res.json({ downloads });
  } catch (err) {
    res.status(500).json({ message: "Error fetching downloads", error: err.message });
  }
};

exports.removeDownload = async (req, res) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.params;

    await Download.findOneAndUpdate(
      { userId, movieId: parseInt(movieId) },
      { status: 'deleted' }
    );
    res.json({ success: true, message: "Download removed" });
  } catch (err) {
    res.status(500).json({ message: "Error removing download", error: err.message });
  }
};

// Get user's search history
exports.getUserSearchHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    const searchHistory = await SearchHistory.find({ userId })
      .sort({ lastSearched: -1 })
      .limit(50);
    res.json({ searchHistory });
  } catch (err) {
    res.status(500).json({ message: "Error fetching search history", error: err.message });
  }
};

// Delete individual search keyword
exports.deleteSearchKeyword = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    
    await SearchHistory.findOneAndDelete({ _id: id, userId });
    res.json({ success: true, message: "Search keyword deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting search keyword", error: err.message });
  }
};

// Clear all search history
exports.clearSearchHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    await SearchHistory.deleteMany({ userId });
    res.json({ success: true, message: "Search history cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing search history", error: err.message });
  }
};

// Get movie engagement stats (likes, shares count)
exports.getMovieEngagement = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user?._id;
    
    let engagement = await MovieEngagement.findOne({ movieId });
    
    if (!engagement) {
      engagement = await MovieEngagement.create({ movieId, likes: 0, shares: 0 });
    }
    
    const hasLiked = userId ? engagement.likedBy.includes(userId) : false;
    const hasShared = userId ? engagement.sharedBy.includes(userId) : false;
    
    res.json({
      likes: engagement.likes,
      shares: engagement.shares,
      hasLiked,
      hasShared
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching engagement", error: err.message });
  }
};

// Toggle like on a movie
exports.toggleLike = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;
    
    let engagement = await MovieEngagement.findOne({ movieId });
    
    if (!engagement) {
      engagement = await MovieEngagement.create({ 
        movieId, 
        likes: 1, 
        shares: 0,
        likedBy: [userId]
      });
      return res.json({ 
        likes: engagement.likes, 
        hasLiked: true,
        message: "Liked!" 
      });
    }
    
    const hasLiked = engagement.likedBy.includes(userId);
    
    if (hasLiked) {
      // Unlike
      engagement.likes = Math.max(0, engagement.likes - 1);
      engagement.likedBy = engagement.likedBy.filter(id => !id.equals(userId));
    } else {
      // Like
      engagement.likes += 1;
      engagement.likedBy.push(userId);
    }
    
    await engagement.save();
    
    res.json({ 
      likes: engagement.likes, 
      hasLiked: !hasLiked,
      message: hasLiked ? "Unliked" : "Liked!" 
    });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", error: err.message });
  }
};

// Increment share count
exports.incrementShare = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user?._id;
    
    let engagement = await MovieEngagement.findOne({ movieId });
    
    if (!engagement) {
      engagement = await MovieEngagement.create({ 
        movieId, 
        likes: 0, 
        shares: 1,
        sharedBy: userId ? [userId] : []
      });
    } else {
      engagement.shares += 1;
      if (userId && !engagement.sharedBy.includes(userId)) {
        engagement.sharedBy.push(userId);
      }
      await engagement.save();
    }
    
    res.json({ 
      shares: engagement.shares,
      message: "Shared successfully!" 
    });
  } catch (err) {
    res.status(500).json({ message: "Error incrementing share", error: err.message });
  }
};

// Get comments for a movie
exports.getComments = async (req, res) => {
  try {
    const { movieId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const comments = await Comment.find({ movieId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Comment.countDocuments({ movieId });
    
    res.json({
      comments,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;
    const username = req.user.username || req.user.name;
    const userProfilePicture = req.user.profilePicture;
    
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    
    if (comment.length > 1000) {
      return res.status(400).json({ message: "Comment too long (max 1000 characters)" });
    }
    
    const newComment = await Comment.create({
      movieId,
      userId,
      username,
      userProfilePicture,
      comment: comment.trim()
    });
    
    res.status(201).json({
      success: true,
      comment: newComment,
      message: "Comment added successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Only allow user to delete their own comments
    if (!comment.userId.equals(userId)) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }
    
    await Comment.findByIdAndDelete(commentId);
    
    res.json({ 
      success: true, 
      message: "Comment deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
};

