// This job calls ML service /rebuild endpoint (use in cron or queue)
const axios = require('axios');

async function rebuild() {
  try {
    const ML = process.env.ML_SERVICE_URL || 'http://localhost:6000';
    const resp = await axios.post(`${ML}/rebuild`);
    console.log('Rebuild response:', resp.data);
  } catch (err) {
    console.error('Rebuild failed:', err.message);
  }
}

// Run immediately if called directly
if (require.main === module) {
  rebuild();
}

module.exports = rebuild;
