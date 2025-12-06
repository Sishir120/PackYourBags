import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { Loader, AlertCircle, CheckCircle } from 'lucide-react'

const AuthCallback = () => {
    const navigate = useNavigate()
    const [status, setStatus] = useState('processing') // processing, success, error
    const [message, setMessage] = useState('Completing sign in...')

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Check for hash parameters (OAuth fragment-based flow)
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')

                if (accessToken) {
                    // Set session from hash tokens
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    })

                    if (error) throw error

                    setStatus('success')
                    setMessage('Successfully signed in! Redirecting...')
                    setTimeout(() => navigate('/'), 1500)
                    return
                }

                // Otherwise check session (for code-based flow)
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    throw new Error(error.message || 'Authentication failed')
                }

                if (session) {
                    console.log('OAuth login successful:', session.user.email)
                    setStatus('success')
                    setMessage('Successfully signed in! Redirecting...')
                    setTimeout(() => navigate('/'), 1500)
                } else {
                    throw new Error('No session found after authentication')
                }
            } catch (err) {
                console.error('Callback handling error:', err)
                setStatus('error')
                setMessage(err.message || 'Authentication failed')
                setTimeout(() => navigate('/?auth_error=callback_failed'), 3000)
            }
        }

        handleCallback()

        // Timeout after 10 seconds
        const timeout = setTimeout(() => {
            if (status === 'processing') {
                setStatus('error')
                setMessage('Authentication timed out')
                setTimeout(() => navigate('/?auth_error=timeout'), 2000)
            }
        }, 10000)

        return () => clearTimeout(timeout)
    }, [navigate])

    const getIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-12 h-12 text-green-600 animate-bounce" />
            case 'error':
                return <AlertCircle className="w-12 h-12 text-red-600" />
            default:
                return <Loader className="w-12 h-12 text-primary-600 animate-spin" />
        }
    }

    const getBgColor = () => {
        switch (status) {
            case 'success':
                return 'from-green-50 to-emerald-50'
            case 'error':
                return 'from-red-50 to-orange-50'
            default:
                return 'from-blue-50 to-indigo-50'
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${getBgColor()}`}>
            <div className="text-center max-w-md px-4">
                <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
                    {getIcon()}
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">{message}</h2>
                <p className="text-neutral-600">
                    {status === 'processing' && 'Please wait while we verify your credentials'}
                    {status === 'success' && 'Taking you to your dashboard...'}
                    {status === 'error' && 'Redirecting you back to the home page...'}
                </p>
            </div>
        </div>
    )
}

export default AuthCallback
