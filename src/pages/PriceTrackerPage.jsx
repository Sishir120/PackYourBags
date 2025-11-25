import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, TrendingDown, DollarSign, Clock, Search, Filter, RefreshCw, AlertTriangle, CheckCircle, Sparkles, Lightbulb, Zap, AlertCircle, BarChart2, Share2, Heart } from 'lucide-react'
import { destinationApi } from '../utils/api'
import CurrencyTicker from '../components/CurrencyTicker'
import SEO from '../components/SEO'

const PriceTrackerPage = ({ user }) => {
  const [deals, setDeals] = useState([])
  const [selectedDeals, setSelectedDeals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [destinations, setDestinations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('personalized_score')
  const navigate = useNavigate()

  // Fetch deals when user is available
  useEffect(() => {
    if (user) {
      fetchDeals()
      fetchDestinations()
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

  const fetchDestinations = async () => {
    try {
      const data = await destinationApi.getDestinations({ limit: 50 })
      if (data.success && data.destinations) {
        setDestinations(data.destinations)
      }
    } catch (err) {
      console.error('Error fetching destinations:', err)
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

  const compareDeals = async () => {
    if (selectedDeals.length < 2) {
      alert('Please select at least 2 deals to compare')
      return
    }

    try {
      const response = await fetch('/api/price-tracker/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deal_ids: selectedDeals
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Deal comparison feature is ready for implementation')
      } else {
        setError(data.error || 'Failed to compare deals')
      }
    } catch (err) {
      setError('Failed to compare deals')
      console.error('Error comparing deals:', err)
    }
  }

  const toggleDealSelection = (dealId) => {
    setSelectedDeals(prev =>
      prev.includes(dealId)
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    )
  }

  const shareDeal = (deal) => {
    if (navigator.share) {
      navigator.share({
        title: `Travel Deal: ${deal.savings_percentage}% OFF`,
        text: `Check out this great deal for ${getDestinationName(deal.destination_id)}! Save ${deal.savings_percentage}% on ${deal.deal_type}.`,
        url: window.location.href
      }).catch(console.error)
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Deal link copied to clipboard!')
    }
  }

  const getDestinationName = (destinationId) => {
    const destination = destinations.find(d => d.destination_id === destinationId)
    return destination ? destination.name : 'Unknown Destination'
  }

  const filteredDeals = deals.filter(deal => {
    if (filter === 'all') return true
    if (filter === 'flights') return deal.deal_type.includes('Flight')
    if (filter === 'hotels') return deal.deal_type.includes('Hotel')
    if (filter === 'packages') return deal.deal_type.includes('Package')
    return true
  }).filter(deal => {
    if (!searchTerm) return true
    const destName = getDestinationName(deal.destination_id).toLowerCase()
    return destName.includes(searchTerm.toLowerCase())
  }).sort((a, b) => {
    if (sortBy === 'personalized_score') return b.personalized_score - a.personalized_score
    if (sortBy === 'score') return b.score - a.score
    if (sortBy === 'savings') return b.savings - a.savings
    if (sortBy === 'percentage') return b.savings_percentage - a.savings_percentage
    if (sortBy === 'price') return a.new_price - b.new_price
    if (sortBy === 'confidence') return b.confidence_score - a.confidence_score
    return new Date(b.timestamp) - new Date(a.timestamp)
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <SEO
        title="Flight Price Tracker & Deal Alerts"
        description="Track flight prices, get deal alerts, and save money on your next trip. Real-time currency exchange rates included."
        keywords="cheap flights, flight price tracker, travel deals, price drop alerts, budget travel, currency exchange"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Currency Ticker */}
        <CurrencyTicker />

        {!user ? (
          <div className="max-w-4xl mx-auto py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Price Tracker</h1>
              <p className="text-gray-600 mb-6">Sign in to track price drops on your travel plans and get exclusive deals</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Price Tracker</h1>
                  <p className="text-gray-600 mt-1">Monitor price drops and get exclusive travel deals</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={checkPrices}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Checking...' : 'Check Now'}</span>
                  </button>

                  {!isSubscribed && (
                    <button
                      onClick={subscribeToDeals}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Get Alerts</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">{deals.length}</div>
                  <div className="text-sm text-gray-500">Active Deals</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {deals.reduce((sum, deal) => sum + deal.savings, 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Savings ($)</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {deals.length > 0 ? Math.max(...deals.map(d => d.savings_percentage)) : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Best Discount</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    {deals.filter(d => d.urgency_level === 'high').length}
                  </div>
                  <div className="text-sm text-gray-500">Urgent Deals</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">
                    {selectedDeals.length}
                  </div>
                  <div className="text-sm text-gray-500">Selected for Compare</div>
                </div>
              </div>

              {/* Action Bar */}
              {selectedDeals.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-800 font-medium">
                      {selectedDeals.length} deal{selectedDeals.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={compareDeals}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Compare Deals
                    </button>
                    <button
                      onClick={() => setSelectedDeals([])}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search destinations..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Deals</option>
                      <option value="flights">Flights</option>
                      <option value="hotels">Hotels</option>
                      <option value="packages">Packages</option>
                    </select>

                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="personalized_score">Sort by Personalized Score</option>
                      <option value="score">Sort by Score</option>
                      <option value="savings">Sort by Savings</option>
                      <option value="percentage">Sort by % Off</option>
                      <option value="price">Sort by Price</option>
                      <option value="confidence">Sort by Confidence</option>
                      <option value="date">Sort by Date</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Subscription Status */}
              {isSubscribed && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-green-700">
                      You're subscribed to price alerts. We'll notify you when deals become available.
                    </p>
                  </div>
                </div>
              )}

              {/* Deals List */}
              {isLoading ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Checking for the best deals...</p>
                  </div>
                </div>
              ) : filteredDeals.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredDeals.map((deal, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative">
                      {/* Selection Checkbox */}
                      <div className="absolute top-4 right-4">
                        <input
                          type="checkbox"
                          checked={selectedDeals.includes(deal.itinerary_id)}
                          onChange={() => toggleDealSelection(deal.itinerary_id)}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">
                            {deal.savings_percentage}% OFF
                          </span>
                          <span className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            <Zap className="w-3 h-3" />
                            {deal.personalized_score || deal.score}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Expires in {deal.expires_in}h</span>
                          </div>
                          {deal.urgency_level === 'high' ? (
                            <span className="inline-flex items-center gap-1 mt-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" />
                              Urgent
                            </span>
                          ) : deal.urgency_level === 'medium' ? (
                            <span className="inline-flex items-center gap-1 mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" />
                              Medium
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" />
                              Low
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{deal.deal_type}</h3>
                        <p className="text-gray-600">
                          Save ${deal.savings} on your {deal.provider} booking for {getDestinationName(deal.destination_id)}
                        </p>
                        {deal.preference_multiplier && deal.preference_multiplier !== 1.0 && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                            <Heart className="w-3 h-3" />
                            <span>Personalized for you (x{deal.preference_multiplier.toFixed(2)})</span>
                          </div>
                        )}
                      </div>

                      {/* AI Analysis Sections */}
                      {deal.ai_analysis && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold text-blue-800 text-sm">Deal Analysis</h4>
                          </div>
                          <p className="text-sm text-gray-700">{deal.ai_analysis}</p>
                        </div>
                      )}

                      {deal.ai_booking_urgency && (
                        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <h4 className="font-semibold text-purple-800 text-sm">Booking Recommendation</h4>
                          </div>
                          <p className="text-sm text-gray-700">{deal.ai_booking_urgency}</p>
                        </div>
                      )}

                      {deal.ai_maximization_tips && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-green-600" />
                            <h4 className="font-semibold text-green-800 text-sm">Maximization Tips</h4>
                          </div>
                          <p className="text-sm text-gray-700">{deal.ai_maximization_tips}</p>
                        </div>
                      )}

                      {/* Confidence Score */}
                      {deal.confidence_score && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart2 className="w-4 h-4 text-gray-600" />
                            <h4 className="font-semibold text-gray-800 text-sm">Deal Confidence</h4>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${deal.confidence_score * 10}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Confidence Score: {deal.confidence_score}/10</p>
                        </div>
                      )}

                      {/* AI Recommendations */}
                      {deal.ai_recommendations && deal.ai_recommendations.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <h4 className="font-semibold text-gray-900 text-sm">Recommendations</h4>
                          </div>
                          <div className="space-y-2">
                            {deal.ai_recommendations.map((rec, recIndex) => (
                              <div key={recIndex} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                                  <p className="text-xs text-gray-600">{rec.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900 line-through text-sm">
                              ${deal.original_price}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-700 text-lg">
                              ${deal.new_price}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => shareDeal(deal)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Share deal"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We'll notify you when prices drop on your travel plans. Check back later or manually check for deals.
                  </p>
                  <button
                    onClick={checkPrices}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Check for Deals Now
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PriceTrackerPage