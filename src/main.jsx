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
// Force UNREGISTER service worker to fix stale cache/port 3000 issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      console.log('Unregistering SW:', registration);
      registration.unregister();
    }
  });
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