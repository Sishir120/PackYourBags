import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Share2,
    Facebook,
    Twitter,
    Linkedin,
    MapPin,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/lightswind/button'
import SEOHead from '../components/SEOHead'
import DestinationBlogCard from '../components/DestinationBlogCard'
import { mockDestinations } from '../data/mockDestinations'

const DestinationBlogPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [showShareMenu, setShowShareMenu] = useState(false)

    const destination = mockDestinations.find(
        d => d.destination_id === id || d.id === id || d.slug === id
    )

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    if (!destination) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-neutral-900 mb-4">Blog Not Found</h1>
                    <Button onClick={() => navigate('/destinations')}>
                        Back to Destinations
                    </Button>
                </div>
            </div>
        )
    }

    const {
        name,
        country,
        continent,
        image_url,
        blog_title,
        blog_content,
        blog_excerpt,
        blog_meta_description,
        blog_keywords,
        blog_author,
        blog_published_date,
        blog_reading_time,
        description,
        highlights,
        local_tips,
        best_season,
        quick_fact
    } = destination

    // Generate blog metadata
    const title = blog_title || `${name} Travel Guide 2025 | Complete Visitor's Guide`
    const metaDescription = blog_meta_description || `Discover the ultimate ${name} travel guide. Top attractions, local tips, best time to visit, and insider secrets for an unforgettable ${country} adventure.`
    const keywords = blog_keywords || [
        `${name} travel guide`,
        `visit ${name}`,
        `${name} tourism`,
        `${country} destinations`,
        `things to do in ${name}`,
        `${name} attractions`,
        `${name} travel tips`,
        `${continent} travel`
    ]
    const author = blog_author || 'PackYourBags Travel Team'
    const publishedDate = blog_published_date || new Date().toISOString()
    const readingTime = blog_reading_time || '8 min read'
    const blogUrl = `/destination/${id}/blog`

    // Structured data for Article
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": metaDescription,
        "image": image_url,
        "author": {
            "@type": "Person",
            "name": author
        },
        "publisher": {
            "@type": "Organization",
            "name": "PackYourBags",
            "logo": {
                "@type": "ImageObject",
                "url": "https://packyourbags.com/logo.png"
            }
        },
        "datePublished": publishedDate,
        "dateModified": publishedDate,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://packyourbags.com${blogUrl}`
        }
    }

    // Share functions
    const shareUrl = `https://packyourbags.com${blogUrl}`
    const shareTitle = title

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    }

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank')
    }

    const shareOnLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
    }

    // Related destinations (same continent, excluding current)
    const relatedDestinations = mockDestinations
        .filter(d => d.continent === continent && d.destination_id !== id)
        .slice(0, 3)

    return (
        <>
            <SEOHead
                title={title}
                description={metaDescription}
                keywords={keywords}
                image={image_url}
                url={blogUrl}
                type="article"
                author={author}
                publishedDate={publishedDate}
                modifiedDate={publishedDate}
                structuredData={structuredData}
                canonicalUrl={`https://packyourbags.com${blogUrl}`}
            />

            <div className="min-h-screen bg-neutral-50">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[400px] max-h-[600px]">
                    <img
                        src={image_url}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Breadcrumb */}
                    <div className="absolute top-8 left-0 right-0 max-w-4xl mx-auto px-6">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link to="/destinations" className="hover:text-white transition-colors">Destinations</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link to={`/destination/${id}`} className="hover:text-white transition-colors">{name}</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white">Travel Guide</span>
                        </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-2 text-white/90 mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{country}, {continent}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
                                    {title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
                                    <span className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {author}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(publishedDate).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {readingTime}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        {/* Share Buttons */}
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-neutral-200">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-neutral-600">Share this guide:</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={shareOnFacebook}
                                        className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                        aria-label="Share on Facebook"
                                    >
                                        <Facebook className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={shareOnTwitter}
                                        className="p-2 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                                        aria-label="Share on Twitter"
                                    >
                                        <Twitter className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={shareOnLinkedIn}
                                        className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                        aria-label="Share on LinkedIn"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <article className="prose prose-lg max-w-none">
                            {/* Introduction */}
                            <p className="text-xl text-neutral-700 leading-relaxed mb-8">
                                {blog_excerpt || description || quick_fact}
                            </p>

                            {/* Main Highlights */}
                            {highlights && highlights.length > 0 && (
                                <div className="my-8">
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-4 font-display">
                                        Top Attractions in {name}
                                    </h2>
                                    <ul className="space-y-2">
                                        {highlights.map((highlight, index) => (
                                            <li key={index} className="text-neutral-700">{highlight}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Best Time to Visit */}
                            {best_season && (
                                <div className="my-8">
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-4 font-display">
                                        Best Time to Visit
                                    </h2>
                                    <p className="text-neutral-700">{best_season}</p>
                                </div>
                            )}

                            {/* Local Tips */}
                            {local_tips && local_tips.length > 0 && (
                                <div className="my-8">
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-4 font-display">
                                        Insider Tips for {name}
                                    </h2>
                                    <ul className="space-y-3">
                                        {local_tips.map((tip, index) => (
                                            <li key={index} className="text-neutral-700">{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Call to Action */}
                            <div className="mt-12 p-6 bg-primary-50 rounded-xl border border-primary-100">
                                <h3 className="text-xl font-bold text-neutral-900 mb-3 font-display">
                                    Ready to Explore {name}?
                                </h3>
                                <p className="text-neutral-700 mb-4">
                                    Start planning your adventure today with our comprehensive destination guide and booking options.
                                </p>
                                <div className="flex gap-3">
                                    <Link to={`/destination/${id}`}>
                                        <Button className="bg-primary-600 hover:bg-primary-700">
                                            View Destination Details
                                        </Button>
                                    </Link>
                                    <a
                                        href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline">
                                            Find Accommodations
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Related Destinations */}
                    {relatedDestinations.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-3xl font-bold text-neutral-900 mb-8 font-display">
                                More {continent} Travel Guides
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedDestinations.map(dest => (
                                    <DestinationBlogCard key={dest.destination_id} destination={dest} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default DestinationBlogPage
