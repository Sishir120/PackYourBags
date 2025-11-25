import React, { useState, useEffect, useMemo } from 'react'
import { ChevronRight, Sparkles, TrendingUp, Filter } from 'lucide-react'
import { destinationApi } from '../utils/destinationApi'
import DestinationCard from './DestinationCard'
import { useNavigate } from 'react-router-dom'

const FeaturedDestinations = ({ user }) => {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()

  const filters = [
    { id: 'all', label: 'All Destinations', icon: '🌍' },
    { id: 'budget-friendly', label: 'Budget', icon: '💰' },
    { id: 'mid-range', label: 'Mid-Range', icon: '💳' },
    { id: 'luxury', label: 'Luxury', icon: '💎' },
    { id: 'popular', label: 'Popular', icon: '🔥' },
    { id: 'new', label: 'New', icon: '✨' }
  ]

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const data = await destinationApi.getDestinations({ limit: 6 })
      if (data.success && data.destinations) {
        setDestinations(data.destinations)
      } else {
        setDestinations([])
      }
    } catch (error) {
      console.error('Error fetching destinations:', error)
      // Fallback to empty state - component will show empty grid
      setDestinations([])
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = useMemo(() => {
    if (activeFilter === 'all') return destinations

    if (activeFilter === 'popular') {
      return destinations.filter(d => d.popularity_score > 80)
    }

    if (activeFilter === 'new') {
      return destinations.filter(d => new Date(d.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    }

    return destinations.filter(d => d.budget_tier === activeFilter)
  }, [destinations, activeFilter])

  const handleViewAll = () => {
    navigate('/destinations')
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-neutral-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="featured" className="py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 px-4 py-2 rounded-full mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-bold text-primary-700 uppercase tracking-widest">
                Featured Collection
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Trending Destinations
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl font-medium">
              Handpicked places loved by travelers worldwide, curated just for you.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${activeFilter === filter.id
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                  }`}
              >
                <span className="mr-1.5">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredDestinations.map((destination) => (
            <div key={destination.destination_id} className="h-full">
              <DestinationCard destination={destination} user={user} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 border border-neutral-200 rounded-full font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <TrendingUp className="w-4 h-4 text-primary-600 group-hover:scale-110 transition-transform" />
            <span>Discover More Destinations</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedDestinations