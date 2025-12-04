import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Mountain, Coffee, Camera } from 'lucide-react';
import SEO from '../components/SEO';
import Newsletter from '../components/Newsletter';

const DestinationHub = ({ destination, itineraries }) => {
    if (!destination || !itineraries) return null;

    return (
        <div className="bg-white">
            <SEO
                title={destination.title}
                description={destination.description}
                image={destination.heroImage}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px]">
                <img
                    src={destination.heroImage}
                    alt={destination.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center px-4">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{destination.title}</h1>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{destination.description}</p>
                        <button className="btn btn-primary btn-lg">
                            Plan My Nepal Trip with AI
                        </button>
                    </div>
                </div>
            </div>

            {/* Intro Content */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-6">Why Visit Nepal?</h2>
                    <p className="text-lg text-neutral-700 mb-8">
                        Nepal is more than just Mount Everest. It's a land of ancient temples, vibrant culture, and breathtaking landscapes. Whether you're a trekker, a spiritual seeker, or a luxury traveler, our <strong>Nepal travel itineraries</strong> are designed to help you experience the best of this Himalayan gem.
                    </p>
                    <div className="flex justify-center gap-8 text-neutral-600">
                        <div className="flex flex-col items-center gap-2">
                            <Mountain className="w-8 h-8 text-primary-600" />
                            <span className="font-medium">Trekking</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Coffee className="w-8 h-8 text-primary-600" />
                            <span className="font-medium">Culture</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Camera className="w-8 h-8 text-primary-600" />
                            <span className="font-medium">Scenery</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Itineraries Grid */}
            <section className="py-16 bg-neutral-50 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Top Nepal Itineraries</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        import OptimizedImage from '../components/OptimizedImage';

                        // ... (inside component)
                        {itineraries.map((itinerary) => (
                            <Link key={itinerary.id} to={itinerary.link} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="relative h-48 overflow-hidden">
                                    <OptimizedImage src={itinerary.image} alt={itinerary.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-neutral-900">
                                        {itinerary.duration}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors">{itinerary.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                                        <MapPin className="w-4 h-4" />
                                        <span>Nepal</span>
                                        <span className="mx-2">•</span>
                                        <span className="text-green-600 font-medium">{itinerary.budget}</span>
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        {itinerary.highlights.map((highlight, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm text-neutral-600">
                                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                                {highlight}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center text-primary-600 font-bold text-sm">
                                        View Full Itinerary <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Nepal Travel FAQs</h2>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                            <h3 className="font-bold text-lg mb-2">When is the best time to visit Nepal?</h3>
                            <p className="text-neutral-600">The best time to visit Nepal is during the spring (March to May) and autumn (September to November) seasons when the weather is clear and pleasant for trekking and sightseeing.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                            <h3 className="font-bold text-lg mb-2">Do I need a visa for Nepal?</h3>
                            <p className="text-neutral-600">Yes, most travelers need a visa. You can get a visa on arrival at Tribhuvan International Airport in Kathmandu or apply online beforehand.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                            <h3 className="font-bold text-lg mb-2">Is Nepal safe for solo travelers?</h3>
                            <p className="text-neutral-600">Nepal is generally very safe for solo travelers. The locals are friendly and helpful. However, standard travel precautions should always be taken.</p>
                        </div>
                    </div>
                </div>
            </section>

            import RelatedDestinations from '../components/RelatedDestinations';

            // ... (imports)

            // ... (inside component)
            <RelatedDestinations />
            <Newsletter />
        </div>
    );
};

export default DestinationHub;
