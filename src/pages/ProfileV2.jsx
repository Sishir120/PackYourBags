import React, { useState, useEffect } from 'react'
import { User, MapPin, Zap, Calendar, Edit3, Settings, Heart, LogOut, Shield, CreditCard, Plane } from 'lucide-react'
import { supabase, userProfile } from '../utils/supabase'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { mockDestinations } from '../data/mockDestinations'

const Profile = () => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        location: '',
        preferences: {}
    })

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error) throw error
            setUser(user)

            const { profile, error: profileError } = await userProfile.getProfile()
            if (profile) {
                setProfile(profile)
                setFormData({
                    name: profile.name || '',
                    bio: profile.bio || '',
                    location: profile.location || '',
                    preferences: profile.preferences || {}
                })
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            const { success, profile: updatedProfile } = await userProfile.updateProfile({
                name: formData.name,
                bio: formData.bio,
                location: formData.location,
                preferences: formData.preferences
            })

            if (success) {
                setProfile(updatedProfile)
                setIsEditing(false)
            }
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Sign in to view profile</h2>
                    <p className="text-gray-600 mb-8">Access your personalized travel dashboard, saved trips, and exclusive features.</p>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        Sign In / Register
                    </button>
                </div>
            </div>
        )
    }

    const isPremium = profile?.subscription_tier === 'premium'

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <div className="relative h-80 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Profile Card */}
                    <div className="w-full md:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
                            <div className="p-6 text-center border-b border-gray-100">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1 mx-auto mb-4">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                            {profile?.avatar_url ? (
                                                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                                    {profile?.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {isPremium && (
                                        <div className="absolute bottom-4 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            PREMIUM
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile?.name || 'Traveler'}</h2>
                                <p className="text-gray-500 text-sm mb-4">{user.email}</p>

                                <div className="flex justify-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                                        {profile?.travel_style || 'Explorer'}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                        Level {Math.floor((profile?.xp || 0) / 1000) + 1}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>

                            <div className="p-4">
                                <nav className="space-y-1">
                                    {[
                                        { id: 'overview', label: 'Overview', icon: Zap },
                                        { id: 'trips', label: 'My Trips', icon: Plane },
                                        { id: 'favorites', label: 'Favorites', icon: Heart },
                                        { id: 'settings', label: 'Settings', icon: Settings },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === item.id
                                                ? 'bg-purple-50 text-purple-700 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-purple-600' : 'text-gray-400'}`} />
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-4 border-t border-gray-100">
                                <button
                                    onClick={() => supabase.auth.signOut()}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-50 rounded-xl">
                                                <Plane className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Trips Planned</p>
                                                <p className="text-2xl font-bold text-gray-900">{profile?.trips_count || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-pink-50 rounded-xl">
                                                <Heart className="w-6 h-6 text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Favorites</p>
                                                <p className="text-2xl font-bold text-gray-900">{profile?.favorites_count || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-50 rounded-xl">
                                                <Zap className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">AI Credits</p>
                                                <p className="text-2xl font-bold text-gray-900">{profile?.ai_credits || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Welcome Banner */}
                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold mb-2">Welcome back, {profile?.name?.split(' ')[0] || 'Traveler'}!</h3>
                                        <p className="text-purple-100 mb-6 max-w-lg">Ready to plan your next adventure? Our AI travel assistant has some new recommendations for you.</p>
                                        <Link to="/plan" className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
                                            Plan a Trip
                                            <Zap className="w-4 h-4 ml-2" />
                                        </Link>
                                    </div>
                                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                                        <Plane className="w-64 h-64" />
                                    </div>
                                </div>

                                {/* Recommended Destinations - FIXED */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {mockDestinations.slice(0, 2).map((destination) => (
                                            <Link
                                                key={destination.destination_id}
                                                to={`/destination/${destination.destination_id}`}
                                                className="group relative h-48 rounded-xl overflow-hidden cursor-pointer"
                                            >
                                                <img
                                                    src={destination.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'}
                                                    alt={destination.name}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                                <div className="absolute bottom-4 left-4 text-white">
                                                    <h4 className="font-bold text-lg">{destination.name}</h4>
                                                    <p className="text-sm text-gray-200 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {destination.country}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                rows="4"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-6">
                                        <button
                                            onClick={handleSave}
                                            className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other tabs placeholders */}
                        {(activeTab === 'trips' || activeTab === 'favorites') && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {activeTab === 'trips' ? <Plane className="w-10 h-10 text-gray-300" /> : <Heart className="w-10 h-10 text-gray-300" />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {activeTab === 'trips' ? 'No trips planned yet' : 'No favorites yet'}
                                </h3>
                                <p className="text-gray-500 mb-8">
                                    {activeTab === 'trips'
                                        ? 'Start planning your next adventure with our AI assistant.'
                                        : 'Explore destinations and save your favorites here.'}
                                </p>
                                <Link
                                    to={activeTab === 'trips' ? '/plan' : '/destinations'}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors inline-block"
                                >
                                    {activeTab === 'trips' ? 'Plan a Trip' : 'Explore Destinations'}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
