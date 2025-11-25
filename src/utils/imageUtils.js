/**
 * Pexels API Integration for Real, Consistent, Copyright-Free Images
 * Get your free API key at: https://www.pexels.com/api/
 */

// IMPORTANT: Get your free API key from https://www.pexels.com/api/
// Add it to your .env file as: VITE_PEXELS_API_KEY=your_key_here
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || '563492ad6f91700001000001d8f6c1e8c4d94f6e8b5c8e8f8f8f8f8f';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Cache for storing fetched images to avoid repeated API calls
const imageCache = new Map();

/**
 * Search for a specific image on Pexels
 * @param {string} query - Search query
 * @param {number} perPage - Number of results
 * @returns {Promise<string|null>} Image URL or null
 */
export const fetchPexelsImage = async (query, perPage = 1) => {
    // Check cache first
    const cacheKey = `${query}-${perPage}`;
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey);
    }

    try {
        const response = await fetch(
            `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            }
        );

        if (!response.ok) {
            console.warn('Pexels API request failed:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            const imageUrl = data.photos[0].src.large2x || data.photos[0].src.large;

            // Cache the result
            imageCache.set(cacheKey, imageUrl);

            return imageUrl;
        }

        return null;
    } catch (error) {
        console.error('Error fetching from Pexels:', error);
        return null;
    }
};

/**
 * Get destination image with fallback
 * @param {string} destinationName - Destination name
 * @param {string} country - Country name
 * @param {string} existingUrl - Existing image URL
 * @returns {Promise<string>} Image URL
 */
export const getDestinationImage = async (destinationName, country, existingUrl = null) => {
    // If existing URL is valid, use it
    if (existingUrl && existingUrl.startsWith('http')) {
        return existingUrl;
    }

    // Try to fetch from Pexels
    const query = `${destinationName} ${country} landmark travel`;
    const pexelsImage = await fetchPexelsImage(query);

    if (pexelsImage) {
        return pexelsImage;
    }

    // Fallback to curated Unsplash images
    return getCuratedUnsplashImage(destinationName);
};

/**
 * Get blog image
 * @param {string} topic - Blog topic
 * @returns {Promise<string>} Image URL
 */
export const getBlogImage = async (topic) => {
    const query = `${topic} travel destination`;
    const pexelsImage = await fetchPexelsImage(query);

    if (pexelsImage) {
        return pexelsImage;
    }

    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80';
};

/**
 * Curated Unsplash images as fallback (no API key needed)
 */
const curatedUnsplashImages = {
    // Nepal
    'pokhara': 'https://images.unsplash.com/photo-1582692119782-7c891b3c489a?w=1200&h=800&fit=crop&q=80',
    'kathmandu': 'https://images.unsplash.com/photo-1596150683813-3984b33a9d63?w=1200&h=800&fit=crop&q=80',
    'chitwan': 'https://images.unsplash.com/photo-1583899206887-b580f1b81543?w=1200&h=800&fit=crop&q=80',

    // Asia
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=800&fit=crop&q=80',
    'kyoto': 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&h=800&fit=crop&q=80',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=800&fit=crop&q=80',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=800&fit=crop&q=80',
    'bangkok': 'https://images.unsplash.com/photo-1563492065-56fd5861f1d7?w=1200&h=800&fit=crop&q=80',
    'hanoi': 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=1200&h=800&fit=crop&q=80',
    'seoul': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&h=800&fit=crop&q=80',

    // Europe
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop&q=80',
    'london': 'https://images.unsplash.com/photo-1513635269190-d10b2e9a0e3e?w=1200&h=800&fit=crop&q=80',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=800&fit=crop&q=80',
    'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&h=800&fit=crop&q=80',
    'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=800&fit=crop&q=80',
    'prague': 'https://images.unsplash.com/photo-1583881262487-5b34b9a1517a?w=1200&h=800&fit=crop&q=80',
    'porto': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&h=800&fit=crop&q=80',
    'reykjavik': 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&h=800&fit=crop&q=80',
    'dubrovnik': 'https://images.unsplash.com/photo-1562214526-2e3348c1313a?w=1200&h=800&fit=crop&q=80',
    'venice': 'https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?w=1200&h=800&fit=crop&q=80',

    // Americas
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e3?w=1200&h=800&fit=crop&q=80',
    'san francisco': 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=1200&h=800&fit=crop&q=80',
    'los angeles': 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=1200&h=800&fit=crop&q=80',
    'cancun': 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=1200&h=800&fit=crop&q=80',
    'rio de janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&h=800&fit=crop&q=80',

    // Middle East & Africa
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop&q=80',
    'marrakech': 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&h=800&fit=crop&q=80',

    // Oceania
    'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&h=800&fit=crop&q=80',
    'melbourne': 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1200&h=800&fit=crop&q=80'
};

/**
 * Get curated Unsplash image as fallback
 * @param {string} destinationName - Destination name
 * @returns {string} Image URL
 */
const getCuratedUnsplashImage = (destinationName) => {
    const key = destinationName.toLowerCase().trim();
    return curatedUnsplashImages[key] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop&q=80';
};

/**
 * Handle image loading errors
 * @param {Event} event - Error event
 */
export const handleImageError = (event) => {
    event.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop&q=80';
    event.target.onerror = null;
};

/**
 * Preload images for a list of destinations
 * @param {Array} destinations - Array of destination objects
 */
export const preloadDestinationImages = async (destinations) => {
    const promises = destinations.slice(0, 10).map(dest =>
        getDestinationImage(dest.name, dest.country, dest.image_url)
    );

    await Promise.allSettled(promises);
};

export default {
    getDestinationImage,
    getBlogImage,
    handleImageError,
    fetchPexelsImage,
    preloadDestinationImages
};
