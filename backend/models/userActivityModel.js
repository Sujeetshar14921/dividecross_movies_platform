const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  movieId: {
    type: Number,
    required: true,
    index: true
  },
  activityType: {
    type: String,
    enum: ['search', 'view', 'play', 'like', 'comment', 'share'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    searchQuery: String,
    duration: Number,
    rating: Number
  }
});

userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ movieId: 1, activityType: 1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
