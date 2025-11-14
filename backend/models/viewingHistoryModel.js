const mongoose = require('mongoose');

const viewingHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  movieId: {
    type: Number,
    required: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  moviePoster: String,
  watchedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index for efficient queries
viewingHistorySchema.index({ userId: 1, watchedAt: -1 });
viewingHistorySchema.index({ userId: 1, movieId: 1 });

module.exports = mongoose.model('ViewingHistory', viewingHistorySchema);
