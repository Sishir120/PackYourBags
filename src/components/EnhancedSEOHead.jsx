import React from 'react'
import { Helmet } from 'react-helmet-async'

/**
 * EnhancedSEOHead Component
 * Comprehensive SEO meta tags including Open Graph, Twitter Cards, and canonical URLs
 */
const EnhancedSEOHead = ({
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    author,
    publishedDate,
    modifiedDate,
    canonicalUrl,
    noindex = false,
    nofollow = false,
}) => {
    const siteUrl = 'https://packyourbags.vercel.app'
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl
    const canonical = canonicalUrl || fullUrl
    const defaultImage = `${siteUrl}/og-image.png`
    const ogImage = image || defaultImage

    // Construct full title
    const fullTitle = title.includes('PackYourBags') ? title : `${title} | PackYourBags`

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords.length > 0 && (
                <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />
            )}
            {author && <meta name="author" content={author} />}

            {/* Canonical URL */}
            <link rel="canonical" href={canonical} />

            {/* Robots */}
            {(noindex || nofollow) && (
                <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} />
            )}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="PackYourBags" />
            <meta property="og:locale" content="en_US" />

            {/* Article specific */}
            {type === 'article' && publishedDate && (
                <>
                    <meta property="article:published_time" content={publishedDate} />
                    {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
                    {author && <meta property="article:author" content={author} />}
                </>
            )}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:site" content="@packyourbags" />
            <meta name="twitter:creator" content="@packyourbags" />

            {/* Additional SEO */}
            <meta name="theme-color" content="#2563eb" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="PackYourBags" />
        </Helmet>
    )
}

export default EnhancedSEOHead
