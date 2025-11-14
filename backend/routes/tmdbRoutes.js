const express = require("express");
const router = express.Router();
const {
  fetchAndSaveMovies,
  getAllMovies,
} = require("../controllers/tmdbController");

// ✅ Update DB with latest TMDB data
router.get("/update", fetchAndSaveMovies);

// ✅ Get all movies from DB
router.get("/all", getAllMovies);

module.exports = router;
