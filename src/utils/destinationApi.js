import { supabase, isSupabaseConfigured } from './supabase'
import { mockDestinations } from '../data/mockDestinations'

/**
 * Hybrid Destination API
 * Uses Supabase when configured, falls back to mock data otherwise
 */

// Check if we're in Supabase mode
const USE_SUPABASE = isSupabaseConfigured()

if (USE_SUPABASE) {
    console.log('✅ Using Supabase for data')
} else {
    console.log('⚠️ Using mock data (Supabase not configured)')
}

/**
 * Get all destinations with optional filtering
 */
export const getDestinations = async (params = {}) => {
    if (USE_SUPABASE) {
        try {
            let query = supabase.from('destinations').select('*')

            // Apply filters
            if (params.limit) query = query.limit(params.limit)
            if (params.continent) query = query.eq('continent', params.continent)
            if (params.budget_tier) query = query.eq('budget_tier', params.budget_tier)
            if (params.search) {
                query = query.or(`name.ilike.%${params.search}%,country.ilike.%${params.search}%,description.ilike.%${params.search}%`)
            }

            // Sorting
            if (params.sortBy) {
                const order = params.sortOrder || 'asc'
                query = query.order(params.sortBy, { ascending: order === 'asc' })
            }

            const { data, error } = await query

            if (error) {
                console.error('Supabase error:', error)
                throw error
            }

            return {
                success: true,
                destinations: data || [],
                count: data?.length || 0
            }
        } catch (error) {
            console.error('Error fetching from Supabase:', error)
            // Fall back to mock data on error
            return getMockDestinations(params)
        }
    }

    // Mock data mode
    return getMockDestinations(params)
}

/**
 * Get destination details by ID
 */
export const getDestinationDetails = async (destinationId) => {
    if (!destinationId || destinationId === 'undefined' || destinationId === 'null') {
        return { success: false, error: 'Invalid destination ID' }
    }

    if (USE_SUPABASE) {
        try {
            const { data, error } = await supabase
                .from('destinations')
                .select('*')
                .eq('destination_id', destinationId)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return { success: false, error: 'Destination not found' }
                }
                throw error
            }

            return {
                success: true,
                destination: data
            }
        } catch (error) {
            console.error('Error fetching destination from Supabase:', error)
            // Fall back to mock data
            return getMockDestinationDetails(destinationId)
        }
    }

    // Mock data mode
    return getMockDestinationDetails(destinationId)
}

/**
 * Add destination to favorites (requires Supabase + auth)
 */
export const addFavorite = async (userId, destinationId) => {
    if (!USE_SUPABASE) {
        return {
            success: false,
            error: 'Favorites require Supabase. Please configure your environment variables.'
        }
    }

    try {
        const { data, error } = await supabase
            .from('favorites')
            .insert({
                user_id: userId,
                destination_id: destinationId
            })
            .select()
            .single()

        if (error) throw error

        return {
            success: true,
            favorite: data
        }
    } catch (error) {
        console.error('Error adding favorite:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Remove favorite
 */
export const removeFavorite = async (userId, favoriteId) => {
    if (!USE_SUPABASE) {
        return { success: false, error: 'Favorites require Supabase' }
    }

    try {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('id', favoriteId)
            .eq('user_id', userId)

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error removing favorite:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get user favorites
 */
export const getUserFavorites = async (userId) => {
    if (!USE_SUPABASE) {
        return { success: true, favorites: [] }
    }

    try {
        const { data, error } = await supabase
            .from('favorites')
            .select('*, destinations(*)')
            .eq('user_id', userId)

        if (error) throw error

        return {
            success: true,
            favorites: data || []
        }
    } catch (error) {
        console.error('Error fetching favorites:', error)
        return { success: false, error: error.message }
    }
}

// ========== MOCK DATA HELPERS ==========

function getMockDestinations(params = {}) {
    let filtered = [...mockDestinations]

    // Apply filters
    if (params.continent) {
        filtered = filtered.filter(d => d.continent === params.continent)
    }
    if (params.budget_tier) {
        filtered = filtered.filter(d => d.budget_tier === params.budget_tier)
    }
    if (params.search) {
        const searchLower = params.search.toLowerCase()
        filtered = filtered.filter(d =>
            d.name?.toLowerCase().includes(searchLower) ||
            d.country?.toLowerCase().includes(searchLower) ||
            d.description?.toLowerCase().includes(searchLower)
        )
    }

    // Apply sorting
    if (params.sortBy) {
        filtered.sort((a, b) => {
            const aVal = a[params.sortBy]
            const bVal = b[params.sortBy]
            const order = params.sortOrder === 'desc' ? -1 : 1

            if (typeof aVal === 'string') {
                return order * aVal.localeCompare(bVal)
            }
            return order * ((aVal || 0) - (bVal || 0))
        })
    }

    // Apply limit
    if (params.limit) {
        filtered = filtered.slice(0, params.limit)
    }

    return {
        success: true,
        destinations: filtered,
        count: filtered.length
    }
}

function getMockDestinationDetails(destinationId) {
    const destination = mockDestinations.find(
        d => d.destination_id === destinationId || d.id === destinationId
    )

    if (destination) {
        return {
            success: true,
            destination: destination
        }
    }

    return {
        success: false,
        error: 'Destination not found'
    }
}

// Export the API with a consistent interface
export const destinationApi = {
    getDestinations,
    getDestinationDetails,
    addFavorite,
    removeFavorite,
    getUserFavorites
}

// Default export for backwards compatibility
export default destinationApi
