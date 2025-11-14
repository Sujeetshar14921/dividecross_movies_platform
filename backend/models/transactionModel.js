const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['subscription', 'movie_purchase'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  itemId: {
    type: String // Plan ID or Movie ID
  },
  itemName: {
    type: String
  },
  gateway: {
    type: String,
    enum: ['razorpay', 'stripe'],
    default: 'razorpay'
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object // Additional payment gateway data
  }
}, { timestamps: true });

transactionSchema.index({ userId: 1, transactionDate: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
