import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Newsletter from '../components/Newsletter';

const ItineraryDetail = () => {
    // Hardcoded data for Pokhara 4 Days
    const itinerary = {
        title: 'Pokhara 4 Day Itinerary: Lakes, Mountains & Adventure',
        description: 'The ultimate 4-day guide to Pokhara, Nepal. Experience the sunrise at Sarangkot, boat on Phewa Lake, and hike to the World Peace Pagoda.',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80',
        days: [
            {
                day: 1,
                title: 'Arrival & Lakeside Vibes',
                activities: ['Arrive in Pokhara', 'Check into Lakeside hotel', 'Sunset boating on Phewa Lake', 'Dinner at a lakeside cafe']
            },
            {
                day: 2,
                title: 'Sunrise & Sightseeing',
                activities: ['Early morning drive to Sarangkot for sunrise', 'Visit Bindhyabasini Temple', 'Explore Gupteshwor Cave & Davis Falls', 'Visit the International Mountain Museum']
            },
            {
                day: 3,
                title: 'Hiking & Peace',
                activities: ['Hike to World Peace Pagoda (Shanti Stupa)', 'Visit Pumdikot Shiva Statue', 'Relax at a spa or yoga session', 'Evening live music at Busy Bee']
            },
            {
                day: 4,
                title: 'Adventure & Departure',
                activities: ['Paragliding (Optional)', 'Souvenir shopping', 'Departure']
            }
        ]
    };

    return (
        <div className="bg-white">
            <SEO
                title={itinerary.title}
                description={itinerary.description}
                image={itinerary.image}
                article={true}
            />

            {/* Hero */}
            <div className="relative h-[50vh] min-h-[400px]">
                <img src={itinerary.image} alt={itinerary.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end pb-16 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <div className="flex flex-wrap gap-4 text-sm font-bold text-white mb-4">
                            <span className="bg-primary-600 px-3 py-1 rounded-full">Nepal</span>
                            <span className="bg-green-600 px-3 py-1 rounded-full">Budget Friendly</span>
                            <span className="bg-amber-600 px-3 py-1 rounded-full">Adventure</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{itinerary.title}</h1>
                        <div className="flex items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>4 Days</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                <span>$200 - $400</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto max-w-6xl py-12 px-4">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Intro */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">About this Trip</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed">
                                Pokhara is the tourism capital of Nepal, serving as a gateway to the Annapurna Circuit. This 4-day itinerary is perfect for first-timers who want to experience the best of Pokhara without rushing. You'll see majestic mountain views, serene lakes, and vibrant culture.
                            </p>
                        </section>

                        {/* Day by Day */}
                        <section>
                            <h2 className="text-2xl font-bold mb-8">Day-by-Day Breakdown</h2>
                            <div className="space-y-8">
                                {itinerary.days.map((day) => (
                                    <div key={day.day} className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                                {day.day}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-4">{day.title}</h3>
                                                <ul className="space-y-3">
                                                    {day.activities.map((activity, index) => (
                                                        <li key={index} className="flex items-start gap-3 text-neutral-700">
                                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                            <span>{activity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CTA */}
                        <div className="bg-primary-50 p-8 rounded-2xl border border-primary-100 text-center">
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">Want to customize this itinerary?</h3>
                            <p className="text-primary-700 mb-6">Use our AI trip planner to adjust dates, budget, and activities to fit your style.</p>
                            <Link to="/destinations" className="btn btn-primary btn-lg inline-flex items-center gap-2">
                                Customize with AI <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Map Placeholder */}
                        <div className="bg-neutral-100 rounded-xl h-64 flex items-center justify-center border border-neutral-200">
                            <div className="text-neutral-400 flex flex-col items-center gap-2">
                                <MapPin className="w-8 h-8" />
                                <span className="font-medium">Interactive Map Coming Soon</span>
                            </div>
                        </div>

                        {/* Quick Facts */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                            <h3 className="font-bold text-lg mb-4">Trip Essentials</h3>
                            <ul className="space-y-4">
                                <li className="flex justify-between">
                                    <span className="text-neutral-600">Best Time</span>
                                    <span className="font-medium">Oct-Nov, Mar-Apr</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-neutral-600">Currency</span>
                                    <span className="font-medium">NPR (Rupees)</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-neutral-600">Visa</span>
                                    <span className="font-medium">On Arrival</span>
                                </li>
                            </ul>
                        </div>

                        {/* Related Itineraries */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">More Nepal Trips</h3>
                            <div className="space-y-4">
                                import OptimizedImage from '../components/OptimizedImage';

                                // ... (inside component)
                                <Link to="/nepal-travel-itineraries" className="block group">
                                    <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                                        <OptimizedImage src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80" alt="Kathmandu" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <h4 className="font-bold text-sm group-hover:text-primary-600">Kathmandu Cultural Tour</h4>
                                </Link>
                                <Link to="/nepal-travel-itineraries" className="block group">
                                    <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                                        <OptimizedImage src="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80" alt="Chitwan" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <h4 className="font-bold text-sm group-hover:text-primary-600">Chitwan Jungle Safari</h4>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            import RelatedDestinations from '../components/RelatedDestinations';

            // ... (imports)

            // ... (inside component)
            <RelatedDestinations />
            <Newsletter />
        </div>
    );
};

export default ItineraryDetail;
