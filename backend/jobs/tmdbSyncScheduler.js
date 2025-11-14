const cron = require('node-cron');
const { syncPopularMovies } = require('../services/tmdbService');

let isRunning = false;

// Schedule TMDb sync every 10 minutes
function startTmdbSyncScheduler() {
  console.log('⏰ TMDb sync scheduler initialized');
  
  // Run after 30 seconds on startup (give time for DB connection)
  setTimeout(async () => {
    console.log('🎬 Initial TMDb sync starting...');
    if (!isRunning) {
      isRunning = true;
      try {
        await syncPopularMovies();
      } catch (error) {
        console.error('Initial sync failed:', error.message);
      } finally {
        isRunning = false;
      }
    }
  }, 30000);
  
  // Schedule to run every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    if (isRunning) {
      console.log('⚠️ Previous sync still running, skipping...');
      return;
    }
    
    console.log('⏰ Running scheduled TMDb sync...');
    isRunning = true;
    
    try {
      await syncPopularMovies();
    } catch (error) {
      console.error('Scheduled sync failed:', error.message);
    } finally {
      isRunning = false;
    }
  });
  
  console.log('✅ TMDb will sync every 10 minutes');
}

module.exports = { startTmdbSyncScheduler };
