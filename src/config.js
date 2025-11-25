// API Configuration
// For Vercel deployment, API routes are at /api/*
export const API_BASE_URL = '/api'

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
