# TMDB API Network Fix Script
# This script fixes TMDB API connection issues by configuring proxy and DNS

Write-Host "🔧 TMDB Network Connection Fix" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script requires Administrator privileges" -ForegroundColor Yellow
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Clear DNS Cache
Write-Host "1️⃣  Clearing DNS cache..." -ForegroundColor Green
try {
    Clear-DnsClientCache
    Write-Host "   ✅ DNS cache cleared successfully" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not clear DNS cache: $_" -ForegroundColor Yellow
}
Write-Host ""

# Step 2: Configure DNS to use Google DNS
Write-Host "2️⃣  Configuring Google DNS (8.8.8.8)..." -ForegroundColor Green
try {
    $adapters = Get-NetAdapter | Where-Object {$_.Status -eq "Up"}
    foreach ($adapter in $adapters) {
        Write-Host "   Setting DNS for: $($adapter.Name)" -ForegroundColor Cyan
        Set-DnsClientServerAddress -InterfaceIndex $adapter.ifIndex -ServerAddresses ("8.8.8.8","8.8.4.4")
    }
    Write-Host "   ✅ DNS configured successfully" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not configure DNS: $_" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Reset network settings
Write-Host "3️⃣  Resetting network settings..." -ForegroundColor Green
try {
    netsh winsock reset | Out-Null
    netsh int ip reset | Out-Null
    Write-Host "   ✅ Network settings reset successfully" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not reset network: $_" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Test TMDB API connection
Write-Host "4️⃣  Testing TMDB API connection..." -ForegroundColor Green
try {
    $testUrl = "https://api.themoviedb.org/3/movie/popular?api_key=1728f401ea62e103e9c23cf044a944ef"
    $response = Invoke-WebRequest -Uri $testUrl -TimeoutSec 30 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ TMDB API is accessible!" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "   📊 Fetched $($data.results.Count) movies successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ TMDB API still not accessible" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "   📝 Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "   1. Check if you're behind a firewall or proxy" -ForegroundColor Yellow
    Write-Host "   2. Contact your network administrator" -ForegroundColor Yellow
    Write-Host "   3. Try using a VPN service" -ForegroundColor Yellow
    Write-Host "   4. Check if api.themoviedb.org is blocked" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Configure Node.js proxy if needed
Write-Host "5️⃣  Checking proxy configuration..." -ForegroundColor Green
$httpProxy = [System.Environment]::GetEnvironmentVariable("HTTP_PROXY", "User")
$httpsProxy = [System.Environment]::GetEnvironmentVariable("HTTPS_PROXY", "User")

if ($httpProxy -or $httpsProxy) {
    Write-Host "   ℹ️  Proxy already configured:" -ForegroundColor Cyan
    if ($httpProxy) { Write-Host "   HTTP_PROXY: $httpProxy" -ForegroundColor Cyan }
    if ($httpsProxy) { Write-Host "   HTTPS_PROXY: $httpsProxy" -ForegroundColor Cyan }
} else {
    Write-Host "   ℹ️  No proxy configured (direct connection)" -ForegroundColor Cyan
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎬 Network fix completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your backend server (npm start)" -ForegroundColor White
Write-Host "2. If issue persists, restart your computer" -ForegroundColor White
Write-Host "3. Try accessing: http://localhost:8000" -ForegroundColor White
Write-Host ""
