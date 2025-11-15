const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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
    username: {
      type: String,
      required: true
    },
    userProfilePicture: {
      type: String,
      default: ""
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Index for faster queries
commentSchema.index({ movieId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
