import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }

        getSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event)
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)

                // Handle specific events
                if (event === 'SIGNED_IN') {
                    console.log('User signed in:', session.user.email)
                }
                if (event === 'SIGNED_OUT') {
                    console.log('User signed out')
                }
                if (event === 'TOKEN_REFRESHED') {
                    console.log('Token refreshed successfully')
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // Get access token for API calls
    const getAccessToken = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        return session?.access_token
    }

    const value = {
        // Email/Password Auth
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),

        // OAuth
        signInWithGoogle: () => supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        }),
        signInWithFacebook: () => supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        }),

        // Password Reset
        resetPassword: (email) => supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        }),
        updatePassword: (newPassword) => supabase.auth.updateUser({
            password: newPassword
        }),

        // Token Management
        getAccessToken,

        // State
        user,
        session,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

