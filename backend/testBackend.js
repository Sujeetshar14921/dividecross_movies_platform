const axios = require('axios');

async function testBackend() {
  console.log('🧪 Testing Backend API with fallback movies...\n');

  try {
    console.log('1️⃣ Testing /api/movies endpoint...');
    const response = await axios.get('http://localhost:8000/api/movies?page=1', {
      timeout: 20000 // 20 second timeout
    });
    
    if (response.data.movies && response.data.movies.length > 0) {
      console.log('✅ SUCCESS! Movies loaded:', response.data.movies.length);
      console.log('📽️  First movie:', response.data.movies[0].title);
      console.log('\n📊 Sample movies:');
      response.data.movies.slice(0, 3).forEach((m, i) => {
        console.log(`   ${i+1}. ${m.title} (${m.release_date}) - Rating: ${m.vote_average}`);
      });
    } else {
      console.log('❌ No movies returned');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testBackend();
