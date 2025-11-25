/**
 * Centralized Destination Images Mapping
 * 
 * This file serves as the single source of truth for all destination images.
 * Update image URLs here and they will automatically propagate to:
 * - Destination cards (mockDestinations.js)
 * - Blog posts (mockBlogs.js)
 * - GeoMaster game (GeoMaster.jsx)
 */

export const destinationImages = {
    // Main Destinations
    'pokhara-nepal': '/images/destinations/pokhara-nepal.jpg',
    'kathmandu-nepal': '/images/destinations/kathmandu-nepal.jpg',
    'chitwan-national-park-nepal': '/images/destinations/chitwan-nepal.jpg',
    'bali-indonesia': '/images/destinations/bali-indonesia.jpg',
    'kyoto-japan': '/images/destinations/kyoto-japan.jpg',
    'hanoi-vietnam': '/images/destinations/hanoi-vietnam.jpg',
    'porto-portugal': '/images/destinations/porto-portugal.jpg',
    'reykjavik-iceland': '/images/destinations/reykjavik-iceland.jpg',
    'dubrovnik-croatia': '/images/destinations/dubrovnik-croatia.jpg',
    'prague-czech-republic': '/images/destinations/prague-czech-republic.jpg',

    // GeoMaster Game Locations
    'santorini-greece': '/images/destinations/santorini-greece.jpg',
    'machu-picchu-peru': '/images/destinations/machu-picchu-peru.jpg',
    'great-wall-china': '/images/destinations/great-wall-china.jpg',
    'taj-mahal-india': '/images/destinations/taj-mahal-india.jpg',
    'eiffel-tower-france': '/images/destinations/eiffel-tower-france.jpg',
    'banff-canada': '/images/destinations/banff,canada.jpg',
    'petra-jordan': '/images/destinations/Petra,Jordan.jpg',
    'great-barrier-reef-australia': '/images/destinations/Great Barrier Reef, Austrailia.jpg',
};

/**
 * Get destination image URL by slug
 * @param {string} slug - Destination slug (e.g., 'pokhara-nepal')
 * @returns {string} Image URL or empty string if not found
 */
export const getDestinationImage = (slug) => {
    return destinationImages[slug] || '';
};

/**
 * Get all destination images
 * @returns {Object} All destination images mapping
 */
export const getAllDestinationImages = () => {
    return { ...destinationImages };
};
