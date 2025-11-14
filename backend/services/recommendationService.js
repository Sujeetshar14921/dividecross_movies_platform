const Movie = require('../models/movieModel');
const { getTrendingMovies: getTmdbTrending, getMoviesByGenre: getTmdbByGenre } = require('./tmdbService');

// Genre name to TMDb genre ID mapping
const genreMap = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'science fiction': 878,
  'sci-fi': 878,
  'tv movie': 10770,
  'thriller': 53,
  'war': 10752,
  'western': 37
};

// Calculate TF-IDF based cosine similarity
function calculateCosineSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().match(/\w+/g) || [];
  const words2 = text2.toLowerCase().match(/\w+/g) || [];
  
  // Create word frequency maps
  const freq1 = {};
  const freq2 = {};
  const allWords = new Set([...words1, ...words2]);
  
  words1.forEach(word => freq1[word] = (freq1[word] || 0) + 1);
  words2.forEach(word => freq2[word] = (freq2[word] || 0) + 1);
  
  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  allWords.forEach(word => {
    const f1 = freq1[word] || 0;
    const f2 = freq2[word] || 0;
    dotProduct += f1 * f2;
    magnitude1 += f1 * f1;
    magnitude2 += f2 * f2;
  });
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

// Get movie recommendations based on similarity
async function getRecommendations(movieTitle, topK = 10) {
  try {
    // Find the target movie
    const targetMovie = await Movie.findOne({ 
      title: { $regex: new RegExp(movieTitle, 'i') } 
    });
    
    if (!targetMovie) {
      throw new Error('Movie not found');
    }
    
    // Get all movies from database
    const allMovies = await Movie.find({
      _id: { $ne: targetMovie._id }
    }).select('title overview genres posterUrl backdropUrl rating popularity');
    
    // Create text representation for target movie
    const targetText = `${targetMovie.title} ${targetMovie.overview} ${targetMovie.genres?.join(' ') || ''}`;
    
    // Calculate similarity for each movie
    const moviesWithSimilarity = allMovies.map(movie => {
      const movieText = `${movie.title} ${movie.overview} ${movie.genres?.join(' ') || ''}`;
      const similarity = calculateCosineSimilarity(targetText, movieText);
      
      return {
        _id: movie._id,
        title: movie.title,
        overview: movie.overview,
        genres: movie.genres,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        rating: movie.rating,
        popularity: movie.popularity,
        similarity: Math.round(similarity * 100)
      };
    });
    
    // Sort by similarity and get top K
    const recommendations = moviesWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    return {
      movie: targetMovie.title,
      similarMovies: recommendations,
      count: recommendations.length
    };
    
  } catch (error) {
    throw error;
  }
}

// Get personalized recommendations based on user's watched movies
async function getPersonalizedRecommendations(userId, topK = 10) {
  try {
    // Get user's watch history or liked movies
    // For now, returning top rated movies as fallback
    const recommendations = await Movie.find()
      .sort({ rating: -1, popularity: -1 })
      .limit(topK)
      .select('title overview genres posterUrl backdropUrl rating popularity');
    
    return {
      userId,
      recommendations,
      count: recommendations.length
    };
    
  } catch (error) {
    throw error;
  }
}

// Get movies by genre
async function getMoviesByGenre(genre, limit = 20) {
  try {
    // Convert genre name to genre ID
    const genreId = genreMap[genre.toLowerCase()];
    
    if (!genreId) {
      throw new Error(`Genre '${genre}' not found`);
    }
    
    // Use TMDb API to get movies by genre
    const result = await getTmdbByGenre(genreId, 1);
    const movies = result.movies || [];
    return movies.slice(0, limit);
  } catch (error) {
    console.error('Error in getMoviesByGenre:', error);
    throw error;
  }
}

// Get trending movies
async function getTrendingMovies(limit = 20) {
  try {
    // Use TMDb API to get trending movies
    const tmdbMovies = await getTmdbTrending('week');
    return tmdbMovies.slice(0, limit);
  } catch (error) {
    console.error('Error in getTrendingMovies:', error);
    throw error;
  }
}

module.exports = {
  getRecommendations,
  getPersonalizedRecommendations,
  getMoviesByGenre,
  getTrendingMovies
};
