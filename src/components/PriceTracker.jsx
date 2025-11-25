import React, { useState, useEffect } from 'react'
import { Bell, TrendingDown, DollarSign, Clock, AlertTriangle, Sparkles, Zap, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PriceTracker = ({ user }) => {
  const [deals, setDeals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const navigate = useNavigate()

  // Fetch deals when user is available
  useEffect(() => {
    if (user) {
      fetchDeals()
    }
  }, [user])

  const fetchDeals = async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/price-tracker/deals?user_id=${user.id}`)
      const data = await response.json()
      
      if (data.success) {
        setDeals(data.deals)
      } else {
        setError(data.error || 'Failed to fetch deals')
      }
    } catch (err) {
      setError('Failed to connect to price tracking service')
      console.error('Error fetching deals:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToDeals = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/price-tracker/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsSubscribed(true)
        // Show notification or toast
      } else {
        setError(data.error || 'Failed to subscribe')
      }
    } catch (err) {
      setError('Failed to subscribe to deal alerts')
      console.error('Error subscribing:', err)
    }
  }

  const checkPrices = async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/price-tracker/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDeals(data.deals)
        // Show notification with number of deals found
      } else {
        setError(data.error || 'Failed to check prices')
      }
    } catch (err) {
      setError('Failed to check prices')
      console.error('Error checking prices:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const shareDeal = (deal) => {
    if (navigator.share) {
      navigator.share({
        title: `Travel Deal: ${deal.savings_percentage}% OFF`,
        text: `Check out this great deal for ${deal.destination_id}! Save ${deal.savings_percentage}% on ${deal.deal_type}.`,
        url: window.location.href
      }).catch(console.error)
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Deal link copied to clipboard!')
    }
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Price Tracker</h2>
          <Bell className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 mt-2">Sign in to track price drops on your travel plans</p>
        <button
          onClick={() => navigate('/price-tracker')}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          View Full Tracker
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Price Tracker</h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/price-tracker')}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            View All
          </button>
          
          <button
            onClick={checkPrices}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Check Now'}
          </button>
          
          {!isSubscribed && (
            <button
              onClick={subscribeToDeals}
              className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Get Alerts
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {deals.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Recent Deals</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {deals.slice(0, 3).map((deal, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-700 text-sm">
                        {deal.savings_percentage}% OFF
                      </span>
                      {deal.personalized_score && (
                        <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                          <Zap className="w-3 h-3" />
                          {deal.personalized_score}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium text-sm">{deal.deal_type}</p>
                    <p className="text-xs text-gray-500">
                      Save ${deal.savings}
                    </p>
                    {deal.ai_analysis && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-700">
                        <div className="flex items-center gap-1 mb-1">
                          <Sparkles className="w-3 h-3 text-blue-500" />
                          <span className="font-medium">AI Insight:</span>
                        </div>
                        <p className="line-clamp-2">{deal.ai_analysis.substring(0, 100)}...</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="font-semibold text-gray-900 text-sm">
                        ${deal.new_price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{deal.expires_in}h</span>
                    </div>
                    {deal.urgency_level === 'high' && (
                      <span className="inline-block mt-1 text-xs bg-red-100 text-red-800 px-1 rounded">Urgent</span>
                    )}
                    <button 
                      onClick={() => shareDeal(deal)}
                      className="mt-1 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Share deal"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {deals.length > 3 && (
            <button
              onClick={() => navigate('/price-tracker')}
              className="w-full py-2 text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all {deals.length} deals
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">No deals found yet</h3>
          <p className="text-gray-500 text-sm mb-3">
            We'll notify you when prices drop on your travel plans
          </p>
          <button
            onClick={() => navigate('/price-tracker')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
          >
            View Full Tracker
          </button>
        </div>
      )}
      
      {isSubscribed && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            ✅ You're subscribed to price alerts
          </p>
        </div>
      )}
    </div>
  )
}

export default PriceTracker