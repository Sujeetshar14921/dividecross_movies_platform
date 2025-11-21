const axios = require('axios');
const dns = require('dns').promises;
const https = require('https');

// Set DNS to Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function testNetwork() {
  console.log('🔍 Network Diagnostics Starting...\n');

  // Test 1: DNS Resolution
  console.log('1️⃣ Testing DNS resolution for api.themoviedb.org...');
  try {
    const addresses = await dns.resolve4('api.themoviedb.org');
    console.log('✅ DNS Resolution successful:', addresses.join(', '));
  } catch (error) {
    console.error('❌ DNS Resolution failed:', error.message);
    console.log('💡 Solution: Check your internet connection or try changing DNS to 8.8.8.8');
  }

  console.log('\n2️⃣ Testing HTTPS connection to TMDB...');
  
  // Test 2: Direct HTTPS request
  try {
    const httpsAgent = new https.Agent({
      keepAlive: true,
      rejectUnauthorized: false,
      timeout: 30000
    });

    const response = await axios.get('https://api.themoviedb.org/3/configuration', {
      params: { api_key: process.env.TMDB_API_KEY },
      timeout: 30000,
      httpsAgent: httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ HTTPS connection successful!');
    console.log('✅ TMDB API is reachable');
    console.log('✅ API Key is valid');
    console.log('\n📊 Response:', {
      status: response.status,
      statusText: response.statusText,
      imageBaseUrl: response.data.images?.secure_base_url
    });
  } catch (error) {
    console.error('❌ HTTPS connection failed:', error.message);
    if (error.code) console.error('   Error Code:', error.code);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Status Text:', error.response.statusText);
    }
    
    console.log('\n🔧 Possible Solutions:');
    console.log('   • Disable Windows Firewall temporarily');
    console.log('   • Check if antivirus is blocking Node.js');
    console.log('   • Disable VPN if active');
    console.log('   • Check proxy settings: netsh winhttp show proxy');
    console.log('   • Try: netsh winsock reset (requires admin)');
  }

  // Test 3: Check if behind proxy
  console.log('\n3️⃣ Checking proxy configuration...');
  const proxyEnv = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.https_proxy;
  if (proxyEnv) {
    console.log('⚠️ Proxy detected:', proxyEnv);
    console.log('💡 You may need to configure proxy settings in axios');
  } else {
    console.log('✅ No proxy environment variables detected');
  }

  console.log('\n✨ Network diagnostics complete!\n');
}

testNetwork().catch(console.error);
