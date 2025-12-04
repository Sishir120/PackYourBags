import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using mock data mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = () => Boolean(supabase)

export const subscription = {
  getStatus: async () => {
    // Mock subscription status
    return {
      success: true,
      subscription: {
        credits: 10,
        isPremium: false,
        isTravelPro: false
      }
    }
  }
}

export const auth = {
  signIn: async (email, password) => {
    if (!supabase) return { success: true, user: { email } } // Mock success
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  signUp: async (email, password, name) => {
    if (!supabase) return { success: true, user: { email, user_metadata: { name } } } // Mock success
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (error) throw error
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  signOut: async () => {
    if (!supabase) return { success: true }
    const { error } = await supabase.auth.signOut()
    if (error) return { success: false, error: error.message }
    return { success: true }
  }
}

export const userProfile = {
  getProfile: async () => {
    if (!supabase) {
      // Mock profile data
      return {
        success: true,
        profile: {
          name: 'Demo User',
          bio: 'Passionate traveler exploring the world one city at a time.',
          location: 'New York, USA',
          avatar_url: null,
          subscription_tier: 'free',
          ai_credits: 5,
          trips_count: 3,
          favorites_count: 12,
          xp: 1250,
          travel_style: 'Adventurer',
          preferences: {
            budget_tier: 'mid-range',
            continent: 'Europe'
          }
        }
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { success: false, error: 'No user logged in' }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return { success: true, profile: data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  updateProfile: async (updates) => {
    if (!supabase) {
      // Mock update
      return {
        success: true,
        profile: {
          name: updates.name || 'Demo User',
          bio: updates.bio || 'Passionate traveler exploring the world one city at a time.',
          location: updates.location || 'New York, USA',
          avatar_url: null,
          subscription_tier: 'free',
          ai_credits: 5,
          trips_count: 3,
          favorites_count: 12,
          xp: 1250,
          travel_style: 'Adventurer',
          preferences: updates.preferences || {}
        }
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { success: false, error: 'No user logged in' }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates })
        .select()
        .single()

      if (error) throw error
      return { success: true, profile: data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}