import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Zap, Crown } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

const UpgradeModal = () => {
    const { showUpgradeModal, setShowUpgradeModal, upgradeToPremium } = useSubscription();

    if (!showUpgradeModal) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowUpgradeModal(false)}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setShowUpgradeModal(false)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
                    >
                        <X className="w-6 h-6 text-slate-500" />
                    </button>

                    <div className="grid md:grid-cols-2">
                        {/* Left Side: Value Prop */}
                        <div className="bg-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                            {/* Background Blobs */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-teal-500 to-purple-600 animate-spin-slow rounded-full blur-3xl" />
                            </div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-sm font-bold mb-6">
                                    <Crown className="w-4 h-4" />
                                    PREMIUM ACCESS
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Upgrade Your Journey</h2>
                                <p className="text-slate-300 mb-8">
                                    Unlock the full potential of PackYourBags and travel smarter, faster, and better.
                                </p>

                                <ul className="space-y-4">
                                    {[
                                        "Unlimited Roulette Spins",
                                        "Access to All Travel Games",
                                        "AI Itinerary Generator",
                                        "Exclusive Game Skins",
                                        "Offline Mode"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="bg-teal-500/20 p-1 rounded-full">
                                                <Check className="w-4 h-4 text-teal-400" />
                                            </div>
                                            <span className="text-slate-200 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="relative z-10 mt-8 pt-8 border-t border-slate-700">
                                <p className="text-sm text-slate-400">"The best investment for my travels!"</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                    <span className="text-xs text-slate-500">- Sarah J., Traveler</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Pricing & Action */}
                        <div className="p-8 flex flex-col justify-center bg-white">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold text-slate-900">Choose Your Plan</h3>
                                <p className="text-slate-500 text-sm">Cancel anytime. No hidden fees.</p>
                            </div>

                            {/* Pricing Toggle (Mock) */}
                            <div className="flex justify-center mb-8">
                                <div className="bg-slate-100 p-1 rounded-full flex">
                                    <button className="px-4 py-1 rounded-full bg-white shadow-sm text-sm font-bold text-slate-900">Monthly</button>
                                    <button className="px-4 py-1 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900">Yearly (-20%)</button>
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold text-slate-900">$9.99</span>
                                    <span className="text-slate-500">/mo</span>
                                </div>
                                <p className="text-xs text-teal-600 font-bold mt-2">7-Day Free Trial Included</p>
                            </div>

                            <button
                                onClick={upgradeToPremium}
                                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                            >
                                <Zap className="w-5 h-5 fill-current group-hover:animate-pulse" />
                                Start Free Trial
                            </button>

                            <p className="text-center text-xs text-slate-400 mt-4">
                                Secured by Stripe. 100% Money-back guarantee.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UpgradeModal;
