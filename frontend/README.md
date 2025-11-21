# DivideCross Frontend

A modern, responsive React frontend for the DivideCross movie streaming platform with beautiful UI, smooth animations, and seamless user experience.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Components](#components)
- [Pages](#pages)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Deployment](#deployment)

## Features

### User Experience
- Modern, responsive UI with Tailwind CSS
- Smooth animations with Framer Motion
- Instant page loads with React Router lazy loading
- Toast notifications for user feedback
- Loading states and error handling
- Mobile-first responsive design

### Authentication
- User registration with OTP verification
- Email/Password login
- Forgot password with OTP reset
- JWT token management
- Protected routes
- Auto-redirect based on auth state

### Movie Browsing
- Browse popular, trending, and top-rated movies
- Advanced search functionality
- Movie details with full information
- TMDB integration for latest content
- Responsive movie cards with hover effects
- Genre filtering

### User Features
- Personal profile management
- Subscription plans
- Payment integration (Razorpay)
- Watchlist management
- Watch history tracking
- Download management
- Personalized recommendations

### Navigation
- Dynamic sidebar with auth-aware visibility
- Active route highlighting
- Mobile-responsive menu
- Quick navigation shortcuts
- Search bar integration

## Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.21
- **Routing**: React Router DOM 7.0.1
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 11.15.0
- **HTTP Client**: Axios 1.7.9
- **Notifications**: React Toastify 11.0.2
- **Icons**: React Icons 5.4.0
- **State**: React Context API

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend API running (see backend README)

## Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
# Create .env file in frontend root
```

4. **Configure environment variables** (see below)

## Environment Variables

Create a `.env` file in the frontend directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Production API URL (for deployment)
# VITE_API_URL=https://your-backend-api.com
```

**Note:** Vite requires `VITE_` prefix for environment variables.

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── api/
│   │   └── axios.js          # Axios configuration
│   ├── components/
│   │   ├── FeaturedMovies.jsx
│   │   ├── Loader.jsx
│   │   ├── MovieCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   ├── SearchBar.jsx
│   │   └── Sidebar.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication state
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── Downloads.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── History.jsx
│   │   ├── Home.jsx
│   │   ├── LoginUser.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── OtpVerify.jsx
│   │   ├── Profile.jsx
│   │   ├── Recommendations.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── SubscriptionPlans.jsx
│   │   ├── Support.jsx
│   │   └── Watchlist.jsx
│   ├── utils/
│   │   └── axiosSetup.js     # Axios interceptors
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── .env                       # Environment variables
├── index.html                 # HTML template
├── package.json
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.cjs         # PostCSS configuration
├── vite.config.mjs            # Vite configuration
└── vercel.json                # Vercel deployment config
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts development server at http://localhost:5173

### Build
```bash
npm run build
```
Creates optimized production build in `dist/` directory

### Preview
```bash
npm run preview
```
Preview production build locally

### Lint
```bash
npm run lint
```
Run ESLint to check code quality

## Components

### Navbar
- Responsive navigation bar
- Logo and branding
- Mobile menu toggle
- Dynamic based on auth state
- Gradient background with glassmorphism

### Sidebar
- Collapsible side navigation
- Route-based active states
- User profile section
- Quick access to main features
- Animated open/close transitions
- Auth-aware visibility

### MovieCard
- Displays movie poster and info
- Hover effects with scale animation
- Rating display with icons
- Click to navigate to details
- Responsive design

### FeaturedMovies
- Horizontal scrollable movie list
- Category-based filtering
- Lazy loading support
- Smooth scroll behavior

### SearchBar
- Real-time search
- Debounced API calls
- Loading states
- Results dropdown
- Mobile-responsive

### Loader
- Centralized loading component
- Smooth spinner animation
- Used across pages

### Route Guards
- **ProtectedRoute**: Requires authentication
- **PublicRoute**: Redirects if authenticated

## Pages

### Public Pages

**LoginUser** (`/login`)
- Email/password authentication
- Form validation
- Toast notifications
- Redirect to home on success
- Animated background

**Register** (`/register`)
- User registration form
- OTP email sending
- Password strength validation
- Auto-redirect to OTP verification

**OtpVerify** (`/otp-verify`)
- 6-digit OTP input
- Resend OTP functionality
- Auto-redirect on success
- 5-minute expiry

**ForgotPassword** (`/forgot-password`)
- Email input for reset
- OTP sending
- Redirect to reset page

**ResetPassword** (`/reset-password`)
- OTP verification
- New password input
- Password confirmation
- Auto-redirect to login

### Protected Pages

**Home** (`/`)
- Featured movies sections
- Popular, Trending, Top Rated
- Personalized recommendations
- Quick access navigation

**MovieDetails** (`/movie/:id`)
- Full movie information
- Trailer integration
- Cast and crew
- Add to watchlist
- Purchase/Stream options

**Profile** (`/profile`)
- User information display
- Profile editing
- Subscription status
- Account settings

**Recommendations** (`/recommendations`)
- AI-powered suggestions
- Based on watch history
- Personalized content
- Similar movies

**SubscriptionPlans** (`/subscription`)
- Available plans display
- Feature comparison
- Razorpay payment integration
- Current plan status

**CheckoutPage** (`/checkout/:type/:id`)
- Payment processing
- Order summary
- Razorpay integration
- Success/failure handling

**Watchlist** (`/watchlist`)
- User's saved movies
- Remove from watchlist
- Quick play access

**History** (`/history`)
- Watch history tracking
- Recently watched
- Continue watching

**Downloads** (`/downloads`)
- Downloaded content
- Offline viewing
- Storage management

**Support** (`/support`)
- Contact form
- Support tickets
- FAQ section
- Email support

**About** (`/about`)
- Platform information
- Features overview
- Team information

## Routing

### Route Configuration
```jsx
<Routes>
  {/* Protected Routes */}
  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
  <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  
  {/* Public Routes */}
  <Route path="/login" element={<PublicRoute><LoginUser /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
  
  {/* Public Access */}
  <Route path="/support" element={<Support />} />
  
  {/* Fallback */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
```

### Lazy Loading
All pages use React.lazy() for code splitting:
```jsx
const Home = lazy(() => import("./pages/Home"));
```

### Suspense Wrapper
Loading fallback for lazy-loaded components:
```jsx
<Suspense fallback={<LoadingSpinner />}>
  <Routes>...</Routes>
</Suspense>
```

## State Management

### AuthContext
Manages authentication state globally:
```jsx
const { user, login, logout, isAuthenticated } = useContext(AuthContext);
```

**Features:**
- User state management
- Token storage in localStorage
- Auto-login on refresh
- Logout functionality
- Auth status checking

**Usage:**
```jsx
// Login
await login(token);

// Logout
logout();

// Check auth
if (isAuthenticated) {
  // User is logged in
}
```

## API Integration

### Axios Configuration (`src/api/axios.js`)
```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});
```

### Interceptors
**Request Interceptor:**
- Adds JWT token to headers
- Handles authentication

**Response Interceptor:**
- Global error handling
- Token refresh logic
- Network error messages

### API Calls Example
```javascript
// Login
await API.post('/api/auth/login', { email, password });

// Get movies
const response = await API.get('/api/tmdb/popular');

// Protected route
await API.get('/api/users/profile'); // Auto adds token
```

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom color palette
- Responsive breakpoints
- Dark theme optimized

### Custom Configuration (`tailwind.config.js`)
```javascript
theme: {
  extend: {
    colors: {
      cinebg: '#0a0a0a',
      primary: '#dc2626',
      secondary: '#f59e0b',
    }
  }
}
```

### Framer Motion Animations
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Common Patterns
- Gradient backgrounds
- Glassmorphism effects
- Hover animations
- Loading skeletons
- Toast notifications

## Toast Notifications

### Configuration
```jsx
<ToastContainer 
  position="top-right" 
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>
```

### Usage
```javascript
import { toast } from 'react-toastify';

// Success
toast.success('Login successful!');

// Error
toast.error('Invalid credentials');

// Info
toast.info('Please verify your email');

// Warning
toast.warning('Session expiring soon');
```

## Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Environment Variables**
   - Add VITE_API_URL in Vercel dashboard
   - Set to production backend URL

4. **vercel.json Configuration**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Netlify Deployment

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Add VITE_API_URL

### Build Optimization

**Vite optimizations:**
- Code splitting
- Tree shaking
- Asset optimization
- Gzip compression

**Performance tips:**
- Use lazy loading
- Optimize images
- Minimize bundle size
- Use CDN for assets

## Responsive Design

### Breakpoints
- **sm**: 640px (Mobile)
- **md**: 768px (Tablet)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Large Desktop)

### Mobile-First Approach
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

1. **Code Splitting**: Lazy load components
2. **Image Optimization**: Use WebP format
3. **Caching**: Service worker for PWA
4. **Bundle Analysis**: Check bundle size
5. **Tree Shaking**: Remove unused code

## Common Issues & Solutions

### CORS Errors
- Verify VITE_API_URL is correct
- Check backend CORS configuration
- Ensure credentials: true in axios

### Build Fails
- Clear node_modules and reinstall
- Check Node.js version (18+)
- Verify all dependencies installed

### Routing Issues
- Ensure vercel.json for SPA routing
- Check route paths match exactly
- Verify lazy imports

### Toast Not Showing
- Import CSS: `import 'react-toastify/dist/ReactToastify.css'`
- Add ToastContainer in App.jsx

## Development Tips

1. **Use React DevTools** for debugging
2. **Check Network tab** for API errors
3. **Console errors** - address immediately
4. **Hot reload** works automatically
5. **Tailwind IntelliSense** - install VS Code extension

## Contributing

1. Follow component structure
2. Use TypeScript prop types
3. Write clean, readable code
4. Test responsiveness
5. Add proper error handling

## Support

For issues:
- Check browser console for errors
- Verify API connection
- Test with backend running
- Check environment variables

## License

Private project for DivideCross Movies Platform.

---

Built with React, Vite, Tailwind CSS, and modern web technologies.
