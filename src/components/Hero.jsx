import React, { useState } from 'react'
import { Search, MapPin, TrendingUp, ArrowRight, Sparkles, Compass, Map, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchSuggestions from './SearchSuggestions'

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm) {
      navigate(`/destinations?search=${encodeURIComponent(searchTerm)}`)
    } else {
      navigate('/destinations')
    }
    setShowSuggestions(false)
  }

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    navigate(`/destinations?search=${encodeURIComponent(suggestion)}`)
  }

  const handleExploreClick = () => {
    navigate('/destinations')
  }

  // Floating animation variants
  const floatingVariant = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 -mt-20 pt-20 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center text-center py-20 md:py-32">

          {/* Gamified Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg mb-8 border border-amber-200 hover:scale-105 transition-transform cursor-default"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-neutral-900 tracking-wide">
              Level Up Your Travel Game
            </span>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Beta
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-neutral-900">Start Your Ultimate</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-amber-500">
              Travel Quest
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-neutral-800 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Unlock exclusive destinations, earn travel XP, and spin the roulette to discover your next adventure.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-3xl relative mb-8"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col md:flex-row gap-3 p-2 bg-white rounded-xl shadow-xl border border-neutral-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <Search className="w-5 h-5 text-primary-500" />
                  <input
                    type="text"
                    placeholder="Where will your quest take you?"
                    className="w-full text-base text-neutral-900 placeholder-neutral-400 outline-none bg-transparent font-medium"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    aria-label="Search for travel destinations worldwide"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg whitespace-nowrap bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-600/20"
                  aria-label="Search destinations"
                >
                  <Search className="w-5 h-5" />
                  <span>Find Quest</span>
                </button>
              </div>
            </form>

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30">
                <SearchSuggestions
                  searchTerm={searchTerm}
                  onSelect={handleSuggestionSelect}
                />
              </div>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={handleExploreClick}
              className="px-8 py-4 bg-white text-neutral-900 border border-neutral-200 rounded-full font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 group"
              aria-label="Browse all travel destinations"
            >
              <span>Explore World Map</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/price-tracker')}
              className="text-neutral-700 hover:text-primary-600 font-semibold flex items-center gap-2 px-4 transition-colors"
              aria-label="Track travel prices and find best deals"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Loot & Deals</span>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-neutral-600 font-medium"
          >
            <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>150+ Quests Available</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span>Verified Rewards</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
              <span>Best Price Guarantee</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gamified Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          variants={floatingVariant}
          initial="initial"
          animate="animate"
          className="absolute top-20 left-[10%] text-primary-200 opacity-50"
        >
          <Compass className="w-24 h-24 rotate-12" />
        </motion.div>
        <motion.div
          variants={floatingVariant}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute bottom-40 right-[10%] text-amber-200 opacity-50"
        >
          <Map className="w-32 h-32 -rotate-12" />
        </motion.div>
        <motion.div
          variants={floatingVariant}
          initial="initial"
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute top-40 right-[20%] text-primary-100 opacity-40"
        >
          <Ticket className="w-16 h-16 rotate-45" />
        </motion.div>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  )
}

export default Hero