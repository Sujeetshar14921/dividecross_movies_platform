const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");
const MovieInteraction = require("../models/movieInteractionModel");
const { verifyToken } = require("../middlewares/authMiddleware");

// Get all comments for a movie
router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const comments = await Comment.find({ movieId })
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// Add a comment
router.post("/:movieId", verifyToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    if (comment.length > 500) {
      return res.status(400).json({ message: "Comment too long (max 500 characters)" });
    }

    const newComment = await Comment.create({
      movieId,
      userId,
      username: req.user.username || req.user.name || req.user.email,
      userProfilePicture: req.user.profilePicture || "",
      comment: comment.trim()
    });

    res.status(201).json({ 
      message: "Comment added successfully", 
      comment: newComment 
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// Delete a comment
router.delete("/:commentId", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment owner can delete
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

// Toggle like on a movie
router.post("/like/:movieId", verifyToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const interaction = await MovieInteraction.findOne({ movieId, userId });

    if (interaction) {
      // Toggle like
      interaction.liked = !interaction.liked;
      await interaction.save();
      
      res.json({ 
        message: interaction.liked ? "Movie liked" : "Like removed",
        liked: interaction.liked 
      });
    } else {
      // Create new like
      await MovieInteraction.create({ movieId, userId, liked: true });
      res.json({ message: "Movie liked", liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Failed to update like" });
  }
});

// Get like status and total likes for a movie
router.get("/like/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    
    // Get total likes
    const totalLikes = await MovieInteraction.countDocuments({ movieId, liked: true });
    
    // Get user's like status if logged in
    let userLiked = false;
    if (token && req.user) {
      const interaction = await MovieInteraction.findOne({ 
        movieId, 
        userId: req.user.id 
      });
      userLiked = interaction?.liked || false;
    }

    res.json({ totalLikes, userLiked });
  } catch (error) {
    console.error("Error fetching like status:", error);
    res.status(500).json({ message: "Failed to fetch like status" });
  }
});

module.exports = router;
