const mongoose = require("mongoose");

const moviePurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: String, // TMDb movie ID
    required: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active'
  }
}, { timestamps: true });

// Index for quick access checks
moviePurchaseSchema.index({ userId: 1, movieId: 1 });
moviePurchaseSchema.index({ expiryDate: 1 });

module.exports = mongoose.model("MoviePurchase", moviePurchaseSchema);
