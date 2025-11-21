const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { verifyToken } = require("../middlewares/auth");

// ⚡ Live Search Suggestions
router.get("/suggestions", movieController.getSuggestions);

// 🔍 Search movies
router.get("/search", movieController.searchMovies);

// 🎬 Get all movies
router.get("/", movieController.getAllMovies);

// 🔥 Most searched movies
router.get("/most-searched", movieController.getMostSearched);

// 🆕 Recently added movies
router.get("/recently-added", movieController.getRecentlyAdded);

// 🎯 Personalized recommendations
router.get("/personalized", movieController.getPersonalizedRecommendations);

// 📊 Track user activity
router.post("/track-activity", verifyToken, movieController.trackActivity);

// 📑 Watchlist routes
router.post("/watchlist", verifyToken, movieController.addToWatchlist);
router.delete("/watchlist/:movieId", verifyToken, movieController.removeFromWatchlist);
router.get("/watchlist", verifyToken, movieController.getWatchlist);

// 📜 Viewing History routes
router.post("/history", verifyToken, movieController.addToHistory);
router.get("/history", verifyToken, movieController.getViewingHistory);
router.delete("/history", verifyToken, movieController.clearHistory);

// 💾 Downloads routes
router.post("/downloads", verifyToken, movieController.addDownload);
router.get("/downloads", verifyToken, movieController.getDownloads);
router.delete("/downloads/:movieId", verifyToken, movieController.removeDownload);

// 🔍 Search History routes
router.get("/search-history", verifyToken, movieController.getUserSearchHistory);
router.delete("/search-history/:id", verifyToken, movieController.deleteSearchKeyword);
router.delete("/search-history", verifyToken, movieController.clearSearchHistory);

// 👍 Movie Engagement routes (likes, shares)
router.get("/engagement/:movieId", movieController.getMovieEngagement);
router.post("/engagement/:movieId/like", verifyToken, movieController.toggleLike);
router.post("/engagement/:movieId/share", movieController.incrementShare);

// 💬 Comments routes
router.get("/comments/:movieId", movieController.getComments);
router.post("/comments/:movieId", verifyToken, movieController.addComment);
router.delete("/comments/:commentId", verifyToken, movieController.deleteComment);

// 🔥 Trending movies
router.get("/trending", movieController.getTrendingMovies);

// ⭐ Top Rated movies
router.get("/top-rated", movieController.getTopRatedMovies);

// 🎥 Now Playing movies
router.get("/now-playing", movieController.getNowPlayingMovies);

// 🎬 Upcoming movies
router.get("/upcoming", movieController.getUpcomingMovies);

// 🎯 Get single movie details (should be after specific routes)
router.get("/:id", movieController.getMovieDetails);

// 🧩 Admin-only
router.post("/", movieController.addMovie);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
