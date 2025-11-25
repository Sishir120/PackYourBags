/**
 * CSRF Token Management
 */
import { secureStorage } from './security'

const CSRF_TOKEN_KEY = 'csrf_token'
const CSRF_HEADER_NAME = 'X-CSRF-Token'

/**
 * Generate or retrieve CSRF token
 */
export function getCSRFToken() {
  let token = secureStorage.get(CSRF_TOKEN_KEY)
  
  if (!token) {
    // Generate new token
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // Fallback for environments without crypto support
      token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
    secureStorage.set(CSRF_TOKEN_KEY, token)
  }
  
  return token
}

/**
 * Clear CSRF token
 */
export function clearCSRFToken() {
  secureStorage.remove(CSRF_TOKEN_KEY)
}

/**
 * Get CSRF header for API requests
 */
export function getCSRFHeader() {
  return {
    [CSRF_HEADER_NAME]: getCSRFToken()
  }
}

/**
 * Fetch CSRF token from server
 */
export async function fetchCSRFToken(apiBaseUrl) {
  try {
    const response = await fetch(`${apiBaseUrl}/csrf-token`, {
      method: 'GET',
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.csrf_token) {
        secureStorage.set(CSRF_TOKEN_KEY, data.csrf_token)
        return data.csrf_token
      }
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
    // Fall back to client-generated token
    return getCSRFToken()
  }
  
  return getCSRFToken()
}

export { CSRF_HEADER_NAME }

