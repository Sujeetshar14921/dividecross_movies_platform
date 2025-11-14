const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Robust axios instance with retry logic
const api = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  params: { api_key: TMDB_API_KEY },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Retry interceptor for failed requests
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    if (!config || !config.retry) {
      config.retry = 0;
    }
    
    // Retry up to 3 times
    if (config.retry < 3) {
      config.retry += 1;
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retry)); // Exponential backoff
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

// Helper to format movie data
const formatMovie = (movie) => ({
  id: movie.id,
  tmdbId: movie.id,
  title: movie.title,
  overview: movie.overview,
  release_date: movie.release_date,
  releaseDate: movie.release_date,
  poster_path: movie.poster_path,
  backdrop_path: movie.backdrop_path,
  posterUrl: movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : null,
  backdropUrl: movie.backdrop_path ? IMAGE_BASE_URL + movie.backdrop_path : null,
  vote_average: movie.vote_average,
  rating: movie.vote_average,
  popularity: movie.popularity,
  genre_ids: movie.genre_ids
});

async function getPopularMovies(page = 1) {
  try {
    const { data } = await api.get('/movie/popular', { params: { page } });
    return {
      movies: data.results.map(formatMovie),
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results
    };
  } catch (error) {
    console.error('TMDB Popular Movies Error:', error.message);
    // Return empty but valid structure
    return { movies: [], page: 1, totalPages: 0, totalResults: 0 };
  }
}

async function getTrendingMovies(timeWindow = 'week') {
  try {
    const { data } = await api.get(`/trending/movie/${timeWindow}`);
    return data.results.map(formatMovie);
  } catch (error) {
    console.error('TMDB Trending Error:', error.message);
    return [];
  }
}

async function getTopRatedMovies(page = 1) {
  try {
    const { data } = await api.get('/movie/top_rated', { params: { page } });
    return {
      movies: data.results.map(formatMovie),
      page: data.page,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error('TMDB Top Rated Error:', error.message);
    return { movies: [], page: 1, totalPages: 0 };
  }
}

async function getNowPlayingMovies(page = 1) {
  try {
    const { data } = await api.get('/movie/now_playing', { params: { page } });
    return {
      movies: data.results.map(formatMovie),
      page: data.page,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error('TMDB Now Playing Error:', error.message);
    return { movies: [], page: 1, totalPages: 0 };
  }
}

async function getUpcomingMovies(page = 1) {
  try {
    const { data } = await api.get('/movie/upcoming', { params: { page } });
    return {
      movies: data.results.map(formatMovie),
      page: data.page,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error('TMDB Upcoming Error:', error.message);
    return { movies: [], page: 1, totalPages: 0 };
  }
}

async function searchMovies(query, page = 1) {
  try {
    // Smart multi-source search from TMDB
    const [movieSearch, personSearch, genresResponse] = await Promise.all([
      // Direct movie title search
      api.get('/search/movie', { 
        params: { query, page, include_adult: false } 
      }),
      // Search for actors/directors
      api.get('/search/person', {
        params: { query, page: 1 }
      }).catch(() => ({ data: { results: [] } })),
      // Get all genres for matching
      api.get('/genre/movie/list').catch(() => ({ data: { genres: [] } }))
    ]);
    
    // Match genres by name
    const matchingGenres = genresResponse.data.genres?.filter(g => 
      g.name.toLowerCase().includes(query.toLowerCase())
    ) || [];
    
    let movies = movieSearch.data.results.map(formatMovie);
    const movieIds = new Set(movies.map(m => m.id));
    
    // If person found (actor/director), get their top movies
    if (personSearch.data.results.length > 0) {
      const topPeople = personSearch.data.results.slice(0, 2); // Top 2 matching people
      
      for (const person of topPeople) {
        const personMovies = await api.get(`/person/${person.id}/movie_credits`)
          .catch(() => ({ data: { cast: [], crew: [] } }));
        
        const personMoviesList = [
          ...(personMovies.data.cast || []),
          ...(personMovies.data.crew || []).filter(m => m.job === 'Director')
        ]
          .filter(m => m.id && !movieIds.has(m.id) && m.popularity > 5)
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 8)
          .map(formatMovie);
        
        movies = [...movies, ...personMoviesList];
        personMoviesList.forEach(m => movieIds.add(m.id));
      }
    }
    
    // If genre matches, get trending movies from that genre
    if (matchingGenres.length > 0) {
      const genreIds = matchingGenres.slice(0, 2).map(g => g.id).join(',');
      const genreMovies = await api.get('/discover/movie', {
        params: { 
          with_genres: genreIds, 
          sort_by: 'popularity.desc',
          'vote_count.gte': 100,
          page: 1 
        }
      }).catch(() => ({ data: { results: [] } }));
      
      const genreMoviesList = (genreMovies.data.results || [])
        .filter(m => !movieIds.has(m.id))
        .slice(0, 12)
        .map(formatMovie);
      
      movies = [...movies, ...genreMoviesList];
    }
    
    // Sort by relevance (popularity + rating)
    movies.sort((a, b) => {
      const scoreA = (a.popularity || 0) * 0.7 + (a.vote_average || 0) * 3;
      const scoreB = (b.popularity || 0) * 0.7 + (b.vote_average || 0) * 3;
      return scoreB - scoreA;
    });
    
    return {
      movies: movies.slice(0, 30),
      page: movieSearch.data.page,
      totalPages: movieSearch.data.total_pages,
      totalResults: movies.length
    };
  } catch (error) {
    console.error('Search error:', error.message);
    throw error;
  }
}

async function getMovieDetails(tmdbId) {
  const { data } = await api.get(`/movie/${tmdbId}`, {
    params: { append_to_response: 'credits,videos,similar' }
  });

  const trailer = data.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  ) || data.videos?.results?.[0];

  return {
    id: data.id,
    tmdbId: data.id,
    title: data.title,
    overview: data.overview,
    tagline: data.tagline,
    release_date: data.release_date,
    releaseDate: data.release_date,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    posterUrl: data.poster_path ? IMAGE_BASE_URL + data.poster_path : null,
    backdropUrl: data.backdrop_path ? IMAGE_BASE_URL + data.backdrop_path : null,
    vote_average: data.vote_average,
    rating: data.vote_average,
    popularity: data.popularity,
    runtime: data.runtime,
    budget: data.budget,
    revenue: data.revenue,
    status: data.status,
    genres: data.genres?.map(g => g.name) || [],
    production_companies: data.production_companies?.map(c => c.name) || [],
    trailer: trailer ? {
      key: trailer.key,
      name: trailer.name,
      url: `https://www.youtube.com/embed/${trailer.key}`
    } : null,
    cast: data.credits?.cast?.slice(0, 10).map(c => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profilePath: c.profile_path ? IMAGE_BASE_URL + c.profile_path : null
    })) || [],
    director: data.credits?.crew?.find(c => c.job === 'Director'),
    similarMovies: data.similar?.results?.slice(0, 10).map(formatMovie) || []
  };
}

async function getMoviesByGenre(genreId, page = 1) {
  const { data } = await api.get('/discover/movie', {
    params: { with_genres: genreId, page, sort_by: 'popularity.desc' }
  });
  return {
    movies: data.results.map(formatMovie),
    page: data.page,
    totalPages: data.total_pages
  };
}

async function getGenres() {
  const { data } = await api.get('/genre/movie/list');
  return data.genres;
}

module.exports = {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails,
  getMoviesByGenre,
  getGenres
};
