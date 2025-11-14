// controllers/recommendationController.js
const { 
  getRecommendations, 
  getPersonalizedRecommendations,
  getMoviesByGenre,
  getTrendingMovies 
} = require('../services/recommendationService');

// Get similar movies based on a movie title
exports.getSimilarMovies = async (req, res) => {
  try {
    const { movieTitle } = req.body;
    const topK = parseInt(req.body.topK) || 10;
    
    if (!movieTitle) {
      return res.status(400).json({ error: 'Movie title is required' });
    }
    
    const recommendations = await getRecommendations(movieTitle, topK);
    return res.json(recommendations);
    
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ 
      error: err.message || 'Failed to get recommendations' 
    });
  }
};

// Get personalized recommendations for user
exports.getForUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    const limit = parseInt(req.query.n) || 10;
    
    const recommendations = await getPersonalizedRecommendations(userId, limit);
    return res.json(recommendations);
    
  } catch (err) {
    console.error('User recommendation error:', err);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

// Get movies by genre
exports.getByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const movies = await getMoviesByGenre(genre, limit);
    return res.json({ genre, movies, count: movies.length });
    
  } catch (err) {
    console.error('Genre fetch error:', err);
    res.status(500).json({ error: 'Failed to get movies by genre' });
  }
};

// Get trending movies
exports.getTrending = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const movies = await getTrendingMovies(limit);
    return res.json({ movies, count: movies.length });
    
  } catch (err) {
    console.error('Trending fetch error:', err);
    res.status(500).json({ error: 'Failed to get trending movies' });
  }
};
