import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

// Context Providers
import { AuthProvider } from './context/AuthProvider'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { GameLimitProvider } from './context/GameLimitContext'

// Utils
import { initSentry } from './utils/sentry'
import { initStorageMigration } from './utils/migrateStorage'

// Initialize services
initSentry()
initStorageMigration()

// Add error boundary for better error handling
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error)
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })
}

// Register service worker for PWA
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  if (window.addEventListener) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered');

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'FORCE_RELOAD') {
              console.log('Force reloading...');
              setTimeout(() => window.location.reload(true), 1000);
            }
          });
        })
        .catch(error => console.error('SW registration failed:', error));
    })
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <GameLimitProvider>
              <App />
            </GameLimitProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)