import React from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import * as Sentry from '@sentry/react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
    // Bind the handleReset method
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error tracking service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
    
    // Send to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    })
  }

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We're sorry for the inconvenience. An unexpected error occurred.
              </p>
            </div>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono text-red-600 overflow-auto max-h-40">
                  <p className="font-semibold mb-2">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                aria-label="Go to homepage"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                Go Home
              </button>
              <button
                onClick={() => typeof window !== 'undefined' && window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                aria-label="Refresh page"
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                Refresh Page
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              If this problem persists, please{' '}
              <Link to="/about" className="text-blue-600 hover:text-blue-700 underline">
                contact support
              </Link>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary