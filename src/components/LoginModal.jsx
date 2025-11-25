import { useState, useEffect } from 'react'
import { authApi } from '../utils/authApi'
import { validateEmailRealTime, calculatePasswordStrength } from '../utils/validation'
import { validateAndSanitizeEmail, validatePassword, validateName, sanitizeInput } from '../utils/security'
import { formRateLimiter } from '../utils/security'
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

const LoginModal = ({ isOpen, onClose, onSuccess, initialState = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialState === 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [emailValidation, setEmailValidation] = useState({ valid: false, message: '' })
  const [passwordStrength, setPasswordStrength] = useState(null)

  // Set initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialState === 'login');
      // Reset fields
      setEmail('')
      setPassword('')
      setName('')
      setErrors({})
      setEmailValidation({ valid: false, message: '' })
      setPasswordStrength(null)
      setShowPassword(false)
    }
  }, [isOpen, initialState])

  // Real-time email validation
  useEffect(() => {
    if (email) {
      const validation = validateEmailRealTime(email)
      setEmailValidation(validation)
      if (errors.email && validation.valid) {
        setErrors(prev => ({ ...prev, email: '' }))
      }
    } else {
      setEmailValidation({ valid: false, message: '' })
    }
  }, [email])

  // Real-time password strength check
  useEffect(() => {
    if (password && !isLogin) {
      setPasswordStrength(calculatePasswordStrength(password))
    } else {
      setPasswordStrength(null)
    }
  }, [password, isLogin])

  const validateForm = () => {
    const newErrors = {}

    // Validate email
    const emailResult = validateAndSanitizeEmail(email)
    if (!emailResult.valid) {
      newErrors.email = emailResult.error
    }

    // Validate password
    const passwordResult = validatePassword(password)
    if (!passwordResult.valid) {
      newErrors.password = passwordResult.error
    }

    // Validate name for registration
    if (!isLogin) {
      const nameResult = validateName(name)
      if (!nameResult.valid) {
        newErrors.name = nameResult.error
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validate form
    if (!validateForm()) {
      return
    }

    // Rate limiting
    const rateLimit = formRateLimiter.check(isLogin ? 'login' : 'register')
    if (!rateLimit.allowed) {
      const secondsLeft = Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      setErrors({ 
        general: `Too many attempts. Please try again in ${secondsLeft} seconds.` 
      })
      return
    }

    setLoading(true)

    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email).toLowerCase()
      const sanitizedName = name ? sanitizeInput(name) : ''

      if (isLogin) {
        const data = await authApi.login(sanitizedEmail, password)
        if (data.success) {
          onSuccess(data.user)
          onClose()
        } else {
          setErrors({ general: data.error || 'Login failed. Please check your credentials.' })
        }
      } else {
        const data = await authApi.register(sanitizedEmail, password, sanitizedName)
        if (data.success) {
          onSuccess(data.user)
          onClose()
        } else {
          setErrors({ general: data.error || 'Registration failed. Please try again.' })
        }
      }
    } catch (err) {
      // Handle specific error types
      let errorMessage = 'An unexpected error occurred'
      
      if (err.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.message.includes('409') || err.message.includes('exists')) {
        errorMessage = 'An account with this email already exists. Please login instead.'
      } else if (err.message.includes('401') || err.message.includes('invalid')) {
        errorMessage = 'Invalid email or password. Please try again.'
      } else {
        errorMessage = err.message || errorMessage
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* General Error */}
          {errors.general && (
            <div 
              className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-start gap-2"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Name Field (Registration only) */}
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                required={!isLogin}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                autoComplete="name"
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10 ${
                  errors.email ? 'border-red-500' : emailValidation.valid ? 'border-green-500' : 'border-gray-300'
                }`}
                required
                aria-required="true"
                aria-invalid={!!errors.email || !emailValidation.valid}
                aria-describedby={errors.email ? 'email-error' : emailValidation.message ? 'email-hint' : undefined}
                autoComplete="email"
              />
              {emailValidation.valid && !errors.email && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" aria-hidden="true" />
              )}
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {errors.email}
              </p>
            )}
            {emailValidation.message && !errors.email && (
              <p id="email-hint" className={`mt-1 text-sm ${emailValidation.warning ? 'text-amber-600' : 'text-green-600'}`}>
                {emailValidation.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                minLength={8}
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : passwordStrength ? 'password-strength' : undefined}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {errors.password}
              </p>
            )}
            {passwordStrength && !isLogin && (
              <div id="password-strength" className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength.strength <= 1 ? 'bg-red-500' :
                        passwordStrength.strength <= 2 ? 'bg-orange-500' :
                        passwordStrength.strength <= 3 ? 'bg-yellow-500' :
                        passwordStrength.strength <= 4 ? 'bg-green-500' : 'bg-green-600'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                </div>
                {passwordStrength.strength < 3 && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {passwordStrength.feedback.map((tip, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="text-red-500">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email || !password || (!isLogin && !name)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            aria-label={loading ? 'Processing' : isLogin ? 'Login' : 'Sign up'}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>{isLogin ? 'Login' : 'Sign Up'}</span>
            )}
          </button>
        </form>

        {/* Toggle Login/Sign Up */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setErrors({})
              setEmailValidation({ valid: false, message: '' })
              setPasswordStrength(null)
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            aria-label={isLogin ? 'Switch to sign up' : 'Switch to login'}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
