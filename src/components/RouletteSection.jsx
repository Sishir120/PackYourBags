import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, ChevronDown, AlertCircle, Zap, Sparkles, MapPin, Star, Globe, User, Compass, Palmtree, Utensils } from 'lucide-react'
import RouletteWheel from './RouletteWheel'
import { mockDestinations } from '../data/mockDestinations'

const RouletteSection = () => {
  const navigate = useNavigate()
  const [filterType, setFilterType] = useState('global')
  const [filterValue, setFilterValue] = useState('')
  const [activity, setActivity] = useState('')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showActivityDropdown, setShowActivityDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [spins, setSpins] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [destinations, setDestinations] = useState([])
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Derived data for filters
  const continents = [...new Set(mockDestinations.map(d => d.continent))].sort()
  const countries = [...new Set(mockDestinations.map(d => d.country))].sort()

  const activityOptions = [
    { id: 'adventure', name: 'Adventure', icon: Compass },
    { id: 'relaxation', name: 'Relaxation', icon: Palmtree },
    { id: 'culture', name: 'Culture', icon: Globe },
    { id: 'food', name: 'Food & Dining', icon: Utensils }
  ]

  useEffect(() => {
    fetchDestinations()
  }, [filterType, filterValue, activity])

  const fetchDestinations = () => {
    setLoading(true)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      try {
        let filtered = [...mockDestinations]

        if (filterType === 'continent' && filterValue) {
          filtered = filtered.filter(d => d.continent === filterValue)
        } else if (filterType === 'country' && filterValue) {
          filtered = filtered.filter(d => d.country === filterValue)
        }

        // Randomize order for the wheel
        filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 12)

        setDestinations(filtered)
        setLoading(false)
      } catch (err) {
        setError('Failed to load destinations')
        setLoading(false)
      }
    }, 500)
  }

  const handleFilterChange = (type, value = '') => {
    setFilterType(type)
    setFilterValue(value)
    setShowFilterDropdown(false)
    setShowResult(false)
    setSelectedDestination(null)
  }

  const handleActivityChange = (activityId) => {
    setActivity(activityId === activity ? '' : activityId)
    setShowActivityDropdown(false)
  }

  const spinRoulette = () => {
    if (isSpinning || destinations.length === 0) return

    setIsSpinning(true)
    setShowResult(false)
    setSpins(prev => prev + 1)
  }

  const handleSpinComplete = (destination) => {
    setIsSpinning(false)
    setSelectedDestination(destination)
    setShowResult(true)
    // Play success sound if available
  }

  const handleViewDetails = () => {
    if (selectedDestination) {
      navigate(`/destination/${selectedDestination.destination_id}`)
    }
  }

  const getFilterLabel = () => {
    if (filterType === 'global') return 'All Destinations'
    if (filterType === 'continent') return `Continent: ${filterValue}`
    if (filterType === 'country') return `Country: ${filterValue}`
    return 'All Destinations'
  }

  const getActivityLabel = () => {
    if (!activity) return 'Any Activity'
    const option = activityOptions.find(o => o.id === activity)
    return option ? option.name : 'Any Activity'
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-amber-50 rounded-full opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-orange-50 rounded-full opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-amber-100 px-6 py-2 rounded-full shadow-sm mb-8 border border-amber-200">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-700 uppercase tracking-widest">
              Test Your Luck
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-neutral-900">
            Spin & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Win Adventure</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Let destiny choose your next quest. Spin the wheel to discover exclusive destinations and earn travel XP.
          </p>
        </div>

        {/* Filter Selection */}
        <div className="max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-neutral-300 shadow-sm text-left hover:border-amber-500 transition-colors hover:shadow-md"
            >
              <span className="font-medium text-neutral-900">{getFilterLabel()}</span>
              <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showFilterDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-xl border border-neutral-200 max-h-96 overflow-y-auto">
                <div className="py-2">
                  <button
                    onClick={() => handleFilterChange('global')}
                    className="w-full text-left px-6 py-3 hover:bg-neutral-100 font-medium text-neutral-900"
                  >
                    All Destinations
                  </button>

                  <div className="border-t border-neutral-200 mt-2 pt-2">
                    <div className="px-6 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">By Continent</div>
                    {continents.map((continent) => (
                      <button
                        key={continent}
                        onClick={() => handleFilterChange('continent', continent)}
                        className="w-full text-left px-6 py-3 hover:bg-neutral-100 text-neutral-700"
                      >
                        {continent}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-neutral-200 mt-2 pt-2">
                    <div className="px-6 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">By Country</div>
                    {countries.map((country) => (
                      <button
                        key={country}
                        onClick={() => handleFilterChange('country', country)}
                        className="w-full text-left px-6 py-3 hover:bg-neutral-100 text-neutral-700"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity Filter */}
          <div className="relative">
            <button
              onClick={() => setShowActivityDropdown(!showActivityDropdown)}
              className="w-full flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-neutral-300 shadow-sm text-left hover:border-amber-500 transition-colors hover:shadow-md"
            >
              <span className="font-medium text-neutral-900">{getActivityLabel()}</span>
              <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform ${showActivityDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showActivityDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-xl border border-neutral-200 max-h-96 overflow-y-auto">
                <div className="py-2">
                  {activityOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleActivityChange(option.id)}
                        className="w-full text-left px-6 py-3 hover:bg-neutral-100 flex items-center gap-3 text-neutral-700"
                      >
                        <Icon className="w-4 h-4 text-neutral-500" />
                        {option.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-neutral-600">Loading quests...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto mb-8">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold">Quest Log Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button
                  onClick={fetchDestinations}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Retry Quest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Roulette Wheel */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 bg-white shadow-lg rounded-xl px-4 py-2 z-20 border border-neutral-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-current" />
                <span className="font-bold text-neutral-900 text-sm">Spin Streak: {spins}</span>
              </div>

              <div className="relative bg-white rounded-full p-8 shadow-2xl border border-neutral-200 ring-4 ring-neutral-50">
                <RouletteWheel
                  destinations={destinations}
                  isSpinning={isSpinning}
                  onSpinComplete={handleSpinComplete}
                />
              </div>
              <div className="flex justify-center mt-12">
                <button
                  onClick={spinRoulette}
                  disabled={isSpinning || destinations.length === 0}
                  className={`relative overflow-hidden px-10 py-5 rounded-full font-bold text-lg shadow-xl transition-all transform hover:scale-105 active:scale-95 ${isSpinning || destinations.length === 0
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-400 to-orange-600 text-white hover:shadow-amber-500/30'
                    }`}
                >
                  {isSpinning ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Spinning...</span>
                    </div>
                  ) : destinations.length === 0 ? (
                    <span>No Quests Available</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span>SPIN & WIN</span>
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Result Display */}
            <div className="relative">
              {showResult && selectedDestination ? (
                <div className="card card-hover overflow-hidden border-2 border-amber-400 shadow-amber-100 shadow-2xl transform transition-all duration-500">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={selectedDestination.image_url || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90`}
                      alt={selectedDestination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-transparent"></div>

                    <div className="absolute top-6 right-6 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-bold">
                        +500 XP Earned!
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-4xl font-bold text-white mb-2">
                        {selectedDestination.name}
                      </h3>
                      <p className="text-white text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-400" />
                        {selectedDestination.country}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <p className="text-neutral-700 text-lg leading-relaxed">
                      {selectedDestination.quick_fact}
                    </p>

                    {selectedDestination.highlights && selectedDestination.highlights.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-neutral-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                          <Star className="w-4 h-4 text-amber-500" />
                          Quest Highlights
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedDestination.highlights.slice(0, 5).map((highlight, index) => (
                            <span
                              key={index}
                              className="bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1.5 rounded-full text-sm font-bold"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleViewDetails}
                        className="flex-1 btn btn-primary bg-neutral-900 hover:bg-neutral-800 text-white"
                      >
                        View Quest Details
                      </button>
                      <button
                        onClick={spinRoulette}
                        className="flex-1 btn btn-secondary border-amber-200 text-amber-700 hover:bg-amber-50"
                      >
                        <Sparkles className="w-5 h-5" />
                        Spin Again
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card p-12 text-center border-2 border-dashed border-neutral-200 bg-neutral-50/50">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                    <Globe className="w-10 h-10 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">Ready for Adventure?</h3>
                  <p className="text-neutral-600 text-lg mb-6">
                    Click the spin button to unlock your next travel quest and earn rewards!
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm">
                    <span className="text-sm font-medium text-neutral-700">
                      Current Region: <span className="font-bold text-neutral-900">{getFilterLabel()}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-24 border-t border-neutral-200 pt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">Global Leaderboard Stats</h3>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Join the ranks of elite travelers exploring the world</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Quests Available', value: '150+', icon: MapPin },
              { label: 'Active Explorers', value: '50K+', icon: User },
              { label: 'Quests Completed', value: '120K+', icon: Trophy }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="card card-hover p-8 text-center group border-b-4 border-b-transparent hover:border-b-amber-500 transition-all">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-6 group-hover:bg-primary-600 transition-colors duration-300 shadow-inner">
                    <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-4xl font-bold text-neutral-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-neutral-600 font-bold uppercase tracking-wide text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RouletteSection