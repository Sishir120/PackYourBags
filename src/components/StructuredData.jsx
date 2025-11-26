import React from 'react'
import { Helmet } from 'react-helmet-async'

/**
 * StructuredData Component
 * Injects JSON-LD structured data into the page for better SEO
 */
const StructuredData = ({ data }) => {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(data)}
            </script>
        </Helmet>
    )
}

// Predefined schemas for common use cases

export const OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PackYourBags",
    "description": "AI-powered travel planning platform with personalized itineraries, destination guides, and travel games",
    "url": "https://packyourbags.vercel.app",
    "logo": "https://packyourbags.vercel.app/logo.png",
    "sameAs": [
        "https://facebook.com/packyourbags",
        "https://twitter.com/packyourbags",
        "https://instagram.com/packyourbags"
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "support@packyourbags.com"
    }
}

export const WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PackYourBags",
    "url": "https://packyourbags.vercel.app",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://packyourbags.vercel.app/destinations?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
    }
}

export const createBreadcrumbSchema = (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `https://packyourbags.vercel.app${item.url}`
    }))
})

export const createTouristDestinationSchema = (destination) => ({
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": destination.name,
    "description": destination.description || destination.quick_fact,
    "image": destination.image_url,
    "address": {
        "@type": "PostalAddress",
        "addressCountry": destination.country,
        "addressLocality": destination.location
    },
    "geo": destination.coordinates ? {
        "@type": "GeoCoordinates",
        "latitude": destination.coordinates.lat,
        "longitude": destination.coordinates.lng
    } : undefined,
    "touristType": destination.budget_tier,
    "aggregateRating": destination.rating ? {
        "@type": "AggregateRating",
        "ratingValue": destination.rating,
        "reviewCount": destination.review_count || 100
    } : undefined
})

export const createArticleSchema = (article) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "author": {
        "@type": "Person",
        "name": article.author || "PackYourBags Travel Team"
    },
    "publisher": {
        "@type": "Organization",
        "name": "PackYourBags",
        "logo": {
            "@type": "ImageObject",
            "url": "https://packyourbags.vercel.app/logo.png"
        }
    },
    "datePublished": article.publishedDate,
    "dateModified": article.modifiedDate || article.publishedDate
})

export default StructuredData
