import React from 'react';
import Hero from '../components/HeroV2';
import HowItWorksStrip from '../components/HowItWorksStrip';
import ArcadeTeaser from '../components/ArcadeTeaser';
import RouletteSection from '../components/RouletteSection';
import FeaturedDestinations from '../components/FeaturedDestinations';
import AsSeenIn from '../components/AsSeenIn';
import AIHighlight from '../components/AIHighlightV2';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import SEO from '../components/SEOHead';
import StructuredData, { OrganizationSchema, WebSiteSchema } from '../components/StructuredData';
import CurrencyTicker from '../components/CurrencyTicker';

const HomePage = ({ user }) => {
    return (
        <div className="bg-transparent overflow-hidden">
            <SEO />
            <StructuredData data={OrganizationSchema} />
            <StructuredData data={WebSiteSchema} />
            <Hero />
            <HowItWorksStrip />

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
