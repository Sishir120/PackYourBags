// API Configuration - Works with or without proxy
const isDevelopment = import.meta.env.DEV
const API_URL = import.meta.env.VITE_API_BASE_URL || 
                (isDevelopment ? 'http://localhost:5000/api' : '/api')

export const API_BASE_URL = API_URL

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
