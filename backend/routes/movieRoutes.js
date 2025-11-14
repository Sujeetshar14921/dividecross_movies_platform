const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const auth = require("../middlewares/auth");

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
router.post("/track-activity", auth, movieController.trackActivity);

// 📑 Watchlist routes
router.post("/watchlist", auth, movieController.addToWatchlist);
router.delete("/watchlist/:movieId", auth, movieController.removeFromWatchlist);
router.get("/watchlist", auth, movieController.getWatchlist);

// 📜 Viewing History routes
router.post("/history", auth, movieController.addToHistory);
router.get("/history", auth, movieController.getViewingHistory);
router.delete("/history", auth, movieController.clearHistory);

// 💾 Downloads routes
router.post("/downloads", auth, movieController.addDownload);
router.get("/downloads", auth, movieController.getDownloads);
router.delete("/downloads/:movieId", auth, movieController.removeDownload);

// 🔍 Search History routes
router.get("/search-history", auth, movieController.getUserSearchHistory);
router.delete("/search-history/:id", auth, movieController.deleteSearchKeyword);
router.delete("/search-history", auth, movieController.clearSearchHistory);

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
