import React from 'react';
import Hero from '../components/Hero';
import ArcadeTeaser from '../components/ArcadeTeaser';
import RouletteSection from '../components/RouletteSection';
import FeaturedDestinations from '../components/FeaturedDestinations';
import AsSeenIn from '../components/AsSeenIn';
import AIHighlight from '../components/AIHighlight';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import SEO from '../components/SEOHead';
import StructuredData, { OrganizationSchema, WebSiteSchema } from '../components/StructuredData';
import CurrencyTicker from '../components/CurrencyTicker';

const HomePage = ({ user }) => {
    return (
        <div className="bg-transparent overflow-hidden">
            <SEO
                title="AI Travel Planner & Itinerary Organizer 2025"
                description="Plan your perfect trip with PackYourBags. AI-powered itineraries, hidden gems, and the best travel deals for 2025."
                keywords={["AI travel planner", "custom itineraries", "trip organizer", "2025 travel guide", "hidden gems", "sustainable travel"]}
            />
            <StructuredData data={OrganizationSchema} />
            <StructuredData data={WebSiteSchema} />
            <Hero />

            <RouletteSection user={user} />

            {/* Live Currency Feed Section */}
            <div className="relative z-10 mb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CurrencyTicker />
            </div>

            <ArcadeTeaser />

            <FeaturedDestinations user={user} />
            <AsSeenIn />
            <AIHighlight />

            <Testimonials />
            <Newsletter />
        </div>
    );
};

export default HomePage;
