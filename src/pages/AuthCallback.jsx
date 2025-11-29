import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { Loader } from 'lucide-react'

const AuthCallback = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // Handle the OAuth callback
        const handleCallback = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Auth callback error:', error)
                    navigate('/?auth_error=auth_failed')
                    return
                }

                if (session) {
                    console.log('OAuth login successful:', session.user.email)
                    // Redirect to home or dashboard
                    navigate('/')
                } else {
                    // No session found, redirect to login
                    navigate('/?auth_error=no_session')
                }
            } catch (err) {
                console.error('Callback handling error:', err)
                navigate('/?auth_error=unknown')
            }
        }

        handleCallback()
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center">
                <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
                    <Loader className="w-12 h-12 text-primary-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Completing sign in...</h2>
                <p className="text-neutral-600">Please wait while we verify your credentials</p>
            </div>
        </div>
    )
}

export default AuthCallback
