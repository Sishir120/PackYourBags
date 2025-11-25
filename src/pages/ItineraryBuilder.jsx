import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { itineraryApi, authApi } from '../utils/authApi'
import { destinationApi } from '../utils/api'
import SEO from '../components/SEO'
import { 
  Save, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Edit3, 
  Eye, 
  Download, 
  Share2,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

const ItineraryBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(!id) // Start in edit mode for new itineraries
  const [activeTab, setActiveTab] = useState('overview') // overview, days, budget, notes

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      navigate('/')
      return
    }

    if (id) {
      loadItinerary()
    } else {
      setItinerary({
        title: '',
        description: '',
        destination_id: '',
        start_date: '',
        end_date: '',
        days: [],
        estimated_budget: 0,
        budget_breakdown: {},
        notes: '',
        tags: []
      })
    }
    loadDestinations()
  }, [id])

  const loadItinerary = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await itineraryApi.getOne(id)
      if (data.success) {
        setItinerary({
          ...data.itinerary,
          start_date: data.itinerary.start_date ? data.itinerary.start_date.split('T')[0] : '',
          end_date: data.itinerary.end_date ? data.itinerary.end_date.split('T')[0] : ''
        })
      } else {
        setError(data.error || 'Failed to load itinerary')
      }
    } catch (err) {
      setError(err.message || 'Failed to load itinerary')
    } finally {
      setLoading(false)
    }
  }

  const loadDestinations = async () => {
    try {
      const data = await destinationApi.getDestinations()
      if (data.success) {
        setDestinations(data.destinations)
      }
    } catch (err) {
      console.error('Failed to load destinations:', err)
    }
  }

  const handleSave = async () => {
    if (!itinerary.title || !itinerary.destination_id) {
      setError('Title and destination are required')
      return
    }

    setSaving(true)
    setError(null)
    try {
      if (id) {
        const data = await itineraryApi.update(id, {
          ...itinerary,
          start_date: itinerary.start_date || null,
          end_date: itinerary.end_date || null
        })
        if (data.success) {
          setItinerary({
            ...data.itinerary,
            start_date: data.itinerary.start_date ? data.itinerary.start_date.split('T')[0] : '',
            end_date: data.itinerary.end_date ? data.itinerary.end_date.split('T')[0] : ''
          })
        }
      } else {
        const data = await itineraryApi.create({
          ...itinerary,
          start_date: itinerary.start_date || null,
          end_date: itinerary.end_date || null
        })
        if (data.success) {
          navigate(`/itinerary/${data.itinerary.id}`)
        } else {
          setError(data.error || 'Failed to create itinerary')
          return
        }
      }
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Failed to save itinerary')
    } finally {
      setSaving(false)
    }
  }

  const addDay = () => {
    const newDay = {
      day: itinerary.days.length + 1,
      title: `Day ${itinerary.days.length + 1}`,
      date: '',
      activities: [],
      meals: { breakfast: '', lunch: '', dinner: '' },
      notes: ''
    }
    setItinerary({
      ...itinerary,
      days: [...itinerary.days, newDay]
    })
  }

  const removeDay = (dayIndex) => {
    const newDays = itinerary.days.filter((_, index) => index !== dayIndex)
    // Re-index days
    const reindexedDays = newDays.map((day, index) => ({
      ...day,
      day: index + 1,
      title: `Day ${index + 1}`
    }))
    setItinerary({ ...itinerary, days: reindexedDays })
  }

  const updateDay = (dayIndex, field, value) => {
    const newDays = [...itinerary.days]
    newDays[dayIndex] = { ...newDays[dayIndex], [field]: value }
    setItinerary({ ...itinerary, days: newDays })
  }

  const addActivity = (dayIndex) => {
    const newDays = [...itinerary.days]
    if (!newDays[dayIndex].activities) newDays[dayIndex].activities = []
    newDays[dayIndex].activities.push({ 
      time: '', 
      activity: '', 
      duration: '',
      location: '',
      notes: '',
      category: 'sightseeing'
    })
    setItinerary({ ...itinerary, days: newDays })
  }

  const updateActivity = (dayIndex, actIndex, field, value) => {
    const newDays = [...itinerary.days]
    newDays[dayIndex].activities[actIndex] = { 
      ...newDays[dayIndex].activities[actIndex], 
      [field]: value 
    }
    setItinerary({ ...itinerary, days: newDays })
  }

  const removeActivity = (dayIndex, actIndex) => {
    const newDays = [...itinerary.days]
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter((_, index) => index !== actIndex)
    setItinerary({ ...itinerary, days: newDays })
  }

  const getDestinationName = (destinationId) => {
    const dest = destinations.find(d => d.destination_id === destinationId)
    return dest ? `${dest.name}, ${dest.country}` : 'Unknown Destination'
  }

  const calculateDuration = () => {
    if (!itinerary?.start_date || !itinerary?.end_date) return 0
    const start = new Date(itinerary.start_date)
    const end = new Date(itinerary.end_date)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="text-xl text-gray-600">Loading itinerary...</div>
        </div>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Itinerary Not Found</h2>
          <p className="text-gray-600 mb-6">The itinerary you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/my-trips')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Back to My Trips
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEO title={itinerary.title || 'Create Itinerary'} />
      
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {editing ? (id ? 'Edit Itinerary' : 'Create New Itinerary') : itinerary.title}
              </h1>
              {itinerary.destination_id && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{getDestinationName(itinerary.destination_id)}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {editing ? (
                <>
                  <button
                    onClick={() => navigate('/my-trips')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {editing ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'days', label: 'Itinerary', icon: Calendar },
                  { id: 'budget', label: 'Budget', icon: DollarSign },
                  { id: 'notes', label: 'Notes', icon: Edit3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={itinerary.title}
                      onChange={(e) => setItinerary({ ...itinerary, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="My Amazing Trip"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                    <select
                      value={itinerary.destination_id}
                      onChange={(e) => setItinerary({ ...itinerary, destination_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select destination...</option>
                      {destinations.map(dest => (
                        <option key={dest.destination_id} value={dest.destination_id}>
                          {dest.name}, {dest.country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={itinerary.start_date}
                      onChange={(e) => setItinerary({ ...itinerary, start_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={itinerary.end_date}
                      onChange={(e) => setItinerary({ ...itinerary, end_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                      {calculateDuration() || 0} days
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={itinerary.description}
                    onChange={(e) => setItinerary({ ...itinerary, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Brief description of your trip"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={itinerary.tags?.join(', ') || ''}
                    onChange={(e) => setItinerary({ ...itinerary, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Family, Adventure, Budget, etc."
                  />
                  <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
                </div>
              </div>
            )}

            {/* Itinerary Tab */}
            {activeTab === 'days' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Daily Itinerary</h2>
                  <button
                    onClick={addDay}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Day
                  </button>
                </div>

                {itinerary.days.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No days added yet</h3>
                    <p className="text-gray-500 mb-4">Add your first day to start planning your trip</p>
                    <button
                      onClick={addDay}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Add Day
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {itinerary.days.map((day, dayIndex) => (
                      <div key={dayIndex} className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">Day {day.day}</h3>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder={`Title for Day ${day.day}`}
                            />
                          </div>
                          <button
                            onClick={() => removeDay(dayIndex)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Remove day"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                              <input
                                type="date"
                                value={day.date}
                                onChange={(e) => updateDay(dayIndex, 'date', e.target.value)}
                                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                              <input
                                type="text"
                                value={day.notes}
                                onChange={(e) => updateDay(dayIndex, 'notes', e.target.value)}
                                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Day notes"
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">Activities</h4>
                              <button
                                onClick={() => addActivity(dayIndex)}
                                className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                Add Activity
                              </button>
                            </div>
                            
                            {day.activities?.length > 0 ? (
                              <div className="space-y-3">
                                {day.activities.map((activity, actIndex) => (
                                  <div key={actIndex} className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded">
                                    <div className="col-span-2">
                                      <input
                                        type="text"
                                        placeholder="Time"
                                        value={activity.time}
                                        onChange={(e) => updateActivity(dayIndex, actIndex, 'time', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <input
                                        type="text"
                                        placeholder="Activity"
                                        value={activity.activity}
                                        onChange={(e) => updateActivity(dayIndex, actIndex, 'activity', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <input
                                        type="text"
                                        placeholder="Duration"
                                        value={activity.duration}
                                        onChange={(e) => updateActivity(dayIndex, actIndex, 'duration', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <input
                                        type="text"
                                        placeholder="Location"
                                        value={activity.location}
                                        onChange={(e) => updateActivity(dayIndex, actIndex, 'location', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                    <div className="col-span-1">
                                      <select
                                        value={activity.category}
                                        onChange={(e) => updateActivity(dayIndex, actIndex, 'category', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      >
                                        <option value="sightseeing">Sightseeing</option>
                                        <option value="food">Food</option>
                                        <option value="transport">Transport</option>
                                        <option value="accommodation">Accommodation</option>
                                        <option value="shopping">Shopping</option>
                                        <option value="entertainment">Entertainment</option>
                                        <option value="other">Other</option>
                                      </select>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                      <button
                                        onClick={() => removeActivity(dayIndex, actIndex)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Remove activity"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <div className="col-span-12 mt-2">
                                      <input
                                        type="text"
                                        placeholder="Notes"
                                        value={activity.notes}
                                        onChange={(e) => updateActivity(dayIndex, actIndex, 'notes', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 bg-gray-100 rounded">
                                <p className="text-gray-500 text-sm">No activities added yet</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Meals</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {['breakfast', 'lunch', 'dinner'].map((meal) => (
                                <div key={meal}>
                                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{meal}</label>
                                  <input
                                    type="text"
                                    value={day.meals?.[meal] || ''}
                                    onChange={(e) => {
                                      const newMeals = { ...day.meals, [meal]: e.target.value }
                                      updateDay(dayIndex, 'meals', newMeals)
                                    }}
                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                                    placeholder={`What's for ${meal}?`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === 'budget' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Total Budget ($)</label>
                    <input
                      type="number"
                      value={itinerary.estimated_budget || ''}
                      onChange={(e) => setItinerary({ ...itinerary, estimated_budget: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Budget Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { key: 'flights', label: 'Flights' },
                      { key: 'accommodation', label: 'Accommodation' },
                      { key: 'food', label: 'Food' },
                      { key: 'activities', label: 'Activities' },
                      { key: 'transport', label: 'Transport' },
                      { key: 'shopping', label: 'Shopping' },
                      { key: 'insurance', label: 'Insurance' },
                      { key: 'other', label: 'Other' }
                    ].map((item) => (
                      <div key={item.key} className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                        <input
                          type="number"
                          value={itinerary.budget_breakdown?.[item.key] || ''}
                          onChange={(e) => {
                            const newBreakdown = { 
                              ...itinerary.budget_breakdown, 
                              [item.key]: parseFloat(e.target.value) || 0 
                            }
                            setItinerary({ ...itinerary, budget_breakdown: newBreakdown })
                          }}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trip Notes</label>
                  <textarea
                    value={itinerary.notes || ''}
                    onChange={(e) => setItinerary({ ...itinerary, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={8}
                    placeholder="Add any additional notes for your trip..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Pro Tip</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        Use the notes section to add important information like passport details, 
                        emergency contacts, or special requirements for your trip.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Overview */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{itinerary.start_date ? new Date(itinerary.start_date).toLocaleDateString() : 'TBD'} 
                  {itinerary.end_date ? ` - ${new Date(itinerary.end_date).toLocaleDateString()}` : ''}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{calculateDuration() || 0} days</span>
                </div>
                {itinerary.estimated_budget > 0 && (
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span>${itinerary.estimated_budget} estimated</span>
                  </div>
                )}
              </div>

              {itinerary.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{itinerary.description}</p>
                </div>
              )}

              {itinerary.tags && itinerary.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {itinerary.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Daily Itinerary */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Daily Itinerary</h2>
              {itinerary.days?.length > 0 ? (
                <div className="space-y-6">
                  {itinerary.days.map((day, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-lg">Day {day.day}: {day.title}</h3>
                        {day.date && (
                          <p className="text-gray-600 text-sm">{new Date(day.date).toLocaleDateString()}</p>
                        )}
                      </div>
                      
                      <div className="p-4">
                        {day.notes && (
                          <div className="mb-4 p-3 bg-blue-50 rounded">
                            <p className="text-blue-800">{day.notes}</p>
                          </div>
                        )}

                        {day.activities?.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Activities</h4>
                            <div className="space-y-3">
                              {day.activities.map((act, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                                  <div className="flex-shrink-0 w-16 text-center">
                                    <div className="font-medium">{act.time}</div>
                                    {act.duration && (
                                      <div className="text-xs text-gray-500">{act.duration}</div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">{act.activity}</div>
                                    {act.location && (
                                      <div className="text-sm text-gray-600 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {act.location}
                                      </div>
                                    )}
                                    {act.notes && (
                                      <div className="text-sm text-gray-600 mt-1">{act.notes}</div>
                                    )}
                                    <div className="mt-1">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        act.category === 'sightseeing' ? 'bg-blue-100 text-blue-800' :
                                        act.category === 'food' ? 'bg-green-100 text-green-800' :
                                        act.category === 'transport' ? 'bg-yellow-100 text-yellow-800' :
                                        act.category === 'accommodation' ? 'bg-purple-100 text-purple-800' :
                                        act.category === 'shopping' ? 'bg-pink-100 text-pink-800' :
                                        act.category === 'entertainment' ? 'bg-indigo-100 text-indigo-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {act.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
                          <div>
                            <h4 className="font-medium mb-2">Meals</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {day.meals?.breakfast && (
                                <div className="p-3 bg-amber-50 rounded">
                                  <div className="font-medium text-amber-800">Breakfast</div>
                                  <div className="text-amber-700">{day.meals.breakfast}</div>
                                </div>
                              )}
                              {day.meals?.lunch && (
                                <div className="p-3 bg-amber-50 rounded">
                                  <div className="font-medium text-amber-800">Lunch</div>
                                  <div className="text-amber-700">{day.meals.lunch}</div>
                                </div>
                              )}
                              {day.meals?.dinner && (
                                <div className="p-3 bg-amber-50 rounded">
                                  <div className="font-medium text-amber-800">Dinner</div>
                                  <div className="text-amber-700">{day.meals.dinner}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No itinerary planned yet</h3>
                  <p className="text-gray-500">This itinerary doesn't have any days planned.</p>
                </div>
              )}
            </div>

            {/* Budget */}
            {(itinerary.estimated_budget > 0 || (itinerary.budget_breakdown && Object.keys(itinerary.budget_breakdown).length > 0)) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Budget</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itinerary.estimated_budget > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-green-900">Estimated Total</h3>
                          <p className="text-green-700">For the entire trip</p>
                        </div>
                        <div className="text-2xl font-bold text-green-800">${itinerary.estimated_budget}</div>
                      </div>
                    </div>
                  )}

                  {itinerary.budget_breakdown && Object.keys(itinerary.budget_breakdown).length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Breakdown</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(itinerary.budget_breakdown).map(([key, value]) => (
                          value > 0 && (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">
                                {key.replace('_', ' ')}
                              </span>
                              <span className="font-medium">${value}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {itinerary.notes && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Notes</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="whitespace-pre-wrap text-blue-800">{itinerary.notes}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ItineraryBuilder