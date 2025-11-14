// controllers/tmdbController.js
const axios = require("axios");
const Movie = require("../models/movieModel");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * 🔁 Fetch movies from TMDB (1–5 pages)
 *  ✅ Allows duplicates — no upsert or unique check
 *  ✅ Logs each batch insert
 */
const fetchAndSaveMovies = async (req, res) => {
  try {
    if (!TMDB_API_KEY)
      return res.status(400).json({ error: "TMDB_API_KEY missing!" });

    let totalInserted = 0;

    // 🔹 Loop through 5 pages of popular movies
    for (let page = 1; page <= 5; page++) {
      console.log(`🎥 Fetching TMDB popular movies (page: ${page})...`);

      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: { api_key: TMDB_API_KEY, language: "en-US", page },
      });

      const movies = response.data.results.map((movie) => ({
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        rating: movie.vote_average,
        popularity: movie.popularity,
        fetchedAt: new Date(), // ✅ Add timestamp to track fetch time
      }));

      // 🔹 Directly insert (duplicates allowed)
      try {
        await Movie.insertMany(movies, { ordered: false });
        totalInserted += movies.length;
        console.log(`✅ Page ${page}: ${movies.length} movies inserted (duplicates allowed).`);
      } catch (error) {
        console.warn(`⚠️ Page ${page} insert warning: ${error.message}`);
      }
    }

    console.log(`🎯 Total ${totalInserted} movies inserted successfully (duplicates allowed).`);
    return res.status(200).json({
      message: `Fetched & saved ${totalInserted} movies successfully.`,
    });
  } catch (err) {
    console.error("❌ TMDB Fetch Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * 🎞️ Get All Movies (sorted by latest)
 */
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ fetchedAt: -1 });
    res.status(200).json({ success: true, movies });
  } catch (err) {
    console.error("❌ Get Movies Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { fetchAndSaveMovies, getAllMovies };
