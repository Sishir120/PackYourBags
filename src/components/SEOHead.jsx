import React from 'react'
import { Helmet } from 'react-helmet-async'

/**
 * SEOHead Component - Comprehensive SEO optimization
 * Handles meta tags, Open Graph, Twitter Cards, and structured data
 */
const SEOHead = ({
    title = "PackYourBags - AI Travel Planner & Itinerary Builder 2025",
    description = "Generate personalized travel itineraries with our AI trip planner. Discover destinations like Pokhara, Bali, and Paris, and plan your perfect adventure by budget and style.",
    keywords = [],
    image,
    url,
    type = 'website',
    author,
    publishedDate,
    modifiedDate,
    structuredData,
    canonicalUrl
}) => {
    const siteUrl = 'https://packyourbags.app'
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl
    const fullImageUrl = image?.startsWith('http') ? image : `${siteUrl}${image}`
    const finalCanonicalUrl = canonicalUrl || fullUrl

    // Default structured data for website
    const defaultStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PackYourBags",
        "url": siteUrl,
        "description": "AI-powered travel planning with gamified destination discovery"
    }

    const finalStructuredData = structuredData || defaultStructuredData

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
            {author && <meta name="author" content={author} />}

            {/* Canonical URL */}
            <link rel="canonical" href={finalCanonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={fullImageUrl} />}
            {image && <meta property="og:image:width" content="1200" />}
            {image && <meta property="og:image:height" content="630" />}
            <meta property="og:site_name" content="PackYourBags" />
            {publishedDate && <meta property="article:published_time" content={publishedDate} />}
            {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
            {author && <meta property="article:author" content={author} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={fullImageUrl} />}
            <meta name="twitter:creator" content="@PackYourBags" />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(finalStructuredData)}
            </script>

            {/* Additional SEO */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
        </Helmet>
    )
}

export default SEOHead
