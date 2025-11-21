# DivideCross Backend

A robust Node.js backend for the DivideCross movie streaming platform with JWT authentication, OTP verification, payment integration, and TMDB API.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Running the Server](#running-the-server)
- [Testing](#testing)
- [Deployment](#deployment)

## Features

### Authentication & Security
- JWT-based authentication with access and refresh tokens
- OTP-based email verification for registration
- Password reset with OTP verification
- Secure password hashing with bcryptjs
- Protected routes with middleware

### Email System
- Brevo SMTP integration for transactional emails
- Beautiful HTML email templates
- OTP delivery for registration and password reset
- Support ticket email notifications
- Configurable sender email

### Payment Integration
- Razorpay payment gateway integration
- Subscription plans management
- Movie purchase system
- Transaction history tracking
- Webhook support for payment verification

### Movie System
- TMDB API integration with direct fetching
- HTTP fallback for network resilience
- Extended timeout (30s) and retry logic (5 attempts)
- Popular, trending, top-rated, and upcoming movies
- Movie search and details
- User watchlist and history
- Movie recommendations

### Admin Features
- Admin authentication and authorization
- Subscription plan management
- User management
- Support ticket management
- Transaction monitoring

### Support System
- User support tickets
- Email notifications
- Status tracking (open, in-progress, resolved)
- Admin responses

## Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Email**: Nodemailer with Brevo SMTP
- **Payment**: Razorpay
- **External API**: TMDB (The Movie Database)
- **Security**: bcryptjs, CORS
- **Development**: Nodemon

## Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account or local MongoDB
- Brevo account for SMTP (free tier available)
- TMDB API key (free from https://www.themoviedb.org/settings/api)
- Razorpay account (for payments)

## Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables** (see below)

## Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB_NAME=dividecross

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_ACCESS_EXPIRES=15m
JWT_EXPIRES_IN=7d

# Brevo Email Configuration
BREVO_EMAIL=your-smtp-login@smtp-brevo.com
BREVO_SMTP_KEY=your-brevo-smtp-api-key
SENDER_EMAIL=your-verified-email@domain.com

# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Admin Credentials
ADMIN_EMAIL=admin@dividecross.com
ADMIN_PASSWORD=your_secure_admin_password

# Server Configuration
PORT=8000
NODE_ENV=development
HOST=0.0.0.0

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Getting API Keys

**Brevo SMTP:**
1. Sign up at https://app.brevo.com
2. Go to Settings → SMTP & API
3. Generate SMTP key
4. Use the SMTP login email (format: xxxxxxx@smtp-brevo.com)
5. Add your verified sender email to SENDER_EMAIL

**TMDB API:**
1. Sign up at https://www.themoviedb.org
2. Go to Settings → API
3. Request API key (free)
4. Copy API key to TMDB_API_KEY

**Razorpay:**
1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Generate test/live keys
4. Copy Key ID and Secret

## Database Models

### User Model
- name, email, password
- isVerified, role (user/admin)
- Timestamps

### Subscription Plan Model
- name, price, duration
- features array
- isActive

### User Subscription Model
- User reference
- Plan reference
- Start and end dates
- Status (active/expired/cancelled)

### Movie Purchase Model
- User and movie references
- Purchase amount
- Purchase date

### Transaction Model
- User reference
- Amount, type, status
- Razorpay IDs
- Payment method

### Support Ticket Model
- User reference
- Subject, description
- Status, priority
- Admin response

## API Endpoints

### Authentication (`/api/auth`)
```
POST   /register              - Register new user (sends OTP)
POST   /verify-otp            - Verify email with OTP
POST   /login                 - Login user
POST   /request-reset-otp     - Request password reset OTP
POST   /verify-reset-otp      - Reset password with OTP
POST   /refresh-token         - Refresh access token
```

### OTP (`/api/otp`)
```
POST   /send                  - Send OTP for registration/reset
POST   /verify                - Verify OTP code
POST   /resend                - Resend OTP
```

### Users (`/api/users`)
```
GET    /profile               - Get user profile (protected)
PUT    /profile               - Update user profile (protected)
GET    /subscription          - Get user subscription (protected)
```

### Movies (`/api/movies`)
```
GET    /                      - Get all movies
GET    /:id                   - Get movie details
GET    /search                - Search movies
POST   /watchlist/add         - Add to watchlist (protected)
GET    /watchlist             - Get user watchlist (protected)
POST   /history/add           - Add to history (protected)
GET    /history               - Get watch history (protected)
```

### TMDB (`/api/tmdb`)
```
GET    /popular               - Get popular movies
GET    /trending/:timeWindow  - Get trending (day/week)
GET    /top-rated             - Get top rated movies
GET    /now-playing           - Get now playing movies
GET    /upcoming              - Get upcoming movies
GET    /movie/:id             - Get movie details
GET    /search                - Search movies
```

### Recommendations (`/api/recommendations`)
```
GET    /                      - Get personalized recommendations (protected)
```

### Payments (`/api/payments`)
```
POST   /create-order          - Create Razorpay order (protected)
POST   /verify-payment        - Verify payment (protected)
POST   /subscribe             - Subscribe to plan (protected)
POST   /purchase-movie        - Purchase single movie (protected)
GET    /transactions          - Get user transactions (protected)
```

### Support (`/api/support`)
```
POST   /tickets               - Create support ticket (protected)
GET    /tickets               - Get user tickets (protected)
GET    /tickets/:id           - Get ticket details (protected)
```

### Admin (`/api/admin`)
```
POST   /login                 - Admin login
GET    /users                 - Get all users (admin)
GET    /subscriptions         - Get all subscriptions (admin)
POST   /subscription-plans    - Create plan (admin)
PUT    /subscription-plans/:id - Update plan (admin)
GET    /support/tickets       - Get all tickets (admin)
PUT    /support/tickets/:id   - Update ticket (admin)
```

## Running the Server

### Development Mode
```bash
npm run dev
```
Server runs on http://localhost:8000 with auto-restart on file changes.

### Production Mode
```bash
npm start
```

### Test Email Configuration
```bash
node testEmail.js
```

### Create Admin User
```bash
node scripts/createAdmin.js
```

## Testing

### Thunder Client / Postman Collection

**Test Authentication Flow:**
1. Register user → Get OTP email
2. Verify OTP → User verified
3. Login → Get JWT token
4. Use token in Authorization header for protected routes

**Test Payment Flow:**
1. Get subscription plans
2. Create order → Get Razorpay order ID
3. Complete payment (use test card in Razorpay)
4. Verify payment → Subscription activated

### Sample Test Requests

**Register:**
```json
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Protected Route (add token):**
```
GET /api/users/profile
Headers:
Authorization: Bearer <your_jwt_token>
```

## Project Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── emailConfig.js        # Email verification
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── movieController.js    # Movie operations
│   ├── paymentController.js  # Payment handling
│   ├── supportController.js  # Support tickets
│   ├── userController.js     # User operations
│   └── adminController.js    # Admin operations
├── middlewares/
│   ├── auth.js               # JWT verification
│   ├── admin.js              # Admin check
│   └── subscriptionMiddleware.js
├── models/
│   ├── userModel.js
│   ├── subscriptionPlanModel.js
│   ├── userSubscriptionModel.js
│   ├── moviePurchaseModel.js
│   ├── transactionModel.js
│   └── supportTicketModel.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── movieRoutes.js
│   ├── tmdbRoutes.js
│   ├── paymentRoutes.js
│   ├── supportRoutes.js
│   └── adminRoutes.js
├── services/
│   ├── otpService.js         # OTP email sending
│   ├── tmdbService.js        # TMDB API integration
│   └── supportService.js     # Support emails
├── scripts/
│   ├── createAdmin.js        # Create admin user
│   └── seedSubscriptionPlans.js
├── .env                      # Environment variables
├── server.js                 # Main server file
└── package.json
```

## Deployment

### Render.com Deployment

1. **Create Web Service**
   - Connect GitHub repository
   - Select backend directory
   - Build command: `npm install`
   - Start command: `node server.js`

2. **Environment Variables**
   - Add all .env variables in Render dashboard
   - Set NODE_ENV=production
   - Update FRONTEND_URL with production URL

3. **Important Settings**
   - Region: Choose closest to MongoDB cluster
   - Instance: Free tier or paid
   - Auto-deploy: Enable

### Vercel Deployment

Create `vercel.json` in backend:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## Common Issues & Solutions

### Email not sending
- Verify BREVO_SMTP_KEY is correct
- Check SENDER_EMAIL is verified in Brevo dashboard
- Look for SMTP connection errors in logs

### TMDB timeout errors
- Service includes HTTP fallback
- Automatic retry with 5 attempts
- Check TMDB API key validity

### MongoDB connection fails
- Verify MONGO_URI format
- Check MongoDB Atlas IP whitelist (0.0.0.0/0 for development)
- Ensure database user has read/write permissions

### Payment verification fails
- Verify Razorpay key_id and key_secret
- Check webhook signature
- Test with Razorpay test mode first

### CORS errors
- Add frontend URL to allowedOrigins in server.js
- Update FRONTEND_URL in .env
- Check credentials: true in CORS config

## Security Best Practices

1. **Never commit .env file**
2. **Use strong JWT_SECRET** (minimum 32 characters)
3. **Enable MongoDB authentication**
4. **Use HTTPS in production**
5. **Rate limit API endpoints**
6. **Validate all inputs**
7. **Keep dependencies updated**

## Support

For issues or questions:
- Check API logs for errors
- Use testEmail.js to verify SMTP
- Test TMDB connection
- Review environment variables

## License

Private project for DivideCross Movies Platform.

---

Built with Node.js, Express, MongoDB, and modern web technologies.
