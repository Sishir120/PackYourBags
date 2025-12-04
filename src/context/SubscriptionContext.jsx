import React, { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};

export const SubscriptionProvider = ({ children }) => {
    // State for user tier: 'free' | 'premium'
    const [tier, setTier] = useState('free');

    // Daily limits for free users
    const [limits, setLimits] = useState({
        rouletteSpins: 3,
        gameRuns: 1,
        aiTools: 1,
        aiItineraries: 1 // New limit for AI Itineraries
    });

    // Usage tracking with localStorage persistence
    const [usage, setUsage] = useState(() => {
        const savedUsage = localStorage.getItem('subscription_usage');
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('usage_date');

        if (savedUsage && savedDate === today) {
            return JSON.parse(savedUsage);
        }
        return {
            rouletteSpins: 0,
            gameRuns: 0,
            aiTools: 0,
            aiItineraries: 0
        };
    });

    // Save usage to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('subscription_usage', JSON.stringify(usage));
        localStorage.setItem('usage_date', new Date().toDateString());
    }, [usage]);

    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Check if user can use a feature
    const checkAccess = (feature) => {
        if (tier === 'premium') return true;

        if (usage[feature] < limits[feature]) {
            return true;
        } else {
            setShowUpgradeModal(true);
            return false;
        }
    };

    // Record usage of a feature
    const recordUsage = (feature) => {
        if (tier === 'premium') return;
        setUsage(prev => ({
            ...prev,
            [feature]: prev[feature] + 1
        }));
    };

    const upgradeToPremium = () => {
        setTier('premium');
        setShowUpgradeModal(false);
        // In a real app, this would trigger Stripe/PayPal flow
        alert("🎉 Welcome to Premium! You now have unlimited access.");
    };

    const value = {
        tier,
        isPremium: tier === 'premium',
        limits,
        usage,
        checkAccess,
        recordUsage,
        showUpgradeModal,
        setShowUpgradeModal,
        upgradeToPremium
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};
