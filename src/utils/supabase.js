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