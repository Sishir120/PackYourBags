// API Configuration
// Smart API URL: Use local backend in development, Vercel serverless in production
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:5000/api'  // Direct connection to local backend
  : '/api';  // Vercel serverless functions in production

console.log('🔧 API Mode:', isDevelopment ? 'LOCAL DEV' : 'PRODUCTION', '| API URL:', API_BASE_URL);

// App Configuration
export const APP_CONFIG = {
  name: 'PackYourBags',
  description: 'AI-Powered Travel Roulette',
  version: '1.0.0',
  features: {
    rouletteSpinDuration: { min: 3000, max: 5000 }, // 3-5 seconds
    maxDestinationsDisplay: 20,
  }
}

// Validation patterns
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}
