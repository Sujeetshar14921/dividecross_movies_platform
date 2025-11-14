// movieModel.js

const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    overview: String,
    releaseDate: String,
    posterUrl: String,
    backdropUrl: String,
    rating: Number,
    popularity: Number,
    runtime: Number,
    genres: [String],
    cast: {
      type: [
        {
          id: { type: Number },
          name: { type: String },
          character: { type: String },
          profilePath: { type: String }
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

// Index for better search performance
movieSchema.index({ title: 'text', overview: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ popularity: -1 });

module.exports = mongoose.model("Movie", movieSchema);

// Index for better search performance
movieSchema.index({ title: 'text', overview: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ popularity: -1 });

module.exports = mongoose.model("Movie", movieSchema);
