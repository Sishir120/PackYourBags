/**
 * Sentry Error Tracking Configuration
 */
import * as Sentry from '@sentry/react'

/**
 * Initialize Sentry
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  const environment = import.meta.env.MODE || 'development'
  
  // Only initialize in production or if DSN is provided
  if (!dsn && environment === 'production') {
    console.warn('Sentry DSN not configured. Error tracking disabled.')
    return
  }
  
  if (!dsn) {
    // In development without DSN, Sentry is disabled
    return
  }
  
  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    // Session Replay
    replaysSessionSampleRate: environment === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    
    // Filter out sensitive data
    beforeSend(event, hint) {
      // Don't send events in development
      if (environment === 'development') {
        return null
      }
      
      // Remove sensitive information
      if (event.request) {
        // Remove passwords from request data
        if (event.request.data) {
          const data = event.request.data
          if (typeof data === 'object') {
            if (data.password) {
              data.password = '[REDACTED]'
            }
            if (data.email) {
              // Keep email but hash it for privacy
              data.email = data.email.replace(/(.{2}).*(@.*)/, '$1***$2')
            }
          }
        }
        
        // Remove authorization headers
        if (event.request.headers) {
          delete event.request.headers.Authorization
          delete event.request.headers['X-CSRF-Token']
        }
      }
      
      // Remove user data if sensitive
      if (event.user) {
        // Only keep user ID, remove other sensitive info
        event.user = {
          id: event.user.id
        }
      }
      
      return event
    },
  })
}

/**
 * Set user context for error tracking
 */
export function setSentryUser(user) {
  if (user) {
    Sentry.setUser({
      id: user.id?.toString(),
      email: user.email,
      username: user.name
    })
  } else {
    Sentry.setUser(null)
  }
}

/**
 * Capture exception
 */
export function captureException(error, context = {}) {
  Sentry.captureException(error, {
    contexts: {
      custom: context
    }
  })
}

/**
 * Capture message
 */
export function captureMessage(message, level = 'info') {
  Sentry.captureMessage(message, level)
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(message, category = 'default', level = 'info', data = {}) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data
  })
}

