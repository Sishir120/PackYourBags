import React, { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config'

const AITravelPlanModal = ({ isOpen, onClose, destination }) => {
  const [travelPlan, setTravelPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && destination) {
      generateTravelPlan()
    }
  }, [isOpen, destination])

  const generateTravelPlan = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/ai/travel-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination_id: destination.destination_id,
          preferences: {
            duration: 5,
            budget: destination.budget_tier
          }
        })
      })

      const data = await response.json()

      if (data.success || data.plan) {
        setTravelPlan(data.plan || data.fallback)
      } else {
        setError(data.error || 'Failed to generate travel plan')
      }
    } catch (err) {
      // Error handled - user sees network error
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-green to-sky-blue text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                ✈️ AI Travel Plan
              </h2>
              <p className="text-lg opacity-90">
                {destination.name}, {destination.country}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-forest-green border-t-transparent mb-4"></div>
              <p className="text-gray-600 text-lg">Generating your personalized travel plan...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={generateTravelPlan}
                className="bg-forest-green text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Try Again
              </button>
            </div>
          ) : travelPlan ? (
            <div className="space-y-6">
              {/* Note if using mock data */}
              {travelPlan.note && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <p className="text-yellow-800">{travelPlan.note}</p>
                </div>
              )}

              {/* Itinerary */}
              <section>
                <h3 className="text-2xl font-bold text-deep-ocean mb-4">📅 5-Day Itinerary</h3>
                <div className="space-y-4">
                  {travelPlan.itinerary?.map((day) => (
                    <div key={day.day} className="bg-meadow-light rounded-lg p-4">
                      <h4 className="font-bold text-lg text-deep-ocean mb-2">
                        Day {day.day}: {day.title}
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {day.activities.map((activity, idx) => (
                          <li key={idx}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Budget */}
              <section>
                <h3 className="text-2xl font-bold text-deep-ocean mb-4">💰 Budget Breakdown</h3>
                <div className="bg-white border-2 border-forest-green rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(travelPlan.budget).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</p>
                        <p className="text-lg font-bold text-forest-green">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Must Visit */}
              <section>
                <h3 className="text-2xl font-bold text-deep-ocean mb-4">🎯 Must-Visit Spots</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {travelPlan.must_visit?.map((spot, idx) => (
                    <div key={idx} className="bg-sky-blue bg-opacity-10 rounded-lg p-4 text-center">
                      <p className="font-semibold text-deep-ocean">{spot}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tips */}
              <section>
                <h3 className="text-2xl font-bold text-deep-ocean mb-4">💡 Local Tips</h3>
                <ul className="space-y-2">
                  {travelPlan.tips?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sunset-accent">→</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Food */}
              <section>
                <h3 className="text-2xl font-bold text-deep-ocean mb-4">🍽️ Food Recommendations</h3>
                <ul className="space-y-2">
                  {travelPlan.food_recommendations?.map((food, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-forest-green">✓</span>
                      <span className="text-gray-700">{food}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 rounded-b-2xl flex justify-between items-center">
          <p className="text-sm text-gray-600">
            💡 Customize this plan by chatting with our AI assistant
          </p>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AITravelPlanModal
