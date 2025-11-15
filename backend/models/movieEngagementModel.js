const mongoose = require('mongoose');

const movieEngagementSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sharedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MovieEngagement', movieEngagementSchema);
