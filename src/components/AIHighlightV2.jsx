import React from 'react';
import { Sparkles, MessageCircle, Zap, Star } from 'lucide-react';
import HowItWorksDemo from './HowItWorksDemo';

const AIHighlightV2 = () => {
    const features = [
        {
            icon: MessageCircle,
            title: '24/7 Travel Assistant',
            description: 'Get instant answers to all your travel questions anytime, anywhere'
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Get personalized travel recommendations in seconds, not hours'
        },
        {
            icon: Star,
            title: 'Expert Knowledge',
            description: 'Access to exclusive travel insights and hidden gems worldwide'
        }
    ];

    const handleOpenAIChat = () => {
        // Dispatch event to open AI chat
        const event = new CustomEvent('openAIChat');
        window.dispatchEvent(event);
    };

    return (
        <section className="py-24 bg-neutral-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Gradient Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-800/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full mb-8 shadow-lg">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">
                            AI-Powered Travel Assistant
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Your Personal <span className="text-primary-400">Travel AI</span>
                    </h2>
                    <p className="text-xl text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Get instant, personalized travel advice from our AI-powered assistant trained exclusively on tourism topics
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-500/30 transition-colors">
                                    <Icon className="w-7 h-7 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* How It Works Demo Strip */}
                <div className="mb-16">
                    <HowItWorksDemo />
                </div>

                <div className="text-center">
                    <button
                        onClick={handleOpenAIChat}
                        className="group relative overflow-hidden px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-white" />
                            Chat with TravelBot AI
                            <Sparkles className="w-5 h-5 text-white" />
                        </span>
                    </button>

                    <p className="text-neutral-400 mt-6 text-sm font-medium">
                        Free for 3 trips/month • <span className="text-primary-400">Unlock Pro</span> for unlimited AI, PDF exports & price alerts
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AIHighlightV2;
