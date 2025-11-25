import React, { useState } from 'react'
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { subscribe } from '../utils/api'
import { validateEmailRealTime } from '../utils/validation'
import { validateAndSanitizeEmail } from '../utils/security'
import { formRateLimiter } from '../utils/security'

const Subscription = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [focusedField, setFocusedField] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Real-time email validation
  const handleEmailChange = (value) => {
    setEmail(value)
    setErrorMessage('')
    
    if (value) {
      const validation = validateEmailRealTime(value)
      if (!validation.valid && validation.error) {
        setEmailError(validation.message)
      } else {
        setEmailError('')
      }
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setEmailError('')
    
    // Validate email
    const emailValidation = validateAndSanitizeEmail(email)
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error)
      setStatus('error')
      return
    }
    
    // Rate limiting check
    const rateLimit = formRateLimiter.check('subscription')
    if (!rateLimit.allowed) {
      const secondsLeft = Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      setErrorMessage(`Too many requests. Please try again in ${secondsLeft} seconds.`)
      setStatus('error')
      return
    }
    
    setStatus('loading')
    
    try {
      // Call actual API
      const data = await subscribe(emailValidation.sanitized, {})
      
      if (data.success) {
        setStatus('success')
        setEmail('')
        setEmailError('')
        
        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle')
        }, 5000)
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Subscription failed. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      if (error.status === 429) {
        setErrorMessage('Too many requests. Please wait a moment and try again.')
      } else if (error.status === 0) {
        setErrorMessage('Network error. Please check your connection and try again.')
      } else {
        setErrorMessage(error.message || 'Something went wrong. Please try again later.')
      }
    }
  }

  return (
    <section 
      id="subscribe" 
      className="relative py-28 overflow-hidden bg-white"
      aria-labelledby="subscription-heading"
    >
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(#4285F4 1px, transparent 1px), linear-gradient(90deg, #4285F4 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      {/* Colored Orbs */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-2.5 rounded-full mb-8 border border-blue-100">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-blue-700 text-sm font-medium">Stay Updated</span>
          </div>

          {/* Typography */}
          <h2 
            id="subscription-heading"
            className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4 tracking-tight"
          >
            Get travel inspiration
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 font-normal">
            Subscribe to our newsletter for exclusive deals, destination guides, and travel tips
          </p>

          {/* Form */}
          <div className="max-w-xl mx-auto">
            <form 
              onSubmit={handleSubmit} 
              className="relative"
              noValidate
              aria-label="Email subscription form"
            >
              {/* Input Container */}
              <div 
                className={`relative bg-white rounded-2xl border-2 transition-all duration-200 ${
                  focusedField 
                    ? 'border-blue-600 shadow-lg shadow-blue-100' 
                    : status === 'error' || emailError
                    ? 'border-red-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                role="group"
                aria-label="Email input"
              >
                <div className="flex items-center p-5">
                  {/* Icon */}
                  <div 
                    className={`flex-shrink-0 transition-colors ${
                      focusedField ? 'text-blue-600' : 'text-gray-400'
                    }`}
                    aria-hidden="true"
                  >
                    <Mail className="w-6 h-6" />
                  </div>

                  {/* Input */}
                  <label htmlFor="subscription-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="subscription-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onFocus={() => setFocusedField(true)}
                    onBlur={() => setFocusedField(false)}
                    disabled={status === 'loading' || status === 'success'}
                    className="flex-1 ml-4 text-gray-900 placeholder-gray-400 outline-none text-base font-normal disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    aria-required="true"
                    aria-invalid={status === 'error' || !!emailError}
                    aria-describedby={emailError || errorMessage ? 'email-error' : undefined}
                    autoComplete="email"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success' || !email}
                    className={`ml-4 px-7 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed ${
                      status === 'success'
                        ? 'bg-green-600 text-white'
                        : status === 'loading'
                        ? 'bg-blue-400 text-white cursor-wait'
                        : email
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    aria-label={status === 'loading' ? 'Subscribing' : status === 'success' ? 'Subscribed' : 'Subscribe to newsletter'}
                  >
                    {status === 'loading' && (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Subscribing...</span>
                      </>
                    )}
                    {status === 'success' && (
                      <>
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        <span>Subscribed!</span>
                      </>
                    )}
                    {(status === 'idle' || status === 'error') && (
                      <>
                        <span>Subscribe</span>
                        <Send className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>

                {/* Error Messages */}
                {(emailError || errorMessage) && (
                  <div 
                    id="email-error"
                    className="absolute -bottom-8 left-0 flex items-center gap-2 text-red-600 text-sm mt-2"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span>{emailError || errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Success Message */}
              {status === 'success' && (
                <div 
                  className="mt-4 flex items-center justify-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-xl border border-green-200"
                  role="alert"
                  aria-live="polite"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="font-medium">Thank you for subscribing! Check your email for confirmation.</span>
                </div>
              )}
            </form>

            {/* Privacy Text */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Your data is secure</span>
              </div>
              <span aria-hidden="true">•</span>
              <span>Unsubscribe anytime</span>
            </div>
          </div>

          {/* Stats Chips */}
          <div className="mt-16 flex flex-wrap justify-center gap-4" role="list">
            {[
              { value: '50,000+', label: 'Subscribers', color: 'blue' },
              { value: '4.9/5', label: 'Rating', color: 'green' },
              { value: '98%', label: 'Satisfaction', color: 'yellow' }
            ].map((stat, index) => (
              <div
                key={index}
                className="group px-6 py-3 bg-white rounded-full border-2 border-gray-100 hover:border-blue-200 transition-all duration-200 hover:shadow-md"
                role="listitem"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 bg-${stat.color}-600 rounded-full`} aria-hidden="true" />
                  <div className="text-left">
                    <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trusted By Section */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-medium">Trusted by travelers from</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-500" aria-label="Supported countries">
              {['🇺🇸 USA', '🇬🇧 UK', '🇩🇪 Germany', '🇫🇷 France', '🇯🇵 Japan', '🇦🇺 Australia'].map((country, i) => (
                <span key={i} className="text-2xl" role="img" aria-label={country.split(' ')[1]}>{country}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Subscription
