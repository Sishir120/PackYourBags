/**
 * Utility helper functions
 */

/**
 * Format error message for display
 */
export function formatErrorMessage(error) {
  if (error.status === 404) {
    return 'Resource not found. Please try again.'
  }
  if (error.status === 500) {
    return 'Server error. Please try again later.'
  }
  if (error.status === 0) {
    return 'Network error. Please check your connection.'
  }
  return error.message || 'An unexpected error occurred'
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/**
 * Get random item from array
 */
export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * Format budget tier for display
 */
export function formatBudgetTier(tier) {
  const tiers = {
    'budget-friendly': 'Budget-Friendly',
    'mid-range': 'Mid-Range',
    'luxury': 'Luxury'
  }
  return tiers[tier] || tier
}

/**
 * Get continent emoji
 */
export function getContinentEmoji(continent) {
  const emojis = {
    'Asia': '🏔️',
    'Europe': '🏰',
    'Americas': '🌎',
    'Africa': '🦁',
    'Oceania': '🏝️'
  }
  return emojis[continent] || '🌍'
}

/**
 * Basic fetch wrapper
 */
export async function fetchAPI(endpoint, options = {}) {
  // For now, just mock the response since we don't have a backend API
  console.log(`Mocking API call to ${endpoint}`, options)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Operation successful (Mock)' })
    }, 500)
  })
}
