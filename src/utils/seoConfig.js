/**
 * Centralized SEO Configuration
 * Maps routes to their SEO metadata (title, description, keywords, etc.)
 */

const SITE_NAME = 'PackYourBags';
const SITE_URL = 'https://packyourbags.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.jpg`; // Ensure this image exists or use a placeholder

export const getSeoMeta = (path, params = {}) => {
    const meta = {
        title: `${SITE_NAME} - AI Travel Planner & Itinerary Builder`,
        description: 'Plan your perfect trip with our AI-powered travel planner. Generate custom itineraries, split costs, and discover hidden gems in Nepal, Bali, and Japan.',
        canonical: `${SITE_URL}${path}`,
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: `${SITE_URL}${path}`,
            site_name: SITE_NAME,
            images: [
                {
                    url: DEFAULT_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: 'PackYourBags AI Travel Planner',
                },
            ],
        },
        twitter: {
            handle: '@packyourbags', // Replace with actual handle if available
            site: '@packyourbags',
            cardType: 'summary_large_image',
        },
    };

    // Route-specific overrides
    switch (path) {
        case '/':
            meta.title = 'AI Travel Planner & Itinerary Builder for Smarter Trips | PackYourBags';
            meta.description = 'The ultimate AI trip planner. Create gamified travel itineraries, split group costs, and explore Nepal, Bali, and Japan like a pro.';
            break;

        case '/ai-trip-planner':
            meta.title = 'AI Trip Planner: How to Plan Your Perfect Trip with AI';
            meta.description = 'Learn how to use an AI trip planner to save time and money. Our AI itinerary builder creates personalized travel plans in seconds.';
            break;

        case '/nepal-travel-itineraries':
            meta.title = 'Nepal Travel Itineraries & Trip Planner | PackYourBags';
            meta.description = 'Explore the best Nepal travel itineraries. From Pokhara to Kathmandu, plan your perfect Nepal trip with our AI itinerary builder.';
            break;

        case '/tools/group-trip-cost-splitter':
            meta.title = 'Group Trip Cost Splitter - Fairly Divide Travel Expenses';
            meta.description = 'Easily split travel costs with friends. Our group trip cost splitter calculates who owes what, making travel budgeting stress-free.';
            break;

        // Dynamic routes handling (examples)
        // You would typically pass the specific data in 'params' to populate these
        default:
            if (path.startsWith('/itineraries/')) {
                // Example fallback for itinerary pages if not specifically handled
                // In a real app, you might fetch the itinerary title here or pass it in params
                if (params.title) {
                    meta.title = `${params.title} | PackYourBags`;
                }
                if (params.description) {
                    meta.description = params.description;
                }
            }
            break;
    }

    return meta;
};
