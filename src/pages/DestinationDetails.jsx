import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin,
  ChevronLeft,
  Heart,
  Share2,
  Bookmark,
  Clock,
  DollarSign,
  Calendar,
  ChevronRight,
  Globe,
  Ticket,
  Zap,
  Star
} from 'lucide-react'
import { destinationApi } from '../utils/destinationApi'
import Loading from '../components/Loading'
import ErrorBoundary from '../components/ErrorBoundary'
import DreamTicket from '../components/DreamTicket'
import StructuredData, { createTouristDestinationSchema, createFAQPageSchema } from '../components/StructuredData'
import { useSubscription } from '../context/SubscriptionContext'

const DestinationDetails = () => {
  const { id } = useParams()
  const [destination, setDestination] = useState(null)
  const [similarDestinations, setSimilarDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDreamTicket, setShowDreamTicket] = useState(false)
  const { setShowUpgradeModal } = useSubscription()

  useEffect(() => {
    fetchDestinationDetails()
  }, [id])

  const fetchDestinationDetails = async () => {
    // Prevent making requests with undefined IDs
    if (!id || id === 'undefined' || id === 'null') {
      setError('Invalid destination ID')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await destinationApi.getDestinationDetails(id)
      if (data.success && data.destination) {
        setDestination(data.destination)
        setSimilarDestinations(data.destination.similar_destinations || [])
      } else {
        setError('Destination not found')
      }
    } catch (err) {
      console.error('Error fetching destination details:', err)
      setError('Failed to load destination details. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Get images from destination data
  const images = (destination && destination.images && destination.images.length > 0)
    ? destination.images
    : [destination?.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90']

  const currentImage = images[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md">
          <div className="text-red-500 mb-4">
            <Globe className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDestinationDetails}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!destination) return null

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 overflow-hidden">
        {destination && <StructuredData data={createTouristDestinationSchema(destination)} />}
        {destination && destination.faqs && <StructuredData data={createFAQPageSchema(destination.faqs)} />}
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            to="/destinations"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Destinations</span>
          </Link>
        </div>

        {/* Hero Section with Image Gallery */}
        <div className="relative">
          <div className="h-96 overflow-hidden relative">
            <img
              src={currentImage}
              alt={destination.name}
              className="w-full h-full object-cover"
            />

            {/* Image Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                    ></div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Header Content */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {destination.name}
                  </h1>
                  <p className="text-xl text-white/90 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {destination.country}, {destination.continent}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDreamTicket(true)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors flex items-center gap-2 font-bold border border-white/30"
                  >
                    <Ticket className="w-5 h-5" />
                    <span className="hidden sm:inline">Dream Ticket</span>
                  </button>
                  <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                  <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Overview */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
                <div className="prose max-w-none">
                  {destination.description ? (
                    <div dangerouslySetInnerHTML={{ __html: destination.description }} />
                  ) : (
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Discover the beauty of {destination.name}, a stunning destination in {destination.country}.
                      With its unique attractions and rich culture, {destination.name} offers an unforgettable travel experience.
                    </p>
                  )}
                </div>
              </section>

              {/* Highlights */}
              {destination.highlights && destination.highlights.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Highlights</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {destination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <p className="text-gray-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Quick Facts */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Facts</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-6 h-6 text-blue-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Best Time to Visit</h3>
                    </div>
                    <p className="text-gray-600">{destination.best_season}</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <DollarSign className="w-6 h-6 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Budget Tier</h3>
                    </div>
                    <p className="text-gray-600 capitalize">{destination.budget_tier}</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-6 h-6 text-purple-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Continent</h3>
                    </div>
                    <p className="text-gray-600">{destination.continent}</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-6 h-6 text-orange-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Country</h3>
                    </div>
                    <p className="text-gray-600">{destination.country}</p>
                  </div>
                </div>
              </section>

              {/* Local Tips */}
              {destination.local_tips && destination.local_tips.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Local Tips</h2>
                  <div className="space-y-4">
                    {destination.local_tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Where to Stay */}
              {destination.accommodations && destination.accommodations.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Where to Stay</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {destination.accommodations.map((hotel, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group hover:shadow-md transition-shadow">
                        <div className="h-40 overflow-hidden relative">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900">
                            {hotel.type}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 line-clamp-1">{hotel.name}</h3>
                            <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                              <Star className="w-3 h-3 fill-current" />
                              {hotel.rating}
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm mb-4">{hotel.price}</p>
                          <button className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors text-sm">
                            Check Availability
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Sample Itinerary */}
              {destination.itinerary && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Perfect {destination.itinerary.duration} Itinerary</h2>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-6 bg-blue-50 border-b border-blue-100">
                      <p className="text-blue-800 font-medium">{destination.itinerary.description}</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {destination.itinerary.days.map((day, index) => (
                        <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-16 text-center">
                              <span className="block text-sm font-bold text-gray-500 uppercase tracking-wider">Day</span>
                              <span className="block text-2xl font-bold text-blue-600">{day.day}</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-2">{day.title}</h4>
                              <p className="text-gray-600">{day.activities}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* FAQ Section */}
              {destination.faqs && destination.faqs.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {destination.faqs.map((faq, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Travel Guide Blog */}
              <section className="mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Complete Travel Guide
                      </h2>
                      <p className="text-gray-600">
                        Everything you need to know about visiting {destination.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {destination.quick_fact || `Discover insider tips, top attractions, best times to visit, and local secrets for an unforgettable ${destination.name} experience.`}
                  </p>
                  <Link to={`/destination/${id}/blog`}>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg">
                      Read Full Travel Guide
                    </button>
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-8 sticky top-24">
                {/* Quick Facts Summary */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Facts</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Time</span>
                      <span className="font-medium">{destination.best_season}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-medium capitalize">{destination.budget_tier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Continent</span>
                      <span className="font-medium">{destination.continent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country</span>
                      <span className="font-medium">{destination.country}</span>
                    </div>
                  </div>
                </div>

                {/* Upgrade Banner */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-amber-300" />
                      <h3 className="font-bold text-lg">Unlock Pro Features</h3>
                    </div>
                    <p className="text-primary-100 text-sm mb-4">
                      Customize this itinerary, export to PDF/Calendar, and get price alerts.
                    </p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full py-2 bg-white text-primary-700 font-bold rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>

                {/* Similar Destinations */}
                {similarDestinations.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Destinations</h3>
                    <div className="space-y-4">
                      {similarDestinations.slice(0, 3).map((dest) => (
                        <Link
                          key={dest.destination_id}
                          to={`/destination/${dest.destination_id}`}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <img
                            src={dest.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&q=90'}
                            alt={dest.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{dest.name}</p>
                            <p className="text-sm text-gray-600">{dest.country}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dream Ticket Modal */}
        {showDreamTicket && (
          <DreamTicket
            destination={{
              name: destination.name,
              image: currentImage,
              country: destination.country
            }}
            onClose={() => setShowDreamTicket(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default DestinationDetails