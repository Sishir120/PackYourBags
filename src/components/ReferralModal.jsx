import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Users, Gift } from 'lucide-react';

const ReferralModal = ({ isOpen, onClose }) => {
    const [copied, setCopied] = React.useState(false);
    const referralLink = 'https://packyourbags.app/invite/friend'; // Mock link for now

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join me on PackYourBags!',
                    text: 'Plan your dream trip and play travel games with me on PackYourBags!',
                    url: referralLink,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            handleCopy();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                            <Users className="w-8 h-8 text-white" />
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Invite Friends</h2>
                        <p className="text-purple-100">Plan trips together and challenge them in the Arcade!</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Value Props */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-50 p-4 rounded-xl text-center">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-600">
                                    <Gift className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm">Unlock Badges</h3>
                                <p className="text-xs text-gray-500">Earn exclusive rewards</p>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-xl text-center">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2 text-indigo-600">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm">Compete</h3>
                                <p className="text-xs text-gray-500">Challenge friends</p>
                            </div>
                        </div>

                        {/* Link Box */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Your Invite Link</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-600 text-sm truncate font-mono">
                                    {referralLink}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${copied
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-5 h-5" />
                            Share Invite
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReferralModal;
