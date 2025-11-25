import { API_BASE_URL } from '../config'
import { secureStorage } from './security'
import { setSentryUser, captureException } from './sentry'

/**
 * Authentication API with secure storage
 */
export const authApi = {
  async register(email, password, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        const error = data.error || 'Registration failed'
        const errorMsg = new Error(error)
        errorMsg.status = response.status
        throw errorMsg
      }
      
      if (data.success) {
        // Use secure storage
        secureStorage.set('access_token', data.access_token)
        secureStorage.set('refresh_token', data.refresh_token)
        secureStorage.set('user', data.user)
        
        // Set user in Sentry
        setSentryUser(data.user)
      }
      return data
    } catch (error) {
      if (error.status) throw error
      const networkError = new Error('Network error. Please check your connection.')
      captureException(networkError, { action: 'register' })
      throw networkError
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        const error = data.error || 'Invalid email or password'
        const errorMsg = new Error(error)
        errorMsg.status = response.status
        throw errorMsg
      }
      
      if (data.success) {
        // Use secure storage
        secureStorage.set('access_token', data.access_token)
        secureStorage.set('refresh_token', data.refresh_token)
        secureStorage.set('user', data.user)
        
        // Set user in Sentry
        setSentryUser(data.user)
      }
      return data
    } catch (error) {
      if (error.status) throw error
      const networkError = new Error('Network error. Please check your connection.')
      captureException(networkError, { action: 'login' })
      throw networkError
    }
  },

  async getProfile() {
    try {
      const token = secureStorage.get('access_token')
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          this.logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error('Failed to get profile')
      }
      
      return response.json()
    } catch (error) {
      throw error
    }
  },

  async updateProfile(data) {
    try {
      const token = secureStorage.get('access_token')
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          this.logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error('Failed to update profile')
      }
      
      const result = await response.json()
      if (result.user) {
        secureStorage.set('user', result.user)
      }
      return result
    } catch (error) {
      throw error
    }
  },

  logout() {
    secureStorage.remove('access_token')
    secureStorage.remove('refresh_token')
    secureStorage.remove('user')
    
    // Clear Sentry user
    setSentryUser(null)
  },

  isAuthenticated() {
    const token = secureStorage.get('access_token')
    return !!token
  },

  getUser() {
    return secureStorage.get('user')
  },

  getToken() {
    return secureStorage.get('access_token')
  }
}

/**
 * Itinerary API
 */
export const itineraryApi = {
  async getAll() {
    try {
      const token = authApi.getToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/itineraries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authApi.logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error('Failed to fetch itineraries')
      }
      
      return response.json()
    } catch (error) {
      throw error
    }
  },

  async getOne(id) {
    try {
      const token = authApi.getToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authApi.logout()
          throw new Error('Session expired. Please login again.')
        }
        if (response.status === 404) {
          throw new Error('Itinerary not found')
        }
        throw new Error('Failed to fetch itinerary')
      }
      
      return response.json()
    } catch (error) {
      throw error
    }
  },

  async create(data) {
    try {
      const token = authApi.getToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/itineraries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authApi.logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error('Failed to create itinerary')
      }
      
      return response.json()
    } catch (error) {
      throw error
    }
  },

  async update(id, data) {
    try {
      const token = authApi.getToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authApi.logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error('Failed to update itinerary')
      }
      
      return response.json()
    } catch (error) {
      throw error
    }
  },

  async delete(id) {
    try {
      const token = authApi.getToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authApi.logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error('Failed to delete itinerary')
      }
      
      return response.json()
    } catch (error) {
      throw error
    }
  },

  async generateAI(destination_id, duration, preferences) {
    try {
      const token = authApi.getToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/itineraries/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ destination_id, duration, preferences })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authApi.logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error('Failed to generate itinerary')
      }
      
      return response.json()
    } catch (error) {
      throw error
    }
  }
}

/**
 * Personalization API
 */
export const personalizationApi = {
  async getRecommendations(limit = 10) {
    try {
      const token = authApi.getToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/personalization/recommendations?limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authApi.logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error('Failed to get recommendations')
      }
      
      return response.json()
    } catch (error) {
      throw error
    }
  },

  async getPersonalizedBlogs(limit = 6) {
    try {
      const token = authApi.getToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await fetch(`${API_BASE_URL}/personalization/blogs?limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authApi.logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error('Failed to get blogs')
      }
      
      return response.json()
    } catch (error) {
      throw error
    }
  },

  async trackInteraction(type, data) {
    try {
      const token = authApi.getToken()
      if (!token) return // Skip if not logged in
      
      await fetch(`${API_BASE_URL}/personalization/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, ...data })
      })
      // Don't throw on error - tracking is non-critical
    } catch (error) {
      // Silent fail - tracking is non-critical
      console.debug('Tracking error:', error)
    }
  }
}
