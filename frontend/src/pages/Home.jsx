import React, { useEffect, useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import FeaturedMovies from "../components/FeaturedMovies";
import API from "../api/axios";

const Home = React.memo(() => {
  const [movies, setMovies] = useState([]);
  const [mostSearched, setMostSearched] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("featured");
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [personalizedRes, mostSearchedRes, recentlyAddedRes] = await Promise.allSettled([
        API.get("/api/movies/personalized").catch(() => API.get("/api/movies/trending")),
        API.get("/api/movies/most-searched").catch(() => API.get("/api/movies/top-rated")),
        API.get("/api/movies/recently-added").catch(() => API.get("/api/movies/now-playing"))
      ]);
      
      const personalizedMovies = personalizedRes.status === 'fulfilled' 
        ? (personalizedRes.value?.data?.movies || []) 
        : [];
      
      const mostSearchedMovies = mostSearchedRes.status === 'fulfilled'
        ? (mostSearchedRes.value?.data?.movies || [])
        : [];
      
      const recentMoviesData = recentlyAddedRes.status === 'fulfilled'
        ? (recentlyAddedRes.value?.data?.movies || [])
        : [];
      
      if (personalizedMovies.length === 0 && mostSearchedMovies.length === 0 && recentMoviesData.length === 0) {
        const fallbackRes = await API.get("/api/movies");
        const fallbackMovies = fallbackRes.data?.movies || [];
        setMovies(fallbackMovies.slice(0, 20));
        setMostSearched(fallbackMovies.slice(20, 40));
        setRecentMovies(fallbackMovies.slice(40, 60));
      } else {
        setMovies(personalizedMovies);
        setMostSearched(mostSearchedMovies);
        setRecentMovies(recentMoviesData);
      }
    } catch (err) {
      setError("Failed to load movies. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Auto-load on mount
    fetchMovies();

    // Auto-refresh every 3 minutes (180000ms) for fresh content
    const refreshInterval = setInterval(() => {
      fetchMovies();
    }, 180000);

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, [fetchMovies]);

  const handleSearchResults = useCallback((results) => {
    if (results === null) {
      fetchMovies();
    } else {
      setMovies(results);
      setMostSearched([]);
      setRecentMovies([]);
      setActiveCategory("featured");
    }
  }, [fetchMovies]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 mx-6">
          {error}
        </div>
      )}
      
      {/* Search Bar Section - Below sidebar z-index */}
      <div className="relative z-30">
        <SearchBar onSearchResults={handleSearchResults} />
      </div>

      {/* Featured Movies Section - Below search bar */}
      <div className="relative z-10">
        <FeaturedMovies
          movies={movies}
          mostSearched={mostSearched}
          recentMovies={recentMovies}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          loading={loading}
        />
      </div>
    </div>
  );
});

export default Home;
