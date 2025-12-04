import React from 'react';
import { MapPin, Sparkles, Gamepad2, Plane } from 'lucide-react';

const HowItWorksStrip = () => {
    const steps = [
        {
            icon: MapPin,
            title: '1. Choose Mission',
            description: 'Select your vibe: Solo, Couple, or Squad.'
        },
        {
            icon: Sparkles,
            title: '2. AI Builds Plan',
            description: 'Get a personalized itinerary in seconds.'
        },
        {
            icon: Gamepad2,
            title: '3. Refine & Play',
            description: 'Use Arcade tools to split costs & mix tasks.'
        },
        {
            icon: Plane,
            title: '4. Ready to Go',
            description: 'Export your plan and hit the road.'
        }
    ];

    return (
        <section className="py-12 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                                    <Icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                                <p className="text-sm text-gray-500">{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksStrip;
