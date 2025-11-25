/**
 * Security utilities for input validation, sanitization, and secure storage
 */
import CryptoJS from 'crypto-js'

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Sanitize user input string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Validate and sanitize email
 */
export function validateAndSanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }
  
  const sanitized = sanitizeInput(email).toLowerCase()
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  if (!emailRegex.test(sanitized)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }
  
  if (sanitized.length > 254) {
    return { valid: false, error: 'Email address is too long' }
  }
  
  return { valid: true, sanitized }
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required', strength: 0 }
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters', strength: 1 }
  }
  
  if (password.length > 128) {
    return { valid: false, error: 'Password is too long', strength: 0 }
  }
  
  let strength = 0
  const checks = {
    length: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  
  strength = Object.values(checks).filter(Boolean).length
  
  let error = ''
  if (strength < 3) {
    error = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters.'
  }
  
  return {
    valid: strength >= 3,
    error,
    strength,
    checks
  }
}

/**
 * Validate name
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' }
  }
  
  const sanitized = sanitizeInput(name)
  
  if (sanitized.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  
  if (sanitized.length > 100) {
    return { valid: false, error: 'Name is too long' }
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(sanitized)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
  }
  
  return { valid: true, sanitized }
}

/**
 * Secure token storage with AES encryption using crypto-js
 */

// Generate encryption key from a master key (should be stored securely in production)
// In production, this should come from environment variables or a secure key management service
const getEncryptionKey = () => {
  // Use a combination of a master key and browser fingerprint for additional security
  const masterKey = import.meta.env.VITE_ENCRYPTION_KEY || 'packyourbags-secure-key-2024'
  // Check if window and screen are available (browser environment)
  if (typeof window !== 'undefined' && typeof screen !== 'undefined') {
    const browserFingerprint = navigator.userAgent + navigator.language + screen.width + screen.height
    return CryptoJS.SHA256(masterKey + browserFingerprint).toString()
  }
  // Fallback for non-browser environments
  return CryptoJS.SHA256(masterKey).toString()
}

export const secureStorage = {
  set(key, value) {
    try {
      const encryptionKey = getEncryptionKey()
      const dataString = JSON.stringify(value)
      
      // Encrypt using AES
      const encrypted = CryptoJS.AES.encrypt(dataString, encryptionKey).toString()
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, encrypted)
      }
      return true
    } catch (error) {
      console.error('Storage encryption error:', error)
      // Fallback to base64 if encryption fails (shouldn't happen in production)
      try {
        if (typeof localStorage !== 'undefined') {
          const encoded = btoa(JSON.stringify(value))
          localStorage.setItem(key, encoded)
        }
        return true
      } catch (fallbackError) {
        console.error('Storage fallback error:', fallbackError)
        return false
      }
    }
  },
  
  get(key) {
    try {
      if (typeof localStorage === 'undefined') return null
      const item = localStorage.getItem(key)
      if (!item) return null
      
      const encryptionKey = getEncryptionKey()
      
      // Try to decrypt (new encrypted format)
      try {
        const bytes = CryptoJS.AES.decrypt(item, encryptionKey)
        const decrypted = bytes.toString(CryptoJS.enc.Utf8)
        
        if (decrypted) {
          return JSON.parse(decrypted)
        }
      } catch (decryptError) {
        // Fallback: try base64 decoding (for old format)
        try {
          return JSON.parse(atob(item))
        } catch (base64Error) {
          console.error('Storage decryption error:', decryptError)
          return null
        }
      }
      
      return null
    } catch (error) {
      console.error('Storage read error:', error)
      return null
    }
  },
  
  remove(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key)
      }
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  },
  
  clear() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear()
      }
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  },
  
  // Migrate old base64-encoded data to encrypted format
  migrateToEncrypted(key) {
    try {
      if (typeof localStorage === 'undefined') return false
      const item = localStorage.getItem(key)
      if (!item) return false
      
      // Try to decrypt first (already encrypted)
      const encryptionKey = getEncryptionKey()
      try {
        const bytes = CryptoJS.AES.decrypt(item, encryptionKey)
        const decrypted = bytes.toString(CryptoJS.enc.Utf8)
        if (decrypted) {
          return true // Already encrypted
        }
      } catch (e) {
        // Not encrypted, migrate it
        try {
          const decoded = JSON.parse(atob(item))
          this.set(key, decoded)
          return true
        } catch (migrationError) {
          console.error('Migration error:', migrationError)
          return false
        }
      }
    } catch (error) {
      console.error('Migration error:', error)
      return false
    }
    return false
  }
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = new Map()
  }
  
  check(key) {
    const now = Date.now()
    const userRequests = this.requests.get(key) || []
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: validRequests[0] + this.windowMs }
    }
    
    validRequests.push(now)
    this.requests.set(key, validRequests)
    
    return {
      allowed: true,
      remaining: this.maxRequests - validRequests.length,
      resetAt: now + this.windowMs
    }
  }
  
  reset(key) {
    this.requests.delete(key)
  }
}

// Global rate limiter instances
export const apiRateLimiter = new RateLimiter(10, 60000) // 10 requests per minute
export const formRateLimiter = new RateLimiter(5, 60000) // 5 form submissions per minute

/**
 * Generate CSRF token
 */
export function generateCSRFToken() {
  if (typeof window !== 'undefined' && typeof crypto !== 'undefined') {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  // Fallback for non-browser environments
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token, storedToken) {
  return token && storedToken && token === storedToken
}

/**
 * Escape special characters for HTML
 */
export function escapeHTML(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

/**
 * Validate URL to prevent open redirect attacks
 */
export function validateURL(url, allowedDomains = []) {
  try {
    const urlObj = new URL(url)
    
    // Check if it's a relative URL (safe)
    if (!urlObj.protocol || urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      // Check against allowed domains
      if (allowedDomains.length > 0 && urlObj.hostname) {
        return allowedDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain))
      }
      return true
    }
    
    // Block javascript:, data:, etc.
    return false
  } catch {
    return false
  }
}

/**
 * Content Security Policy helper
 */
export const CSP = {
  nonce: generateCSRFToken(),
  
  getNonce() {
    return this.nonce
  },
  
  generateStyleNonce() {
    return generateCSRFToken()
  }
}