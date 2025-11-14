const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
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
  quality: {
    type: String,
    enum: ['720p', '1080p', '4K'],
    default: '1080p'
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  },
  status: {
    type: String,
    enum: ['downloaded', 'expired', 'deleted'],
    default: 'downloaded'
  }
}, { timestamps: true });

// Index for efficient queries
downloadSchema.index({ userId: 1, downloadedAt: -1 });
downloadSchema.index({ userId: 1, movieId: 1 });
downloadSchema.index({ expiresAt: 1 }); // For cleanup jobs

module.exports = mongoose.model('Download', downloadSchema);
