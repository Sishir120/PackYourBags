/**
 * Comprehensive form validation utilities
 */

/**
 * Real-time email validation
 */
export function validateEmailRealTime(email) {
  if (!email) {
    return { valid: false, message: '', error: null }
  }
  
  if (email.length > 254) {
    return { valid: false, message: 'Email is too long', error: 'maxLength' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address', error: 'format' }
  }
  
  // Check for common typos
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
  const domain = email.split('@')[1]
  if (domain) {
    const closeMatch = commonDomains.find(d => 
      domain.toLowerCase().includes(d.slice(0, 3)) && domain !== d
    )
    if (closeMatch) {
      return { valid: true, message: `Did you mean ${email.split('@')[0]}@${closeMatch}?`, warning: true }
    }
  }
  
  return { valid: true, message: '', error: null }
}

/**
 * Password strength calculator
 */
export function calculatePasswordStrength(password) {
  if (!password) return { strength: 0, feedback: [] }
  
  let strength = 0
  const feedback = []
  
  // Length check
  if (password.length >= 8) strength++
  else feedback.push('At least 8 characters')
  
  if (password.length >= 12) strength++
  
  // Character variety
  if (/[a-z]/.test(password)) strength++
  else feedback.push('Add lowercase letters')
  
  if (/[A-Z]/.test(password)) strength++
  else feedback.push('Add uppercase letters')
  
  if (/[0-9]/.test(password)) strength++
  else feedback.push('Add numbers')
  
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  else feedback.push('Add special characters')
  
  // Common password check
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123']
  if (commonPasswords.some(p => password.toLowerCase().includes(p))) {
    strength = Math.max(0, strength - 2)
    feedback.push('Avoid common passwords')
  }
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green', 'darkgreen']
  
  return {
    strength: Math.min(5, strength),
    label: labels[Math.min(5, strength)],
    color: colors[Math.min(5, strength)],
    feedback: feedback.length > 0 ? feedback : ['Great password!']
  }
}

/**
 * Validate form field in real-time
 */
export function validateField(name, value, rules = {}) {
  const errors = []
  let sanitized = value
  
  // Required check
  if (rules.required && (!value || value.trim().length === 0)) {
    errors.push(`${name} is required`)
    return { valid: false, errors, sanitized }
  }
  
  // Skip other validations if empty and not required
  if (!value || value.trim().length === 0) {
    return { valid: true, errors: [], sanitized }
  }
  
  // Sanitize
  if (rules.sanitize !== false) {
    sanitized = value.trim().replace(/[<>]/g, '')
  }
  
  // Min length
  if (rules.minLength && sanitized.length < rules.minLength) {
    errors.push(`${name} must be at least ${rules.minLength} characters`)
  }
  
  // Max length
  if (rules.maxLength && sanitized.length > rules.maxLength) {
    errors.push(`${name} must be no more than ${rules.maxLength} characters`)
  }
  
  // Pattern
  if (rules.pattern && !rules.pattern.test(sanitized)) {
    errors.push(rules.message || `${name} format is invalid`)
  }
  
  // Custom validator
  if (rules.validator && typeof rules.validator === 'function') {
    const customError = rules.validator(sanitized)
    if (customError) {
      errors.push(customError)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized
  }
}

/**
 * Form validation schema
 */
export const validationSchemas = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
    maxLength: 254
  },
  
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    validator: (value) => {
      if (value.length < 8) return 'Password must be at least 8 characters'
      if (!/[a-z]/.test(value)) return 'Password must contain lowercase letters'
      if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letters'
      if (!/[0-9]/.test(value)) return 'Password must contain numbers'
      return null
    }
  },
  
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
  },
  
  phone: {
    pattern: /^[\d\s\+\-\(\)]+$/,
    message: 'Please enter a valid phone number',
    maxLength: 20
  },
  
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL starting with http:// or https://'
  }
}

/**
 * Validate entire form
 */
export function validateForm(formData, schema) {
  const errors = {}
  const sanitized = {}
  let isValid = true
  
  for (const [field, value] of Object.entries(formData)) {
    const fieldSchema = schema[field]
    if (!fieldSchema) {
      sanitized[field] = value
      continue
    }
    
    const result = validateField(field, value, fieldSchema)
    sanitized[field] = result.sanitized
    
    if (!result.valid) {
      errors[field] = result.errors
      isValid = false
    }
  }
  
  return {
    valid: isValid,
    errors,
    sanitized
  }
}

/**
 * Debounced validation
 */
export function createDebouncedValidator(validator, delay = 300) {
  let timeout
  return (value, callback) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      const result = validator(value)
      callback(result)
    }, delay)
  }
}

