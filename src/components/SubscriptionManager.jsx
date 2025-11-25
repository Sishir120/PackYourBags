import React, { useState, useEffect } from 'react'
import { Crown, Zap, Check, ArrowRight } from 'lucide-react'
import { subscription } from '../utils/supabase'

const SubscriptionManager = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    setLoading(true)
    try {
      const result = await subscription.getStatus()
      if (result.success) {
        setSubscriptionStatus(result.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (tier = 'premium') => {
    setUpgrading(true)
    try {
      const result = await subscription.upgrade(tier)
      if (result.success) {
        setUpgradeSuccess(true)
        // Refresh subscription status
        setTimeout(() => {
          fetchSubscriptionStatus()
          setUpgradeSuccess(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error)
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!subscriptionStatus) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">Unable to load subscription information</p>
      </div>
    )
  }

  const isPremium = subscriptionStatus.isPremium
  const isDeepSeek = subscriptionStatus.isDeepseek
  const credits = subscriptionStatus.credits
  const totalQueries = subscriptionStatus.totalQueries

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Subscription</h1>
        <p className="text-gray-600">Manage your PackYourBags subscription and AI credits</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Plan */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Plan</h2>
          
          {isDeepSeek ? (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 text-center">
              <div className="flex justify-center mb-3">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">DeepSeek Special</h3>
              <p className="opacity-90 mb-4">Advanced AI with specialized knowledge</p>
              <div className="text-3xl font-bold">$14.99<span className="text-lg">/month</span></div>
            </div>
          ) : isPremium ? (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-6 text-center">
              <Crown className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="opacity-90 mb-4">Unlimited AI access</p>
              <div className="text-3xl font-bold">$9.99<span className="text-lg">/month</span></div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="opacity-90 mb-4">Limited AI access</p>
              <div className="text-3xl font-bold">$0<span className="text-lg">/month</span></div>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">AI Credits</span>
              <span className="font-bold">
                {isPremium || isDeepSeek ? 'Unlimited' : `${credits} remaining`}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Total Queries</span>
              <span className="font-bold">{totalQueries}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Plan Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDeepSeek 
                  ? 'bg-blue-100 text-blue-800' 
                  : isPremium 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isDeepSeek ? 'DeepSeek Special' : isPremium ? 'Premium' : 'Free Tier'}
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade Options */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Plan Options</h2>
          
          {isDeepSeek ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
                <Check className="w-5 h-5" />
                <span className="font-medium">You're on the DeepSeek Special plan!</span>
              </div>
              <p className="text-gray-600 mb-6">
                Enjoy unlimited DeepSeek AI conversations and advanced features
              </p>
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                Already on DeepSeek Special
              </button>
            </div>
          ) : isPremium ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                <Check className="w-5 h-5" />
                <span className="font-medium">You're on the Premium plan!</span>
              </div>
              <p className="text-gray-600 mb-6">
                Enjoy unlimited AI conversations and premium features
              </p>
              <div className="flex gap-3">
                <button
                  disabled
                  className="flex-1 bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  Already Premium
                </button>
                <button
                  onClick={() => handleUpgrade('deepseek')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Upgrade to DeepSeek
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Premium Plan */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Premium Plan
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Unlock unlimited AI conversations
                  </p>
                  
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Unlimited AI conversations</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Detailed itinerary planning</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Priority response times</span>
                    </li>
                  </ul>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">$9.99</div>
                      <div className="text-gray-600 text-xs">per month</div>
                    </div>
                    
                    <button
                      onClick={() => handleUpgrade('premium')}
                      disabled={upgrading}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        upgrading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {upgrading ? 'Upgrading...' : 'Choose Plan'}
                    </button>
                  </div>
                </div>
                
                {/* DeepSeek Special Plan */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    DeepSeek Special
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Advanced AI with specialized knowledge
                  </p>
                  
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Unlimited DeepSeek AI conversations</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Specialized travel knowledge base</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Enhanced reasoning capabilities</span>
                    </li>
                  </ul>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">$14.99</div>
                      <div className="text-gray-600 text-xs">per month</div>
                    </div>
                    
                    <button
                      onClick={() => handleUpgrade('deepseek')}
                      disabled={upgrading}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        upgrading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {upgrading ? 'Upgrading...' : 'Choose Plan'}
                    </button>
                  </div>
                </div>
              </div>
              
              {upgradeSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-4">
                  <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Upgrade successful!</span>
                  </div>
                  <p className="text-green-600 text-sm">
                    Your account has been upgraded
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Free Plan Includes</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                10 AI questions per month
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Basic destination recommendations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Travel tips and advice
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Budget suggestions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionManager