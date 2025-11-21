# ========================================
# TMDB Network Connectivity Fix Script
# ========================================
# This script fixes network connectivity issues with TMDB API
# Run this script as Administrator

Write-Host "`n🔧 TMDB Network Fix Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "💡 Right-click PowerShell and select 'Run as Administrator', then run this script again`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Running with Administrator privileges`n" -ForegroundColor Green

# 1. Flush DNS Cache
Write-Host "1️⃣ Flushing DNS cache..." -ForegroundColor Cyan
ipconfig /flushdns | Out-Null
Write-Host "✅ DNS cache flushed`n" -ForegroundColor Green

# 2. Reset Winsock
Write-Host "2️⃣ Resetting Winsock catalog..." -ForegroundColor Cyan
netsh winsock reset | Out-Null
Write-Host "✅ Winsock reset complete`n" -ForegroundColor Green

# 3. Reset TCP/IP stack
Write-Host "3️⃣ Resetting TCP/IP stack..." -ForegroundColor Cyan
netsh int ip reset | Out-Null
Write-Host "✅ TCP/IP reset complete`n" -ForegroundColor Green

# 4. Add Node.js Firewall Rules for outbound connections
Write-Host "4️⃣ Adding Node.js firewall rules..." -ForegroundColor Cyan

$nodePath = (Get-Command node).Source

# Remove existing rules
netsh advfirewall firewall delete rule name="Node.js - TMDB API Outbound" 2>$null | Out-Null

# Add new outbound rule for TMDB API
netsh advfirewall firewall add rule name="Node.js - TMDB API Outbound" dir=out action=allow program="$nodePath" enable=yes profile=any protocol=TCP remoteport=443 | Out-Null

Write-Host "✅ Firewall rules added for: $nodePath`n" -ForegroundColor Green

# 5. Clear proxy settings
Write-Host "5️⃣ Checking proxy settings..." -ForegroundColor Cyan
$proxySettings = netsh winhttp show proxy
if ($proxySettings -match "Direct access") {
    Write-Host "✅ No proxy configured (direct access)`n" -ForegroundColor Green
} else {
    Write-Host "⚠️ Proxy detected. Resetting to direct access..." -ForegroundColor Yellow
    netsh winhttp reset proxy | Out-Null
    Write-Host "✅ Proxy reset to direct access`n" -ForegroundColor Green
}

# 6. Test connectivity
Write-Host "6️⃣ Testing connectivity to api.themoviedb.org..." -ForegroundColor Cyan
try {
    $test = Test-NetConnection -ComputerName api.themoviedb.org -Port 443 -InformationLevel Quiet
    if ($test) {
        Write-Host "✅ Connection to TMDB API successful!`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Still cannot connect to TMDB API" -ForegroundColor Red
        Write-Host "💡 Additional steps needed:`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Test-NetConnection failed, but rules are applied`n" -ForegroundColor Yellow
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "✨ Network fix complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Restart your computer for all changes to take effect" -ForegroundColor White
Write-Host "2. After restart, run: node testNetwork.js" -ForegroundColor White
Write-Host "3. If still failing, temporarily disable antivirus/firewall`n" -ForegroundColor White

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
