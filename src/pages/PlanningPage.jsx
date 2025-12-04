import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Briefcase, Heart, ArrowRight, Sparkles, Check, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

const PlanningPage = () => {
    const [step, setStep] = useState(1);
    const [tripProfile, setTripProfile] = useState({
        type: '',
        region: '',
        budget: 'medium'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();
    const { isPremium, setShowUpgradeModal } = useSubscription();

    const tripTypes = [
        { id: 'tourist', label: 'First-time Tourist', icon: MapPin },
        { id: 'nomad', label: 'Digital Nomad', icon: Briefcase },
        { id: 'couple', label: 'Couple', icon: Heart },
        { id: 'friends', label: 'Friends Group', icon: Users },
    ];

    const regions = [
        { id: 'pokhara', label: 'Pokhara, Nepal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80' },
        { id: 'kathmandu', label: 'Kathmandu, Nepal', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80' },
        { id: 'bali', label: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
        { id: 'kyoto', label: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' },
        { id: 'hanoi', label: 'Hanoi, Vietnam', image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=400&q=80' },
    ];

    const handleGenerate = () => {
        if (!tripProfile.type || !tripProfile.region) return;
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            setIsGenerating(false);
            setStep(2);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
                    <div className={`w-1/3 h-1 absolute top-1/2 left-0 bg-primary-500 transition-all duration-500 -z-10`} style={{ width: `${(step / 4) * 100}%` }}></div>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Step 1: Choose Mission */}
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold text-center mb-8">Choose Your Mission</h1>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">1. What's your travel style?</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {tripTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setTripProfile({ ...tripProfile, type: type.id })}
                                            className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${tripProfile.type === type.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200 bg-white'}`}
                                        >
                                            <Icon className={`w-8 h-8 ${tripProfile.type === type.id ? 'text-primary-600' : 'text-gray-400'}`} />
                                            <span className="font-medium">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">2. Select your destination</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {regions.map((region) => (
                                    <button
                                        key={region.id}
                                        onClick={() => setTripProfile({ ...tripProfile, region: region.id })}
                                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all group ${tripProfile.region === region.id ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2' : 'border-transparent'}`}
                                    >
                                        <img src={region.image} alt={region.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg text-center px-2">{region.label}</span>
                                        </div>
                                        {tripProfile.region === region.id && (
                                            <div className="absolute top-2 right-2 bg-primary-500 rounded-full p-1">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleGenerate}
                                disabled={!tripProfile.type || !tripProfile.region || isGenerating}
                                className="btn btn-primary btn-lg px-12 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 animate-spin" />
                                        Generating Plan...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Generate AI Itinerary <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: AI Plan Result */}
                {step === 2 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold text-center mb-2">Your AI Itinerary</h1>
                        <p className="text-center text-gray-600 mb-8">Based on your {tripProfile.type} style for {regions.find(r => r.id === tripProfile.region)?.label}</p>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                            <div className="p-6 border-b border-gray-100 bg-primary-50/50">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900">7-Day Adventure Plan</h2>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">Est. Budget: $800 - $1200</span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[1, 2, 3].map((day) => (
                                    <div key={day} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-bold">
                                                Day {day}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-1">Explore the City Center</h3>
                                                <p className="text-gray-600 text-sm mb-2">Morning visit to local temples, followed by lunch at a rooftop cafe.</p>
                                                <div className="flex gap-2">
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Sightseeing</span>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Culture</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-6 text-center bg-gray-50">
                                    <p className="text-gray-500 italic">...and 4 more days available in Pro</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button onClick={() => setStep(1)} className="text-gray-500 font-medium">Back</button>
                            <button onClick={() => setStep(3)} className="btn btn-primary">Continue to Refine</button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Refine with Arcade */}
                {step === 3 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold text-center mb-8">Refine Your Trip</h1>
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-primary-300 transition-colors cursor-pointer" onClick={() => navigate('/arcade')}>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">To-Do Roulette</h3>
                                <p className="text-gray-600 text-sm">Spin to mix up your activities and find hidden gems.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-primary-300 transition-colors cursor-pointer" onClick={() => navigate('/arcade')}>
                                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-pink-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Who Pays?</h3>
                                <p className="text-gray-600 text-sm">Split costs fairly with your travel group.</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setStep(2)} className="text-gray-500 font-medium">Back</button>
                            <button onClick={() => setStep(4)} className="btn btn-primary">Finalize Trip</button>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Export */}
                {step === 4 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold text-center mb-8">Ready to Go?</h1>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md mx-auto">
                            <div className="space-y-4">
                                <button className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                                    <Check className="w-5 h-5" /> Save Trip to Profile
                                </button>

                                <button
                                    onClick={() => !isPremium && setShowUpgradeModal(true)}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 ${isPremium ? 'bg-white border-primary-600 text-primary-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                                >
                                    {isPremium ? (
                                        <>Export to PDF / Calendar</>
                                    ) : (
                                        <><Lock className="w-4 h-4" /> Export (Pro Only)</>
                                    )}
                                </button>

                                {!isPremium && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800 flex gap-2 items-start">
                                        <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p>Upgrade to Pro to export your itinerary, get price alerts, and access offline mode.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900 font-medium">Return Home</button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PlanningPage;
