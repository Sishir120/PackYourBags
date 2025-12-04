import React from 'react';
import DestinationHub from './DestinationHub';

const BaliHub = () => {
    const destination = {
        name: 'Bali',
        title: 'Bali Travel Itineraries & Trip Planner',
        description: 'Experience the magic of the Island of Gods. From Ubud\'s rice terraces to Uluwatu\'s cliffs, plan your dream Bali vacation with AI.',
        heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80',
    };

    const itineraries = [
        {
            id: 'ubud-canggu-5-days',
            title: 'Bali Essentials: Ubud & Canggu',
            duration: '5 Days',
            budget: '$400 - $800',
            image: 'https://images.unsplash.com/photo-1559628233-eb1b1ee2974e?auto=format&fit=crop&q=80',
            highlights: ['Monkey Forest', 'Rice Terraces', 'Beach Clubs'],
            link: '/itineraries/ubud-canggu-5-days'
        },
        {
            id: 'nusa-penida-3-days',
            title: 'Nusa Penida Island Escape',
            duration: '3 Days',
            budget: '$200 - $400',
            image: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&q=80',
            highlights: ['Kelingking Beach', 'Diamond Beach', 'Manta Ray Snorkeling'],
            link: '/itineraries/nusa-penida-3-days'
        },
        {
            id: 'uluwatu-luxury-3-days',
            title: 'Uluwatu Luxury & Sunsets',
            duration: '3 Days',
            budget: '$600 - $1200',
            image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80',
            highlights: ['Cliffside Resorts', 'Kecak Fire Dance', 'Padang Padang Beach'],
            link: '/itineraries/uluwatu-luxury-3-days'
        }
    ];

    return <DestinationHub destination={destination} itineraries={itineraries} />;
};

export default BaliHub;
