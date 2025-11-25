import { API_BASE_URL } from '../config'
import { getCSRFHeader, CSRF_HEADER_NAME } from './csrf'
import { captureException, addBreadcrumb } from './sentry'
import { mockDestinations } from '../data/mockDestinations'

/**
 * API utility functions with error handling
 */

export class APIError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'APIError'
    this.status = status
  }
}

/**
 * Fetch wrapper with error handling and security
 */
export async function fetchAPI(endpoint, options = {}) {
  // Ensure endpoint starts with a slash
  if (!endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }

  const url = `${API_BASE_URL}${endpoint}`

  // Add timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

  try {
    // Add CSRF token to headers for state-changing requests
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add CSRF token for POST, PUT, DELETE requests
    if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
      Object.assign(headers, getCSRFHeader())
    }

    // Add breadcrumb for API call tracking
    addBreadcrumb(
      `${options.method || 'GET'} ${endpoint}`,
      'api',
      'info',
      { endpoint, method: options.method || 'GET' }
    )

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
      credentials: 'include', // Include cookies for CSRF
    })

    clearTimeout(timeoutId)

    // Handle non-JSON responses
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new APIError(
        text || `HTTP error! status: ${response.status}`,
        response.status
      )
    }

    if (!response.ok) {
      // Don't expose sensitive error details
      let errorMessage = 'An error occurred'

      if (response.status === 401) {
        errorMessage = 'Authentication required. Please login.'
      } else if (response.status === 403) {
        errorMessage = 'You do not have permission to perform this action.'
      } else if (response.status === 404) {
        errorMessage = 'Resource not found.'
      } else if (response.status === 429) {
        errorMessage = 'Too many requests. Please try again later.'
      } else if (response.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (data.error) {
        errorMessage = data.error
      }

      throw new APIError(errorMessage, response.status)
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      // Log to Sentry
      captureException(error, {
        endpoint,
        method: options.method || 'GET',
        url
      })
      throw error
    }

    // Network error or JSON parse error
    const networkError = new APIError(
      'Network error. Please check your connection and try again.',
      0
    )

    // Log to Sentry
    captureException(networkError, {
      endpoint,
      method: options.method || 'GET',
      url
    })

    throw networkError
  }
}

/**
 * Get destinations with filters
 */
export async function getDestinations(filter = 'global', value = '', limit = 20, activity = '') {
  // Return mock data for now to ensure UI works
  console.log('Using mock destinations data');

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...mockDestinations];

  if (value) {
    const lowerValue = value.toLowerCase();
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(lowerValue) ||
      d.country.toLowerCase().includes(lowerValue) ||
      d.continent.toLowerCase().includes(lowerValue)
    );
  }

  // Apply limit
  return {
    success: true,
    destinations: filtered.slice(0, limit),
    count: filtered.length
  };
}

/**
 * Get destination details by ID
 */
export async function getDestinationDetails(destinationId) {
  // Prevent making requests with undefined IDs
  if (!destinationId || destinationId === 'undefined' || destinationId === 'null') {
    throw new APIError('Invalid destination ID', 400)
  }

  console.log('Using mock destination details for:', destinationId);
  await new Promise(resolve => setTimeout(resolve, 300));

  const destination = mockDestinations.find(d => d.destination_id === destinationId || d.id === destinationId);

  if (destination) {
    return {
      success: true,
      destination: destination
    };
  }

  // Fallback to fetch if not found in mock (unlikely but good practice)
  return fetchAPI(`/destination/${destinationId}/details`)
}

/**
 * Subscribe user with validation
 */
export async function subscribe(email, preferences = {}) {
  // Validate email on client side
  if (!email || typeof email !== 'string') {
    throw new APIError('Email is required', 400)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new APIError('Please enter a valid email address', 400)
  }

  // Sanitize preferences
  const sanitizedPreferences = {
    continents: Array.isArray(preferences.continents)
      ? preferences.continents.filter(c => typeof c === 'string').slice(0, 10)
      : [],
    budget_tier: typeof preferences.budget_tier === 'string'
      ? preferences.budget_tier
      : null,
    travel_style: Array.isArray(preferences.travel_style)
      ? preferences.travel_style.filter(s => typeof s === 'string').slice(0, 10)
      : []
  }

  return fetchAPI('/subscribe', {
    method: 'POST',
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      preferences: sanitizedPreferences
    }),
  })
}

/**
 * Get personalized offers
 */
export async function getOffers(subscriberId = null, destinationId = null, budget = null) {
  let endpoint = '/offers?'
  const params = []

  if (subscriberId) params.push(`subscriber_id=${subscriberId}`)
  if (destinationId) params.push(`destination_id=${destinationId}`)
  if (budget) params.push(`budget=${budget}`)

  endpoint += params.join('&')

  return fetchAPI(endpoint)
}

/**
 * Favorites API functions
 */
export async function getFavorites(userId) {
  if (!userId) {
    throw new APIError('User ID is required', 400)
  }

  return fetchAPI(`/favorites?user_id=${userId}`)
}

export async function addFavorite(userId, destinationId) {
  if (!userId || !destinationId) {
    throw new APIError('User ID and Destination ID are required', 400)
  }

  return fetchAPI('/favorites', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, destination_id: destinationId })
  })
}

export async function removeFavorite(userId, favoriteId) {
  if (!userId || !favoriteId) {
    throw new APIError('User ID and Favorite ID are required', 400)
  }

  return fetchAPI(`/favorites/${favoriteId}?user_id=${userId}`, {
    method: 'DELETE'
  })
}

/**
 * Destination API object
 */
export const destinationApi = {
  getDestinations: async (filter = {}) => {
    console.log('Using mock destinations data (destinationApi)');
    await new Promise(resolve => setTimeout(resolve, 500));

    let filtered = [...mockDestinations];

    if (filter.limit) {
      filtered = filtered.slice(0, filter.limit);
    }

    return {
      success: true,
      destinations: filtered
    };
  },

  getDestinationDetails: async (id) => {
    return getDestinationDetails(id)
  }
}