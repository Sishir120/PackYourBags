import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, Filter, Grid, List, Star, DollarSign, X } from 'lucide-react'
import { destinationApi } from '../utils/destinationApi'
import DestinationCard from '../components/DestinationCard'
import Loading from '../components/Loading'
import ErrorBoundary from '../components/ErrorBoundary'
import SEO from '../components/SEO'

const Destinations = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({ continent: '', budget: '', sortBy: 'name' })
  const [showFilters, setShowFilters] = useState(false)

  // Fetch destinations on mount
  useEffect(() => {
    fetchDestinations()
  }, [])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchDestinations = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await destinationApi.getDestinations()
      if (data.success && data.destinations) {
        setDestinations(data.destinations)
      } else {
        setError('Failed to load destinations. Please try again later.')
      }
    } catch (err) {
      console.error('Error fetching destinations:', err)
      setError('Unable to load destinations. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = useMemo(() => {
    let result = [...destinations]

    // Search filter
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase().trim()
      result = result.filter(dest => {
        const combined = [dest.name, dest.country, dest.continent, dest.description, dest.quick_fact, dest.best_season, ...(dest.highlights || []), ...(dest.local_tips || [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return term.split(' ').every(t => combined.includes(t))
      })
    }

    // Continent filter
    if (filters.continent) {
      result = result.filter(dest => dest.continent === filters.continent)
    }

    // Budget filter
    if (filters.budget) {
      result = result.filter(dest => dest.budget_tier === filters.budget)
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0)
        default:
          return 0
      }
    })

    return result
  }, [destinations, debouncedSearchTerm, filters])

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({ continent: '', budget: '', sortBy: 'name' })
    setSearchTerm('')
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('search')
    setSearchParams(newParams)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.continent) count++
    if (filters.budget) count++
    if (searchTerm) count++
    return count
  }

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md">
          <div className="text-red-500 mb-4"><MapPin className="w-16 h-16 mx-auto" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={fetchDestinations} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 text-white">
        <SEO
          title="Explore Top Destinations 2025"
          description="Discover the best places to visit in 2025. From hidden gems to popular hotspots, plan your next adventure with our AI travel guide."
          keywords={["best places to visit 2025", "hidden travel gems", "sustainable tourism", "eco-friendly trips", "travel destinations"]}
        />
        {/* Hero */}
        <div className="bg-slate-800 border-b border-slate-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Destinations</h1>
            <p className="text-xl max-w-2xl mx-auto">Discover amazing places around the world with our AI-powered travel recommendations</p>
          </div>
        </div>
        {/* Search & Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-6 mb-8">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations, countries, continents, highlights, tips, or seasons..."
                className="w-full pl-12 pr-4 py-4 bg-slate-700 border border-slate-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                value={searchTerm}
                onChange={e => {
                  const val = e.target.value
                  setSearchTerm(val)
                  const params = new URLSearchParams(searchParams)
                  if (val) params.set('search', val)
                  else params.delete('search')
                  setSearchParams(params)
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    const params = new URLSearchParams(searchParams)
                    params.delete('search')
                    setSearchParams(params)
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {/* Filter toggle */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{getActiveFilterCount()}</span>
                  )}
                </button>
                {getActiveFilterCount() > 0 && (
                  <button onClick={clearFilters} className="text-sm text-brand-primary hover:text-brand-secondary flex items-center gap-1">
                    <X className="w-4 h-4" /> Clear all
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    className="appearance-none bg-slate-700 border border-slate-600 text-white rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    value={filters.sortBy}
                    onChange={e => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="popularity">Sort by Popularity</option>
                  </select>
                  <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                <div className="flex gap-2">
                  <button
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'bg-slate-700 text-gray-300'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'bg-slate-700 text-gray-300'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            {/* Advanced filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Continent</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'].map(cont => (
                        <button
                          key={cont}
                          onClick={() => handleFilterChange('continent', cont)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.continent === cont ? 'bg-brand-primary text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                        >{cont}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Budget</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ value: 'budget-friendly', label: 'Budget' }, { value: 'mid-range', label: 'Mid Range' }, { value: 'luxury', label: 'Luxury' }].map(b => (
                        <button
                          key={b.value}
                          onClick={() => handleFilterChange('budget', b.value)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.budget === b.value ? 'bg-brand-primary text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                        >{b.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Results header */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{filteredDestinations.length} Destinations Found</h2>
          </div>
          {/* Results list */}
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No destinations found</h3>
              <p className="text-gray-300 mb-6">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-secondary transition-colors">Clear Filters</button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {filteredDestinations.map(dest => (
                <DestinationCard key={dest.destination_id} destination={dest} user={user} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Destinations