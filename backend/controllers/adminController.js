const Movie = require("../models/movieModel");
const User = require("../models/userModel");

/**
 * 📊 Admin Dashboard Overview
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const featuredCount = await Movie.countDocuments({ featured: true });

    const topSearched = await Movie.find()
      .sort({ searchCount: -1 })
      .limit(5)
      .select("title searchCount");

    res.status(200).json({
      stats: { totalUsers, totalMovies, featuredCount },
      topSearched,
    });
  } catch (err) {
    console.error("Dashboard Error:", err.message);
    res.status(500).json({ message: "Error loading dashboard", error: err.message });
  }
};

/**
 * 🌟 Toggle featured/unfeatured movie
 */
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    movie.featured = !movie.featured;
    await movie.save();

    res.status(200).json({
      message: `Movie ${movie.featured ? "marked" : "unmarked"} as featured`,
      movie,
    });
  } catch (err) {
    console.error("Toggle Featured Error:", err.message);
    res.status(500).json({ message: "Error toggling featured status", error: err.message });
  }
};

/**
 * 🗑️ Bulk delete movies
 */
exports.bulkDeleteMovies = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Please provide movie IDs to delete." });
    }

    await Movie.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Selected movies deleted successfully." });
  } catch (err) {
    console.error("Bulk Delete Error:", err.message);
    res.status(500).json({ message: "Error deleting movies", error: err.message });
  }
};
