import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Heart, ArrowRight, Calendar, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/lightswind/button'
import { addFavorite, removeFavorite } from '../utils/destinationApi'
import { ensureBrandVoice } from '../utils/brandVoice'
import { handleImageError as handleImgError } from '../utils/imageUtils'

const DestinationCard = React.memo(({ destination, user, onFavoriteToggle, isFavorite: propIsFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [internalIsFavorite, setInternalIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState(null)

  const isFavorite = propIsFavorite !== undefined ? propIsFavorite : internalIsFavorite

  const {
    destination_id,
    id,
    name,
    location,
    country,
    continent,
    description,
    price,
    price_range,
    rating,
    review_count,
    images,
    image_url,
    duration = "5-7 days",
    budget_tier,
    quick_fact,
    best_season
  } = destination

  const destId = destination_id || id

  // Use image_url from destination data (comes from destinationImages.js)
  // Fallback to Unsplash if no image_url is provided
  const fallbackImage = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90`

  const imageList = (images && images.length > 0)
    ? images.filter(img => img && img.trim() !== '')
    : [image_url || fallbackImage]

  const validatedImages = React.useMemo(() =>
    imageList.length > 0 ? imageList : [fallbackImage],
    [imageList, fallbackImage]
  )

  useEffect(() => {
    if (user && propIsFavorite === undefined) {
      // Logic to check if favorite would go here
    }
  }, [user, destId, propIsFavorite])

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (onFavoriteToggle) {
      onFavoriteToggle(destId)
      return
    }

    if (!user) {
      alert('Please sign in to save favorites')
      return
    }

    try {
      if (isFavorite) {
        if (favoriteId) {
          await removeFavorite(user.id, favoriteId)
        }
        setInternalIsFavorite(false)
        setFavoriteId(null)
      } else {
        const response = await addFavorite(user.id, destId)
        if (response.success) {
          setInternalIsFavorite(true)
          setFavoriteId(response.favorite.id)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const nextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % validatedImages.length)
  }

  const prevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + validatedImages.length) % validatedImages.length)
  }

  const handleImageErrorLocal = (e) => {
    handleImgError(e)
  }

  const displayPrice = price || (price_range ? price_range.min : 1499)

  // Generate a random "Match Score" for gamification feel (90-99%)
  const matchScore = React.useMemo(() => Math.floor(Math.random() * 10) + 90, [destId])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-neutral-200 hover:border-primary-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel */}
      <div className="relative h-64 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={validatedImages[currentImageIndex]}
            alt={name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageErrorLocal}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {validatedImages.length > 1 && isHovered && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {validatedImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 left-3 flex gap-2 flex-wrap max-w-[70%]">
          {/* Gamified Match Score Badge */}
          <span className="px-2 py-1 text-xs font-bold bg-primary-600 text-white rounded-lg shadow-sm flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {matchScore}% Match
          </span>

          {budget_tier && (
            <span className="px-2 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-primary-700 rounded-lg shadow-sm capitalize">
              {budget_tier.replace('-', ' ')}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${isFavorite
              ? 'bg-red-500 text-white shadow-lg scale-110'
              : 'bg-white/20 text-white hover:bg-white/40'
              }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 font-display leading-tight mb-1 group-hover:text-primary-600 transition-colors">
              {name}
            </h3>
            <div className="flex items-center text-neutral-500 text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1 text-primary-500" />
              {location || country}
              {continent && <span className="mx-1">•</span>}
              {continent}
            </div>
          </div>
          {rating && (
            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current mr-1" />
              <span className="text-sm font-bold text-amber-700">{rating}</span>
            </div>
          )}
        </div>

        <p className="text-neutral-600 text-sm line-clamp-2 mb-4 font-inter">
          {ensureBrandVoice(quick_fact || description || 'Discover this amazing destination.')}
        </p>

        {best_season && (
          <div className="flex items-center gap-2 mb-4 text-xs bg-primary-50 text-primary-800 px-3 py-1.5 rounded-lg w-fit">
            <Calendar className="w-3.5 h-3.5" />
            <span>Best time: {best_season}</span>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-0.5">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary-600 font-display">
                {price_range ? `$${price_range.min.toLocaleString()}` : `$${displayPrice.toLocaleString()}`}
              </span>
              <span className="text-xs text-neutral-400">/ person</span>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex"
            >
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Book Now
              </Button>
            </a>
            <Link to={`/destination/${destId}`}>
              <Button
                size="sm"
                className="rounded-xl bg-neutral-900 text-white hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
              >
                View Quest <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

DestinationCard.displayName = 'DestinationCard'

export default DestinationCard