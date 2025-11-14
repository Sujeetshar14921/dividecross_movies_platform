const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  query: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  searchCount: {
    type: Number,
    default: 1
  },
  lastSearched: {
    type: Date,
    default: Date.now
  },
  movieIds: [{
    type: Number
  }]
});

searchHistorySchema.index({ userId: 1, searchCount: -1, lastSearched: -1 });
searchHistorySchema.index({ searchCount: -1, lastSearched: -1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
