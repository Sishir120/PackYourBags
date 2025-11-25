import React, { useState, useEffect } from 'react'
import { User, MapPin, Zap, Calendar, Edit3, CalendarDays, Bell } from 'lucide-react'
import { supabase, userProfile } from '../utils/supabase'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    preferences: {}
  })
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      setUser(user)
      
      // Get user profile
      const result = await userProfile.getProfile()
      if (result.success) {
        setProfile(result.profile)
        setFormData({
          name: result.profile.name || '',
          preferences: result.profile.preferences || {}
        })
        
        // Check if Google Calendar is connected
        setGoogleCalendarConnected(!!result.profile.preferences?.google_calendar_token)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const result = await userProfile.updateProfile({
        name: formData.name,
        preferences: formData.preferences
      })
      
      if (result.success) {
        setProfile(result.profile)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleGoogleCalendarConnect = () => {
    // In a real implementation, this would initiate the Google OAuth flow
    // For now, we'll just simulate the connection
    alert('Google Calendar connection would be initiated here')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  const isPremium = profile?.subscription_tier === 'premium'
  const aiCredits = profile?.ai_credits || 0
  const totalQueries = profile?.total_ai_queries || 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {profile?.name || 'User'}
                  </h1>
                  <p className="text-white/90 mb-1">{user?.email}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isPremium 
                        ? 'bg-yellow-400 text-yellow-900' 
                        : 'bg-white/20 text-white'
                    }`}>
                      {isPremium ? 'Premium' : 'Free'}
                    </span>
                    {isPremium ? (
                      <span className="text-sm">Unlimited AI access</span>
                    ) : (
                      <span className="text-sm">{aiCredits} AI credits remaining</span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setEditing(!editing)}
                className="mt-6 md:mt-0 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="p-8">
            {editing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Travel Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Budget
                      </label>
                      <select
                        value={formData.preferences.budget_tier || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            budget_tier: e.target.value
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select budget preference</option>
                        <option value="budget-friendly">Budget Friendly</option>
                        <option value="mid-range">Mid-Range</option>
                        <option value="luxury">Luxury</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Continent
                      </label>
                      <select
                        value={formData.preferences.continent || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            continent: e.target.value
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select continent</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="North America">North America</option>
                        <option value="South America">South America</option>
                        <option value="Africa">Africa</option>
                        <option value="Oceania">Oceania</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home Airport (IATA Code)
                      </label>
                      <input
                        type="text"
                        value={formData.preferences.home_airport_iata || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            home_airport_iata: e.target.value.toUpperCase()
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g. JFK, LAX, LHR"
                        maxLength="3"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter your home airport IATA code for flight searches</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Weekend Wizard Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarDays className="w-6 h-6 text-blue-600" />
                    <h3 className="font-bold text-gray-900 text-lg">Weekend Wizard</h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-gray-700 mb-2">
                        {googleCalendarConnected 
                          ? "Your Google Calendar is connected" 
                          : "Connect your Google Calendar to find 3-day weekends"}
                      </p>
                      <p className="text-sm text-gray-500">
                        We'll scan your calendar for free time blocks and find the best flight deals
                      </p>
                    </div>
                    
                    <button
                      onClick={handleGoogleCalendarConnect}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        googleCalendarConnected
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                      }`}
                      disabled={googleCalendarConnected}
                    >
                      {googleCalendarConnected ? 'Connected' : 'Connect Google Calendar'}
                    </button>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
                    <Zap className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">
                      {totalQueries}
                    </div>
                    <div className="text-gray-600">AI Queries</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
                    <MapPin className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">
                      {profile?.travel_history?.length || 0}
                    </div>
                    <div className="text-gray-600">Destinations</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
                    <Calendar className="w-10 h-10 text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">
                      {profile?.itineraries?.length || 0}
                    </div>
                    <div className="text-gray-600">Itineraries</div>
                  </div>
                </div>
                
                {/* Preferences */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Travel Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Budget Preference</div>
                      <div className="font-semibold">
                        {profile?.preferences?.budget_tier 
                          ? profile.preferences.budget_tier.charAt(0).toUpperCase() + profile.preferences.budget_tier.slice(1)
                          : 'Not set'}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Preferred Continent</div>
                      <div className="font-semibold">
                        {profile?.preferences?.continent || 'Not set'}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Home Airport</div>
                      <div className="font-semibold">
                        {profile?.preferences?.home_airport_iata || 'Not set'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subscription Info */}
                <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Subscription</h3>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="font-semibold text-lg">
                        {isPremium ? 'Premium Plan' : 'Free Plan'}
                      </div>
                      <div className="text-gray-600">
                        {isPremium 
                          ? 'Unlimited AI conversations and premium features' 
                          : 'Limited AI access with 10 free credits per month'}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => window.location.href = '/subscription'}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        isPremium
                          ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                      }`}
                      disabled={isPremium}
                    >
                      {isPremium ? 'Current Plan' : 'Upgrade to Premium'}
                    </button>
                  </div>
                  
                  {!isPremium && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">AI Credits Remaining</span>
                        <span className="font-bold text-lg">{aiCredits}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" 
                          style={{ width: `${(aiCredits / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile