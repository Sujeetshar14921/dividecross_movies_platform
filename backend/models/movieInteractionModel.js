const mongoose = require("mongoose");

const movieInteractionSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    liked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Compound index for user-movie interaction
movieInteractionSchema.index({ movieId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("MovieInteraction", movieInteractionSchema);
