# 🔧 TMDB Network Connectivity Fix Guide

## Problem
Backend cannot connect to TMDB API due to network issues:
- ❌ ETIMEDOUT errors
- ❌ DNS resolution fails
- ❌ Firewall blocking
- ❌ Antivirus blocking

---

## 🚀 Quick Fix (Run as Administrator)

### Option 1: Automated Fix Script
1. **Right-click PowerShell** → **"Run as Administrator"**
2. Navigate to backend folder:
   ```powershell
   cd c:\Users\sujee\OneDrive\Desktop\codex\dividecross_movies_platform-main\backend
   ```
3. Run the fix script:
   ```powershell
   .\fixNetwork.ps1
   ```
4. **Restart your computer**
5. Test connectivity:
   ```powershell
   node testNetwork.js
   ```

---

## 🔍 Manual Fixes

### Fix 1: Flush DNS Cache
```powershell
ipconfig /flushdns
```

### Fix 2: Reset Winsock (Requires Admin)
```powershell
netsh winsock reset
netsh int ip reset
```

### Fix 3: Add Node.js Firewall Rule
```powershell
# Find Node.js path
(Get-Command node).Source

# Add outbound rule for HTTPS (port 443)
netsh advfirewall firewall add rule name="Node.js - TMDB API" dir=out action=allow program="C:\Program Files\nodejs\node.exe" enable=yes protocol=TCP remoteport=443
```

### Fix 4: Reset Proxy Settings
```powershell
netsh winhttp reset proxy
```

### Fix 5: Test Connectivity
```powershell
Test-NetConnection -ComputerName api.themoviedb.org -Port 443
```

---

## 🛡️ Antivirus Solutions

### Windows Defender
1. Open **Windows Security**
2. Go to **Firewall & network protection**
3. Click **Allow an app through firewall**
4. Find **Node.js JavaScript Runtime**
5. Enable for **Private** and **Public** networks

### Third-Party Antivirus
If you have Norton, McAfee, Avast, Kaspersky, etc.:
1. Open your antivirus settings
2. Find **Firewall** or **Network Protection**
3. Add **Node.js** to allowed applications
4. Add exception for: `C:\Program Files\nodejs\node.exe`

---

## 🌐 VPN/Proxy Issues

### If Behind Corporate Proxy
Edit `backend/.env` and add:
```env
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080
```

### If Using VPN
1. **Temporarily disable VPN**
2. Test if TMDB API works
3. If works: Configure VPN to allow api.themoviedb.org
4. Or use split tunneling to exclude TMDB domains

---

## 🔬 Diagnostic Commands

### Test DNS Resolution
```powershell
nslookup api.themoviedb.org
nslookup api.themoviedb.org 8.8.8.8
```

### Test Network Connectivity
```powershell
Test-NetConnection api.themoviedb.org -Port 443
```

### Check Firewall Rules
```powershell
netsh advfirewall firewall show rule name=all | Select-String "Node"
```

### Check Proxy Settings
```powershell
netsh winhttp show proxy
```

### Test with curl
```powershell
curl https://api.themoviedb.org/3/configuration?api_key=1728f401ea62e103e9c23cf044a944ef
```

---

## ✅ Verification Steps

After applying fixes:

1. **Run Network Test**
   ```bash
   node testNetwork.js
   ```

2. **Expected Output:**
   ```
   ✅ DNS Resolution successful
   ✅ HTTPS connection successful!
   ✅ TMDB API is reachable
   ✅ API Key is valid
   ```

3. **Start Backend**
   ```bash
   node server.js
   ```

4. **Look for:**
   ```
   ✅ Successfully fetched X popular movies
   ```

---

## 🆘 Still Not Working?

### Last Resort Options:

1. **Disable Windows Firewall Temporarily**
   - Open Windows Security
   - Turn off Firewall for Private network
   - Test if works
   - Re-enable after confirming

2. **Disable Antivirus Temporarily**
   - Disable for 5 minutes
   - Test connectivity
   - Re-enable after testing

3. **Use Mobile Hotspot**
   - Connect to phone's hotspot
   - Test if works
   - Confirms ISP/network restrictions

4. **Change DNS to Google DNS**
   - Open Network Settings
   - Change DNS to: `8.8.8.8` and `8.8.4.4`
   - Flush DNS cache
   - Test again

---

## 📞 Additional Help

If none of these work, the issue might be:
- **ISP blocking** TMDB domain
- **Corporate network policy** blocking external APIs
- **Region-specific restrictions**
- **Port 443 (HTTPS) blocked** at network level

Contact your network administrator if on corporate network.

---

## 🎯 Expected Results After Fix

**Backend logs should show:**
```
🎬 Fetching popular movies (page 1) from TMDB...
✅ Successfully fetched 20 popular movies
🎬 Fetching trending movies (week)...
✅ Successfully fetched 20 trending movies
```

**Frontend should display:**
```
🎬 Fetching movies from: http://localhost:8000
✅ API responses received: { personalized: 'fulfilled', ... }
📊 Movies loaded: { personalized: 20, mostSearched: 20, recent: 20 }
```

---

**Good luck! 🚀**
