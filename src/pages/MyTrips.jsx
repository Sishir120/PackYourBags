import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { itineraryApi, authApi } from '../utils/authApi'
import SEO from '../components/SEO'
import ConfirmDialog from '../components/ConfirmDialog'
import { 
  AlertCircle, 
  Trash2, 
  Loader2, 
  Plus, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Star,
  Eye,
  Edit3,
  Download,
  Share2,
  Tag,
  User
} from 'lucide-react'

const MyTrips = () => {
  const navigate = useNavigate()
  const [itineraries, setItineraries] = useState([])
  const [filteredItineraries, setFilteredItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null })
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterBy, setFilterBy] = useState('all')

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      navigate('/')
      return
    }
    loadItineraries()
  }, [])

  useEffect(() => {
    filterAndSortItineraries()
  }, [itineraries, searchTerm, sortBy, sortOrder, filterBy])

  const loadItineraries = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await itineraryApi.getAll()
      if (data.success) {
        setItineraries(data.itineraries || [])
      } else {
        setError('Failed to load itineraries. Please try again.')
      }
    } catch (err) {
      console.error('Error loading itineraries:', err)
      setError(err.message || 'Failed to load your trips. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortItineraries = () => {
    let result = [...itineraries]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(itin => 
        itin.title.toLowerCase().includes(term) || 
        itin.description?.toLowerCase().includes(term) ||
        itin.destination?.name?.toLowerCase().includes(term) ||
        itin.destination?.country?.toLowerCase().includes(term) ||
        itin.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    }

    // Apply type filter
    if (filterBy !== 'all') {
      if (filterBy === 'ai') {
        result = result.filter(itin => itin.ai_generated)
      } else if (filterBy === 'manual') {
        result = result.filter(itin => !itin.ai_generated)
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'created_at':
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
        case 'start_date':
          aValue = a.start_date ? new Date(a.start_date) : new Date(0)
          bValue = b.start_date ? new Date(b.start_date) : new Date(0)
          break
        case 'duration':
          aValue = a.days?.length || 0
          bValue = b.days?.length || 0
          break
        case 'budget':
          aValue = a.estimated_budget || 0
          bValue = b.estimated_budget || 0
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredItineraries(result)
  }

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ isOpen: true, id })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return
    
    setDeleting(true)
    try {
      await itineraryApi.delete(deleteConfirm.id)
      setItineraries(itineraries.filter(i => i.id !== deleteConfirm.id))
      setDeleteConfirm({ isOpen: false, id: null })
    } catch (err) {
      console.error('Error deleting itinerary:', err)
      setError(err.message || 'Failed to delete itinerary. Please try again.')
      setDeleteConfirm({ isOpen: false, id: null })
    } finally {
      setDeleting(false)
    }
  }

  const getDestinationName = (itinerary) => {
    if (itinerary.destination) {
      return `${itinerary.destination.name}, ${itinerary.destination.country}`
    }
    return 'Destination not set'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString()
  }

  const formatDuration = (days) => {
    if (!days || days.length === 0) return '0 days'
    return `${days.length} day${days.length !== 1 ? 's' : ''}`
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="text-xl text-gray-600">Loading your trips...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO title="My Trips" />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
            <p className="text-gray-600">Plan, organize, and manage all your travel adventures</p>
          </div>
          <Link
            to="/itinerary/new"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Create a new trip itinerary"
          >
            <Plus className="w-5 h-5" />
            Create New Trip
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search trips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Filter */}
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="ai">AI Generated</option>
                  <option value="manual">Manually Created</option>
                </select>
              </div>
            </div>

            {/* Sort */}
            <div>
              <div className="relative">
                {sortOrder === 'asc' ? (
                  <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                ) : (
                  <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                )}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                >
                  <option value="created_at">Date Created</option>
                  <option value="title">Title</option>
                  <option value="start_date">Start Date</option>
                  <option value="duration">Duration</option>
                  <option value="budget">Budget</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="w-5 h-5" />
                  ) : (
                    <SortDesc className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-semibold text-gray-900">{itineraries.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Days</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {itineraries.reduce((total, itin) => total + (itin.days?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Generated</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {itineraries.filter(i => i.ai_generated).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Budget</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {itineraries.length > 0 
                    ? `$${Math.round(itineraries.reduce((sum, itin) => sum + (itin.estimated_budget || 0), 0) / itineraries.length)}` 
                    : '$0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={loadItineraries}
                className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {filteredItineraries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {itineraries.length === 0 ? 'No trips yet' : 'No trips match your filters'}
            </h3>
            <p className="text-gray-500 mb-6">
              {itineraries.length === 0 
                ? 'Start planning your next adventure!' 
                : 'Try adjusting your search or filters'}
            </p>
            <Link
              to="/itinerary/new"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItineraries.map(itinerary => (
              <div key={itinerary.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {itinerary.title}
                    </h3>
                    <div className="flex gap-1">
                      {itinerary.ai_generated && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          AI
                        </span>
                      )}
                      {itinerary.is_public && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{getDestinationName(itinerary)}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {itinerary.start_date ? (
                        <>
                          <span>{formatDate(itinerary.start_date)}</span>
                          {itinerary.end_date && (
                            <span className="ml-1">- {formatDate(itinerary.end_date)}</span>
                          )}
                        </>
                      ) : (
                        <span>Not scheduled</span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDuration(itinerary.days)}
                    </div>
                    
                    {itinerary.estimated_budget > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${itinerary.estimated_budget}
                      </div>
                    )}
                  </div>

                  {itinerary.tags && itinerary.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {itinerary.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {itinerary.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{itinerary.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {itinerary.description || 'No description provided'}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/itinerary/${itinerary.id}`}
                      className="flex-1 flex items-center justify-center gap-2 text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      to={`/itinerary/${itinerary.id}/edit`}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(itinerary.id)}
                      disabled={deleting}
                      className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label={`Delete ${itinerary.title}`}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Itinerary"
        message="Are you sure you want to delete this itinerary? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

export default MyTrips