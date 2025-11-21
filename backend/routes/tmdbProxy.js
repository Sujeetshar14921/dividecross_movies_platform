const express = require('express');
const axios = require('axios');
const router = express.Router();

// TMDB Proxy - Direct fetch with better error handling
router.get('/*', async (req, res) => {
  try {
    const tmdbPath = req.params[0] || req.path.substring(1);
    const queryParams = new URLSearchParams(req.query);
    queryParams.append('api_key', process.env.TMDB_API_KEY);
    
    const tmdbUrl = `https://api.themoviedb.org/3/${tmdbPath}?${queryParams}`;
    
    console.log(`🔄 Proxying TMDB request: ${tmdbPath}`);
    
    const response = await axios.get(tmdbUrl, {
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    console.log(`✅ TMDB Proxy success: ${tmdbPath}`);
    res.json(response.data);
  } catch (error) {
    console.error(`❌ TMDB Proxy error: ${error.message}`);
    res.status(error.response?.status || 500).json({
      error: 'TMDB API request failed',
      message: error.message,
      code: error.code
    });
  }
});

module.exports = router;
