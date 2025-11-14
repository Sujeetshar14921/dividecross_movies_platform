import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Movie from "../models/Movie.js";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cineverse";

const importMovies = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    const movies = data.results.map(m => ({
      title: m.title,
      overview: m.overview,
      genres: [], // optional: you can add genre names later
      posterPath: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      tmdbId: m.id
    }));

    await Movie.insertMany(movies);
    console.log(`✅ Imported ${movies.length} movies`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error importing movies:", err);
    process.exit(1);
  }
};

importMovies();
