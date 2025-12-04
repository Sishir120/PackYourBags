import React from 'react';
import DestinationHub from './DestinationHub';

const JapanHub = () => {
    const destination = {
        name: 'Japan',
        title: 'Japan Travel Itineraries & Trip Planner',
        description: 'Discover the perfect blend of tradition and modernity. Plan your Japan trip from Tokyo\'s neon lights to Kyoto\'s ancient temples.',
        heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80',
    };

    const itineraries = [
        {
            id: 'tokyo-kyoto-7-days',
            title: 'Golden Route: Tokyo & Kyoto',
            duration: '7 Days',
            budget: '$1500 - $2500',
            image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80',
            highlights: ['Shibuya Crossing', 'Fushimi Inari Shrine', 'Bullet Train'],
            link: '/itineraries/tokyo-kyoto-7-days'
        },
        {
            id: 'osaka-foodie-3-days',
            title: 'Osaka Foodie Adventure',
            duration: '3 Days',
            budget: '$500 - $1000',
            image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&q=80',
            highlights: ['Dotonbori Street Food', 'Osaka Castle', 'Universal Studios'],
            link: '/itineraries/osaka-foodie-3-days'
        },
        {
            id: 'hokkaido-winter-5-days',
            title: 'Hokkaido Winter Wonderland',
            duration: '5 Days',
            budget: '$1000 - $2000',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80', // Placeholder image
            highlights: ['Skiing in Niseko', 'Sapporo Snow Festival', 'Onsens'],
            link: '/itineraries/hokkaido-winter-5-days'
        }
    ];

    return <DestinationHub destination={destination} itineraries={itineraries} />;
};

export default JapanHub;
