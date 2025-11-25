import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Heart, Globe, Zap, Users, Target } from 'lucide-react'
import SEO from '../components/SEO'

const AboutUs = () => {
  return (
    <>
      <SEO 
        title="About Us | PackYourBags"
        description="Discover the story behind PackYourBags - AI-powered travel discovery platform helping millions explore the world."
      />
      
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl mb-6 transform hover:scale-110 transition-transform">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-700 to-pink-600 bg-clip-text text-transparent mb-4">
              About PackYourBags
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing travel discovery with AI-powered recommendations, making dream destinations accessible to everyone.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At PackYourBags, we believe that everyone deserves to explore the world. Our mission is to democratize travel discovery by combining cutting-edge artificial intelligence with personalized recommendations, making it easier than ever to find your perfect destination.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're passionate about breaking down the barriers to travel planning—from overwhelming choices to budget constraints—and empowering travelers with smart, data-driven insights that match their unique preferences and dreams.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: 'Passion for Travel',
                  description: 'We\'re travelers at heart who understand the transformative power of exploration and cultural immersion.',
                  color: 'from-pink-500 to-rose-500'
                },
                {
                  icon: Zap,
                  title: 'Innovation First',
                  description: 'Leveraging AI and machine learning to deliver personalized experiences that evolve with your preferences.',
                  color: 'from-purple-500 to-indigo-500'
                },
                {
                  icon: Globe,
                  title: 'Global Community',
                  description: 'Building a worldwide community of explorers who share experiences and inspire each other.',
                  color: 'from-orange-500 to-amber-500'
                }
              ].map((value, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-6`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                PackYourBags was born from a simple frustration: planning travel shouldn't be overwhelming. Our founders, seasoned travelers and tech enthusiasts, noticed that despite countless travel websites, people still struggled to discover destinations that truly matched their interests and budgets.
              </p>
              <p className="text-lg">
                In 2024, we set out to change that. By combining artificial intelligence with human-curated travel insights, we created a platform that doesn't just show you popular destinations—it understands your unique travel style and recommends places you'll genuinely love.
              </p>
              <p className="text-lg">
                Today, PackYourBags serves thousands of travelers worldwide, from budget backpackers to luxury seekers, helping them discover hidden gems and plan unforgettable journeys. Our AI-powered roulette feature has become a favorite for those seeking spontaneous adventure, while our personalized itineraries save hours of research time.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: '🎰 AI Travel Roulette',
                  description: 'Spin the wheel and discover exciting destinations matched to your budget and preferences.'
                },
                {
                  title: '🤖 Smart Itinerary Builder',
                  description: 'Generate day-by-day travel plans with AI-powered recommendations tailored to your interests.'
                },
                {
                  title: '📝 Travel Blogs & Guides',
                  description: 'Access in-depth destination guides and travel stories to inspire your next adventure.'
                },
                {
                  title: '💎 Personalized Recommendations',
                  description: 'Get destination suggestions that match your unique travel style and preferences.'
                },
                {
                  title: '💬 AI Travel Assistant',
                  description: 'Chat with our AI assistant for instant answers to all your travel questions.'
                },
                {
                  title: '📧 Curated Travel Offers',
                  description: 'Receive exclusive deals and personalized offers delivered to your inbox.'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Stats */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-3xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-12">By the Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: 'Destinations', value: '500+' },
                  { label: 'Active Users', value: '50K+' },
                  { label: 'AI Itineraries', value: '100K+' },
                  { label: 'Countries', value: '150+' }
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-white/90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Powered by AI</h2>
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our platform leverages state-of-the-art artificial intelligence to analyze millions of data points—from weather patterns and seasonal trends to user preferences and budget constraints—delivering personalized recommendations with remarkable accuracy.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We partner with leading AI providers to ensure our recommendations are not only accurate but continuously improving. Every interaction helps our algorithms better understand what makes a great travel experience for you.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 rounded-3xl p-12">
            <Users className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Become part of a global community of explorers. Subscribe for personalized travel recommendations and exclusive offers.
            </p>
            <Link 
              to="/#subscribe"
              className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-bold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Footer Links */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-8">
              <Link to="/terms" className="text-gray-600 hover:text-gray-900 font-medium">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-600 hover:text-gray-900 font-medium">
                Privacy Policy
              </Link>
              <Link to="/#subscribe" className="text-gray-600 hover:text-gray-900 font-medium">
                Subscribe
              </Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900 font-medium">
                Travel Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs
