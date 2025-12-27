'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    SubscriptionStatus,
    SubscriptionTier,
    FeatureKey,
    canAccessFeature,
    getSubscriptionStatus,
    FEATURE_DISPLAY_NAMES,
    FEATURE_DESCRIPTIONS,
} from './gates';

interface SubscriptionContextValue {
    status: SubscriptionStatus;
    isLoading: boolean;
    isPremium: boolean;
    isTrial: boolean;
    canAccess: (feature: FeatureKey) => boolean;
    getFeatureName: (feature: FeatureKey) => string;
    getFeatureDescription: (feature: FeatureKey) => string;
    openUpgradeModal: (feature?: FeatureKey) => void;
    refreshSubscription: () => Promise<void>;
}

const defaultStatus: SubscriptionStatus = {
    tier: 'free',
    expiresAt: null,
    trialUsed: false,
    daysRemaining: null,
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

interface SubscriptionProviderProps {
    children: ReactNode;
    onOpenUpgradeModal?: (feature?: FeatureKey) => void;
}

export function SubscriptionProvider({ children, onOpenUpgradeModal }: SubscriptionProviderProps) {
    const [status, setStatus] = useState<SubscriptionStatus>(defaultStatus);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubscription = async () => {
        try {
            const res = await fetch('/api/user');
            if (res.ok) {
                const user = await res.json();
                setStatus(getSubscriptionStatus(user));
            }
        } catch (error) {
            console.error('Failed to fetch subscription status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    const value: SubscriptionContextValue = {
        status,
        isLoading,
        isPremium: status.tier === 'premium',
        isTrial: status.tier === 'trial',
        canAccess: (feature: FeatureKey) => canAccessFeature(status.tier, feature),
        getFeatureName: (feature: FeatureKey) => FEATURE_DISPLAY_NAMES[feature] || feature,
        getFeatureDescription: (feature: FeatureKey) => FEATURE_DESCRIPTIONS[feature] || '',
        openUpgradeModal: onOpenUpgradeModal || (() => { }),
        refreshSubscription: fetchSubscription,
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}

/**
 * Hook to access subscription status and feature gating
 */
export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}

/**
 * Hook to check if user can access a specific feature
 * Returns { canAccess, isLoading, openUpgrade }
 */
export function useFeatureAccess(feature: FeatureKey) {
    const { canAccess, isLoading, openUpgradeModal, getFeatureName, getFeatureDescription } = useSubscription();

    return {
        canAccess: canAccess(feature),
        isLoading,
        featureName: getFeatureName(feature),
        featureDescription: getFeatureDescription(feature),
        openUpgrade: () => openUpgradeModal(feature),
    };
}

/**
 * Wrapper component that shows upgrade prompt for gated features
 */
interface FeatureGateProps {
    feature: FeatureKey;
    children: ReactNode;
    fallback?: ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
    const { canAccess, isLoading } = useFeatureAccess(feature);

    if (isLoading) {
        return null; // Or a loading skeleton
    }

    if (!canAccess) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}
