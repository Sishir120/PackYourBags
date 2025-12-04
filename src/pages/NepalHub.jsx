import React from 'react';
import DestinationHub from './DestinationHub';

const NepalHub = () => {
    const destination = {
        name: 'Nepal',
        title: 'Nepal Travel Itineraries & Trip Planner',
        description: 'Plan your perfect trip to Nepal with our AI-powered itineraries. From the Himalayas to the jungles of Chitwan, discover the best of Nepal.',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80',
    };

    const itineraries = [
        {
            id: 'pokhara-4-days',
            title: 'Pokhara 4 Day Itinerary: Lakes & Mountains',
            duration: '4 Days',
            budget: '$200 - $400',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80',
            highlights: ['Phewa Lake', 'Sarangkot Sunrise', 'World Peace Pagoda'],
            link: '/itineraries/pokhara-4-days'
        },
        {
            id: 'kathmandu-3-days',
            title: 'Kathmandu Cultural Deep Dive',
            duration: '3 Days',
            budget: '$150 - $300',
            image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80',
            highlights: ['Boudhanath Stupa', 'Patan Durbar Square', 'Thamel Nightlife'],
            link: '/itineraries/kathmandu-3-days'
        },
        {
            id: 'chitwan-3-days',
            title: 'Chitwan Jungle Safari Adventure',
            duration: '3 Days',
            budget: '$250 - $500',
            image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80',
            highlights: ['Elephant Safari', 'Tharu Culture', 'Canoe Ride'],
            link: '/itineraries/chitwan-3-days'
        }
    ];

    return <DestinationHub destination={destination} itineraries={itineraries} />;
};

export default NepalHub;
