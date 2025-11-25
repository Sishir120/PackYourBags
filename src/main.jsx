import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import './components/lightswind.css'
import { initSentry } from './utils/sentry'
import { initStorageMigration } from './utils/migrateStorage'
import { fetchCSRFToken } from './utils/csrf'
import { API_BASE_URL } from './config'

// Initialize Sentry error tracking
initSentry()

// Migrate old storage to encrypted format
initStorageMigration()

// Fetch CSRF token on app load
// fetchCSRFToken(API_BASE_URL).catch(err => {
//   console.warn('Failed to fetch CSRF token:', err)
// })

// Add error boundary for better error handling
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error)
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })
}

// Check if required DOM elements exist before rendering
if (typeof document !== 'undefined' && document.getElementById('root')) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </React.StrictMode>,
  )
}

// Register service worker for PWA
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  if (window.addEventListener) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { })
    })
  }
}