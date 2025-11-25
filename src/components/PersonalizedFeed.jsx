import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { personalizationApi, authApi } from '../utils/authApi'
import DestinationCard from './DestinationCard'

const PersonalizedFeed = () => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authApi.isAuthenticated()) {
      loadRecommendations()
    } else {
      setLoading(false)
    }
  }, [])

  const loadRecommendations = async () => {
    try {
      const data = await personalizationApi.getRecommendations(6)
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations)
      } else {
        setRecommendations([])
      }
    } catch (err) {
      console.error('Error loading recommendations:', err)
      // Silent fail - component won't render if no recommendations
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  if (!authApi.isAuthenticated()) return null
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" aria-label="Loading recommendations" />
            <p className="text-gray-600">Loading your recommendations...</p>
          </div>
        </div>
      </section>
    )
  }

  if (recommendations.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ✨ Recommended For You
          </h2>
          <p className="text-xl text-gray-600">
            Based on your travel preferences and history
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((rec, index) => (
            <div key={rec.destination.destination_id || index} className="relative">
              <DestinationCard destination={rec.destination} />
              <div className="mt-2 text-sm text-green-600 font-medium">
                💡 {rec.reason}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/my-trips"
            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            View All Recommendations
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PersonalizedFeed
