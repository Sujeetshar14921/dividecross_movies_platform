# 🧪 NEW OTP API Testing Guide

## 📍 Base URL
```
http://localhost:8000/api
```

---

## 1️⃣ REGISTRATION FLOW

### Step 1: Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please verify your email using OTP.",
  "email": "john@example.com"
}
```

---

### Step 2: Send OTP for Registration
```http
POST /api/otp/send-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "purpose": "registration"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email successfully",
  "expiresIn": "5 minutes"
}
```

**Email Sent:** ✅ 6-digit OTP code via Brevo

---

### Step 3: Verify OTP
```http
POST /api/otp/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "purpose": "registration"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully",
  "verified": true
}
```

---

### Step 4: Complete Registration
```http
POST /api/auth/complete-registration
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Email verified successfully!"
}
```

---

### Step 5: Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2️⃣ PASSWORD RESET FLOW

### Step 1: Request Password Reset OTP
```http
POST /api/otp/send-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "purpose": "password-reset"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email successfully",
  "expiresIn": "5 minutes"
}
```

---

### Step 2: Verify Password Reset OTP
```http
POST /api/otp/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "654321",
  "purpose": "password-reset"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully",
  "verified": true
}
```

---

### Step 3: Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "newPassword": "NewSecurePass456"
}
```

**Response:**
```json
{
  "message": "Password reset successfully!"
}
```

---

## 🔧 ERROR RESPONSES

### Invalid OTP
```json
{
  "message": "Invalid OTP"
}
```

### Expired OTP
```json
{
  "message": "OTP expired"
}
```

### OTP Purpose Mismatch
```json
{
  "message": "OTP purpose mismatch"
}
```

### User Already Exists
```json
{
  "message": "User already exists"
}
```

### User Not Found
```json
{
  "message": "User not found"
}
```

### Missing Fields
```json
{
  "message": "Email and purpose are required"
}
```

---

## 📝 NOTES

### OTP Storage
- ✅ **In-Memory** (Map-based)
- ✅ **Expires in 5 minutes**
- ✅ **Auto-deleted after verification**
- ✅ **Purpose-based validation**

### Email Service
- ✅ **Brevo SMTP** (smtp-relay.brevo.com:587)
- ✅ **Professional HTML templates**
- ✅ **Plain text fallback**

### Security
- ✅ **6-digit OTP** (100000-999999)
- ✅ **Purpose validation** (prevents reuse)
- ✅ **Time-based expiry** (5 minutes)
- ✅ **Single-use OTP** (deleted after verification)

---

## 🧪 Postman Collection

```json
{
  "info": {
    "name": "CineVerse OTP API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Register",
      "request": {
        "method": "POST",
        "url": "http://localhost:8000/api/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123\"\n}"
        }
      }
    },
    {
      "name": "2. Send OTP",
      "request": {
        "method": "POST",
        "url": "http://localhost:8000/api/otp/send-otp",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\",\n  \"purpose\": \"registration\"\n}"
        }
      }
    },
    {
      "name": "3. Verify OTP",
      "request": {
        "method": "POST",
        "url": "http://localhost:8000/api/otp/verify-otp",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\",\n  \"otp\": \"123456\",\n  \"purpose\": \"registration\"\n}"
        }
      }
    },
    {
      "name": "4. Complete Registration",
      "request": {
        "method": "POST",
        "url": "http://localhost:8000/api/auth/complete-registration",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\"\n}"
        }
      }
    },
    {
      "name": "5. Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:8000/api/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123\"\n}"
        }
      }
    }
  ]
}
```

---

**✅ Ready to Test!**

1. Start backend: `node server.js`
2. Add Brevo credentials to `.env`
3. Test registration flow
4. Test password reset flow
