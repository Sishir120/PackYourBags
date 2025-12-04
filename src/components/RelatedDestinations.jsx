import React from 'react';
import { Link } from 'react-router-dom';

const RelatedDestinations = () => {
    const destinations = [
        { name: 'Nepal', link: '/nepal-travel-itineraries', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80' },
        { name: 'Bali', link: '/bali-travel-itineraries', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80' },
        { name: 'Japan', link: '/japan-travel-itineraries', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80' },
    ];

    return (
        <section className="py-12 bg-neutral-50 border-t border-neutral-200">
            <div className="container mx-auto px-4 max-w-6xl">
                <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Explore More Destinations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {destinations.map((dest) => (
                        <Link key={dest.name} to={dest.link} className="group relative rounded-xl overflow-hidden aspect-video shadow-sm hover:shadow-md transition-shadow">
                            <img src={dest.image} alt={`${dest.name} Itineraries`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="text-white font-bold text-xl">{dest.name} Itineraries</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedDestinations;
