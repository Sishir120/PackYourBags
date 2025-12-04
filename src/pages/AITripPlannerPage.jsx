import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Calendar, DollarSign, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import Newsletter from '../components/Newsletter';

const AITripPlannerPage = () => {
    return (
        <div className="bg-white">
            <SEO />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-primary-50 to-white py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                        AI Trip Planner: <span className="text-primary-600">The Ultimate Guide</span> to Smarter Travel
                    </h1>
                    <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                        Stop spending hours on spreadsheets. Discover how an <strong>AI trip planner</strong> can build your perfect itinerary in seconds—saving you time, money, and stress.
                    </p>
                    <Link to="/destinations" className="btn btn-primary btn-lg inline-flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Generate My Trip Now
                    </Link>
                </div>
            </section>

            {/* What is an AI Trip Planner? */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-6">What is an AI Trip Planner?</h2>
                    <p className="text-lg text-neutral-700 mb-6">
                        An AI trip planner is an intelligent tool that uses artificial intelligence to design personalized travel itineraries. Unlike traditional travel agents or static guidebooks, our AI analyzes your preferences—budget, interests, and travel style—to create a custom day-by-day plan just for you.
                    </p>
                    <p className="text-lg text-neutral-700">
                        Whether you're planning a solo backpacking adventure in Nepal or a luxury honeymoon in Bali, our <strong>AI itinerary builder</strong> handles the logistics so you can focus on the experience.
                    </p>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-16 bg-neutral-50 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">Why Use an AI Itinerary Builder?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                                <Calendar className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Save 20+ Hours of Planning</h3>
                            <p className="text-neutral-600">No more endless research. Get a complete schedule with hotels, activities, and transport in under a minute.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Optimize Your Budget</h3>
                            <p className="text-neutral-600">Our AI finds the best value options and helps you stick to your budget with smart cost estimates.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                                <Map className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Discover Hidden Gems</h3>
                            <p className="text-neutral-600">Go beyond the tourist traps. Our algorithms suggest local favorites and off-the-beaten-path experiences.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">How It Works</h2>
                    <div className="space-y-8">
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Tell Us Your Dream</h3>
                                <p className="text-neutral-600">Select your destination (e.g., Nepal, Japan) and travel dates.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Set Your Style</h3>
                                <p className="text-neutral-600">Choose your vibe: Adventure, Relaxation, Culture, or Foodie. Set your budget range.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Get Your Itinerary</h3>
                                <p className="text-neutral-600">Instantly receive a detailed plan. Customize it, book hotels, and share with friends.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Destinations Hubs */}
            <section className="py-16 bg-neutral-900 text-white px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <h2 className="text-3xl font-bold mb-8">Popular AI Itineraries</h2>
                    import OptimizedImage from '../components/OptimizedImage';

                    // ... (inside component)
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link to="/nepal-travel-itineraries" className="group block relative overflow-hidden rounded-xl aspect-[4/3]">
                            <OptimizedImage src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80" alt="Nepal Travel Itinerary" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <h3 className="text-2xl font-bold">Nepal Itineraries</h3>
                            </div>
                        </Link>
                        {/* Placeholders for future hubs */}
                        <div className="group block relative overflow-hidden rounded-xl aspect-[4/3]">
                            <OptimizedImage src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80" alt="Bali Travel Itinerary" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <h3 className="text-2xl font-bold">Bali Itineraries</h3>
                            </div>
                        </div>
                        <div className="group block relative overflow-hidden rounded-xl aspect-[4/3]">
                            <OptimizedImage src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80" alt="Japan Travel Itinerary" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <h3 className="text-2xl font-bold">Japan Itineraries</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section with Schema */}
            <section className="py-16 px-4 bg-neutral-50">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Is the AI trip planner free?</h3>
                            <p className="text-neutral-600">Yes! You can generate unlimited basic itineraries for free. We also offer premium features for advanced customization.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Can I use this for group trips?</h3>
                            <p className="text-neutral-600">Absolutely. PackYourBags is designed for groups. You can even use our <Link to="/tools/group-trip-cost-splitter" className="text-primary-600 hover:underline">Group Trip Cost Splitter</Link> to manage expenses.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Does it book hotels for me?</h3>
                            <p className="text-neutral-600">We provide direct booking links to trusted partners like Booking.com and Airbnb, so you can secure the best rates instantly.</p>
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

export default AITripPlannerPage;
