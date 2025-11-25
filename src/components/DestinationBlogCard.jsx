import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/lightswind/button'

/**
 * DestinationBlogCard - Preview card for destination blog posts
 */
const DestinationBlogCard = React.memo(({ destination, compact = false }) => {
    const {
        destination_id,
        id,
        name,
        image_url,
        blog_title,
        blog_excerpt,
        blog_reading_time,
        blog_published_date,
        blog_author
    } = destination

    const destId = destination_id || id

    // Generate blog metadata if not provided
    const title = blog_title || `Complete Travel Guide to ${name}`
    const excerpt = blog_excerpt || `Discover everything you need to know about visiting ${name}. From top attractions to local tips, plan your perfect adventure.`
    const readingTime = blog_reading_time || '8 min read'
    const publishedDate = blog_published_date || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const author = blog_author || 'PackYourBags Team'

    if (compact) {
        return (
            <Link to={`/destination/${destId}/blog`}>
                <motion.div
                    whileHover={{ y: -2 }}
                    className="flex gap-4 p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                >
                    <img
                        src={image_url}
                        alt={name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-neutral-900 mb-1 line-clamp-2 text-sm">
                            {title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {readingTime}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </Link>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200 hover:border-primary-200"
        >
            {/* Featured Image */}
            <Link to={`/destination/${destId}/blog`}>
                <div className="relative h-56 overflow-hidden">
                    <motion.img
                        src={image_url}
                        alt={name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full shadow-lg">
                            Travel Guide
                        </span>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                    <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {author}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {readingTime}
                    </span>
                </div>

                {/* Title */}
                <Link to={`/destination/${destId}/blog`}>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors font-display">
                        {title}
                    </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-neutral-600 text-sm line-clamp-3 mb-4 font-inter">
                    {excerpt}
                </p>

                {/* Read More Button */}
                <Link to={`/destination/${destId}/blog`}>
                    <Button
                        variant="ghost"
                        className="group/btn p-0 h-auto text-primary-600 hover:text-primary-700 font-semibold"
                    >
                        Read Full Guide
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </motion.div>
    )
})

DestinationBlogCard.displayName = 'DestinationBlogCard'

export default DestinationBlogCard
