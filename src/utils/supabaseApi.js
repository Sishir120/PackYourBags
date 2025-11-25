import { supabase } from './supabaseClient'

/**
 * Supabase API utility functions
 */

/**
 * Get destinations with filters
 */
export async function getDestinations(filter = 'global', value = '', limit = 20) {
  try {
    let query = supabase
      .from('destinations')
      .select('*')
      .limit(limit)

    // Add filtering logic as needed
    if (value) {
      query = query.ilike('name', `%${value}%`)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return { destinations: data, count: data.length }
  } catch (error) {
    console.error('Error fetching destinations:', error)
    throw error
  }
}

/**
 * Get destination details by ID
 */
export async function getDestinationDetails(destinationId) {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', destinationId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Error fetching destination details:', error)
    throw error
  }
}

/**
 * Subscribe user with validation
 */
export async function subscribe(email, preferences = {}) {
  // Validate email on client side
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required')
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address')
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
  
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([
        {
          email: email.toLowerCase().trim(),
          preferences: sanitizedPreferences,
          created_at: new Date()
        }
      ])
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, subscriber: data[0] }
  } catch (error) {
    console.error('Error subscribing user:', error)
    throw error
  }
}

/**
 * Get personalized offers
 */
export async function getOffers(subscriberId = null, destinationId = null, budget = null) {
  try {
    let query = supabase
      .from('offers')
      .select('*')

    if (subscriberId) {
      query = query.eq('subscriber_id', subscriberId)
    }
    
    if (destinationId) {
      query = query.eq('destination_id', destinationId)
    }
    
    if (budget) {
      query = query.eq('budget', budget)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Error fetching offers:', error)
    throw error
  }
}

/**
 * Destination API object
 */
export const destinationApi = {
  getDestinations: async (filter = {}) => {
    return getDestinations(filter.type, filter.value, filter.limit)
  },

  getDestinationDetails: async (id) => {
    return getDestinationDetails(id)
  }
}