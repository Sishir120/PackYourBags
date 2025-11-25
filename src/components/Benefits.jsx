import React from 'react'
import { Sparkles, Shield, Heart, Zap, Award, Users, MapPin } from 'lucide-react'

const Benefits = () => {
  const benefits = [
    {
      icon: Sparkles,
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconColor: 'text-white',
      title: 'Exclusive Travel Deals',
      description: 'Access to discounted rates on flights, hotels, and activities worldwide.',
      accent: 'from-purple-500 to-purple-600',
      emoji: '✈️'
    },
    {
      icon: MapPin,
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconColor: 'text-white',
      title: 'Personalized Recommendations',
      description: 'Receive tailored suggestions based on your preferences and past trips.',
      accent: 'from-blue-500 to-blue-600',
      emoji: '🗺️'
    },
    {
      icon: Users,
      iconBg: 'bg-gradient-to-br from-pink-500 to-pink-600',
      iconColor: 'text-white',
      title: '24/7 Customer Support',
      description: 'Get assistance anytime, anywhere with our dedicated support team.',
      accent: 'from-pink-500 to-pink-600',
      emoji: '📞'
    },
    {
      icon: Zap,
      iconBg: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      iconColor: 'text-white',
      title: 'Easy Booking Process',
      description: 'Book your entire trip in a few clicks with our user-friendly platform.',
      accent: 'from-yellow-500 to-orange-500',
      emoji: '💻'
    },
    {
      icon: Shield,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      iconColor: 'text-white',
      title: 'Travel Insurance Options',
      description: 'Protect your trip with insurance coverage for added peace of mind.',
      accent: 'from-emerald-500 to-emerald-600',
      emoji: '🛡️'
    },
    {
      icon: Award,
      iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      iconColor: 'text-white',
      title: 'Earn Rewards Points',
      description: 'Collect points for every booking and redeem them for future discounts.',
      accent: 'from-indigo-500 to-indigo-600',
      emoji: '💳'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-6 animate-fade-in">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wider">
              Why Choose Us
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            Why travelers choose
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              PackYourBags
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Join thousands of happy travelers who trust us for their adventures
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="group relative bg-white p-8 rounded-3xl border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${benefit.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                <div className="absolute inset-[1px] bg-white rounded-3xl -z-10"></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out skew-x-12"></div>
                </div>

                {/* Icon Container */}
                <div className={`w-16 h-16 ${benefit.iconBg} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`} style={{ willChange: 'transform' }}>
                  {benefit.emoji ? (
                    <span className="text-2xl">{benefit.emoji}</span>
                  ) : (
                    <Icon className={`w-8 h-8 ${benefit.iconColor}`} />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center gap-2 text-purple-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
            
            <button className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-full font-semibold text-lg hover:border-purple-600 hover:text-purple-600 transition-all duration-300 transform hover:scale-105">
              View All Destinations
              <svg className="inline-block w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Benefits
