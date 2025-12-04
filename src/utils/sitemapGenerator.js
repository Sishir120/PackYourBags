import { mockDestinations } from '../data/mockDestinations.js'

const SITE_URL = 'https://packyourbags.vercel.app'

// Static pages
const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/ai-trip-planner', changefreq: 'weekly', priority: 0.9 }, // Pillar page
    { url: '/nepal-travel-itineraries', changefreq: 'weekly', priority: 0.9 }, // Hub page
    { url: '/bali-travel-itineraries', changefreq: 'weekly', priority: 0.9 }, // Hub page
    { url: '/japan-travel-itineraries', changefreq: 'weekly', priority: 0.9 }, // Hub page
    { url: '/itineraries/pokhara-4-days', changefreq: 'monthly', priority: 0.8 }, // Money page
    { url: '/tools/group-trip-cost-splitter', changefreq: 'monthly', priority: 0.8 }, // Tool page
    { url: '/destinations', changefreq: 'daily', priority: 0.9 },
    { url: '/blog', changefreq: 'weekly', priority: 0.8 },
    { url: '/arcade', changefreq: 'weekly', priority: 0.7 },
    { url: '/price-tracker', changefreq: 'daily', priority: 0.7 },
    { url: '/ai-chat', changefreq: 'monthly', priority: 0.6 },
    { url: '/subscription', changefreq: 'monthly', priority: 0.6 },
    { url: '/about', changefreq: 'monthly', priority: 0.5 },
    { url: '/terms', changefreq: 'yearly', priority: 0.3 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
]

// Arcade game pages
const arcadePages = [
    '/arcade/marble-race',
    '/arcade/bingo',
    '/arcade/who-pays',
    '/arcade/geo-master',
    '/arcade/hangman',
    '/arcade/roulette',
    '/arcade/plinko',
].map(url => ({ url, changefreq: 'weekly', priority: 0.6 }))

// Generate destination pages
const destinationPages = mockDestinations.map(dest => ({
    url: `/destination/${dest.destination_id || dest.id}`,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
}))

// Generate destination blog pages
const blogPages = mockDestinations.map(dest => ({
    url: `/destination/${dest.destination_id || dest.id}/blog`,
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0]
}))

// Combine all pages
const allPages = [
    ...staticPages,
    ...arcadePages,
    ...destinationPages,
    ...blogPages,
]

// Generate XML sitemap
export function generateSitemap() {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return xml
}

// For Node.js script usage
const isMainModule = process.argv[1].replace(/\\/g, '/').endsWith('src/utils/sitemapGenerator.js');
if (typeof process !== 'undefined' && isMainModule) {
    import('fs').then(fs => {
        const sitemap = generateSitemap()
        fs.writeFileSync('./public/sitemap.xml', sitemap)
        console.log('✅ Sitemap generated successfully at public/sitemap.xml')
        console.log(`📊 Total URLs: ${allPages.length}`)
    })
}
