const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Free', 'Basic', 'Premium', 'Ultra']
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  duration: {
    type: Number, // in days
    required: true,
    default: 0
  },
  features: [{
    type: String
  }],
  maxResolution: {
    type: String,
    enum: ['480p', '720p', '1080p', '4K'],
    default: '480p'
  },
  canDownload: {
    type: Boolean,
    default: false
  },
  adsEnabled: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
