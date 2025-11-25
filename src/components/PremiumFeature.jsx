import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumFeature = ({ children, fallback }) => {
    const { isPremium, setShowUpgradeModal } = useSubscription();

    if (isPremium) {
        return children;
    }

    return (
        <div className="relative group">
            {/* Blurred Content */}
            <div className="filter blur-sm select-none pointer-events-none opacity-50">
                {children}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 border border-slate-700 hover:bg-slate-800 transition-colors"
                >
                    <Lock className="w-5 h-5 text-teal-400" />
                    <span>Unlock Premium</span>
                </motion.button>
                {fallback && <div className="mt-4">{fallback}</div>}
            </div>
        </div>
    );
};

export default PremiumFeature;
