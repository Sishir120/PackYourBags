/**
 * Subscription Feature Gate System
 * Defines which features are available to which subscription tiers
 */

export type SubscriptionTier = 'free' | 'premium' | 'trial';

export interface SubscriptionStatus {
    tier: SubscriptionTier;
    expiresAt: Date | null;
    trialUsed: boolean;
    daysRemaining: number | null;
}

/**
 * Feature keys that can be gated by subscription tier
 */
export const FEATURE_KEYS = {
    // Practice Library
    UNLIMITED_PRACTICES: 'unlimited_practices',
    MASTERY_PACKS: 'mastery_packs',

    // Progress Tracking
    FULL_GLOW_HISTORY: 'full_glow_history',
    PHOTO_PROGRESS: 'photo_progress',
    GLOW_ANALYTICS: 'glow_analytics',

    // Personal Tools
    PRIVATE_JOURNAL: 'private_journal',
    AI_COACH: 'ai_coach',
    CUSTOM_REMINDERS: 'custom_reminders',

    // Community
    COMMUNITY_POST: 'community_post',
    COMMUNITY_REACT: 'community_react',
    JOIN_CHALLENGES: 'join_challenges',

    // Mobile Features
    OFFLINE_MODE: 'offline_mode',
    SMART_MIRROR: 'smart_mirror',

    // Premium Content
    AMBIENT_SOUNDS: 'ambient_sounds',
    LIVE_SESSIONS: 'live_sessions',
} as const;

export type FeatureKey = typeof FEATURE_KEYS[keyof typeof FEATURE_KEYS];

/**
 * Defines which tiers have access to which features
 * - 'free': Only free users
 * - 'premium': Only paying customers
 * - 'trial': Users on free trial (treated as premium for most features)
 */
export const FEATURE_GATES: Record<FeatureKey, SubscriptionTier[]> = {
    // Practice Library
    [FEATURE_KEYS.UNLIMITED_PRACTICES]: ['premium', 'trial'],
    [FEATURE_KEYS.MASTERY_PACKS]: ['premium', 'trial'],

    // Progress Tracking
    [FEATURE_KEYS.FULL_GLOW_HISTORY]: ['premium', 'trial'],
    [FEATURE_KEYS.PHOTO_PROGRESS]: ['free', 'premium', 'trial'],
    [FEATURE_KEYS.GLOW_ANALYTICS]: ['premium', 'trial'],

    // Personal Tools
    [FEATURE_KEYS.PRIVATE_JOURNAL]: ['free', 'premium', 'trial'],
    [FEATURE_KEYS.AI_COACH]: ['premium'], // Premium only, not trial
    [FEATURE_KEYS.CUSTOM_REMINDERS]: ['premium', 'trial'],

    // Community
    [FEATURE_KEYS.COMMUNITY_POST]: ['premium', 'trial'],
    [FEATURE_KEYS.COMMUNITY_REACT]: ['premium', 'trial'],
    [FEATURE_KEYS.JOIN_CHALLENGES]: ['premium', 'trial'],

    // Mobile Features
    [FEATURE_KEYS.OFFLINE_MODE]: ['premium'], // Premium only
    [FEATURE_KEYS.SMART_MIRROR]: ['premium', 'trial'],

    // Premium Content
    [FEATURE_KEYS.AMBIENT_SOUNDS]: ['premium', 'trial'],
    [FEATURE_KEYS.LIVE_SESSIONS]: ['premium'], // Premium only
};

/**
 * Check if a user's tier can access a specific feature
 */
export function canAccessFeature(
    userTier: SubscriptionTier,
    featureKey: FeatureKey
): boolean {
    const allowedTiers = FEATURE_GATES[featureKey];
    if (!allowedTiers) {
        console.warn(`Unknown feature key: ${featureKey}`);
        return false;
    }
    return allowedTiers.includes(userTier);
}

/**
 * Get user-friendly feature names for UI display
 */
export const FEATURE_DISPLAY_NAMES: Record<FeatureKey, string> = {
    [FEATURE_KEYS.UNLIMITED_PRACTICES]: 'Unlimited Practices',
    [FEATURE_KEYS.MASTERY_PACKS]: 'Mastery Packs',
    [FEATURE_KEYS.FULL_GLOW_HISTORY]: 'Full Glow History',
    [FEATURE_KEYS.PHOTO_PROGRESS]: 'Photo Progress Timeline',
    [FEATURE_KEYS.GLOW_ANALYTICS]: 'Glow Analytics Dashboard',
    [FEATURE_KEYS.PRIVATE_JOURNAL]: 'Private Reflection Journal',
    [FEATURE_KEYS.AI_COACH]: 'AI Glow Coach',
    [FEATURE_KEYS.CUSTOM_REMINDERS]: 'Custom Reminders',
    [FEATURE_KEYS.COMMUNITY_POST]: 'Community Posting',
    [FEATURE_KEYS.COMMUNITY_REACT]: 'Community Reactions',
    [FEATURE_KEYS.JOIN_CHALLENGES]: '21-Day Challenges',
    [FEATURE_KEYS.OFFLINE_MODE]: 'Offline Mode',
    [FEATURE_KEYS.SMART_MIRROR]: 'Smart Mirror Mode',
    [FEATURE_KEYS.AMBIENT_SOUNDS]: 'Ambient Soundscapes',
    [FEATURE_KEYS.LIVE_SESSIONS]: 'Live Sessions',
};

/**
 * Feature descriptions for paywall modal
 */
export const FEATURE_DESCRIPTIONS: Record<FeatureKey, string> = {
    [FEATURE_KEYS.UNLIMITED_PRACTICES]: 'Access our full library of 100+ guided practices',
    [FEATURE_KEYS.MASTERY_PACKS]: 'Deep-dive programs for Face Balance, Body Confidence & more',
    [FEATURE_KEYS.FULL_GLOW_HISTORY]: 'See your complete progress over time with detailed analytics',
    [FEATURE_KEYS.PHOTO_PROGRESS]: 'Track your visible transformation with before/after photos',
    [FEATURE_KEYS.GLOW_ANALYTICS]: 'Weekly insights on your consistency and Glow Score trends',
    [FEATURE_KEYS.PRIVATE_JOURNAL]: 'Daily reflection prompts and private journaling space',
    [FEATURE_KEYS.AI_COACH]: 'Personalized recommendations based on your journey',
    [FEATURE_KEYS.CUSTOM_REMINDERS]: 'Set your own practice times and notification preferences',
    [FEATURE_KEYS.COMMUNITY_POST]: 'Share your journey and inspire others',
    [FEATURE_KEYS.COMMUNITY_REACT]: 'Support fellow members with reactions and encouragement',
    [FEATURE_KEYS.JOIN_CHALLENGES]: 'Join curated 21-day transformation programs',
    [FEATURE_KEYS.OFFLINE_MODE]: 'Download practices for offline use',
    [FEATURE_KEYS.SMART_MIRROR]: 'Camera overlay guides for perfect form',
    [FEATURE_KEYS.AMBIENT_SOUNDS]: 'Relaxing soundscapes for your practice sessions',
    [FEATURE_KEYS.LIVE_SESSIONS]: 'Weekly live group practices with expert coaches',
};

/**
 * Pricing configuration
 */
export const PRICING = {
    monthly: {
        price: 9.99,
        currency: 'USD',
        interval: 'month' as const,
    },
    yearly: {
        price: 99.99,
        currency: 'USD',
        interval: 'year' as const,
        savings: '2 months free',
    },
    trial: {
        days: 7,
        requiresPaymentMethod: true,
    },
};

/**
 * Calculate subscription status from user data
 */
export function getSubscriptionStatus(user: {
    subscriptionTier?: string;
    subscriptionExpiresAt?: string | null;
    trialUsed?: boolean;
}): SubscriptionStatus {
    const tier = (user.subscriptionTier as SubscriptionTier) || 'free';
    const expiresAt = user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : null;
    const now = new Date();

    let daysRemaining: number | null = null;
    if (expiresAt && tier !== 'free') {
        const diffTime = expiresAt.getTime() - now.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
        tier,
        expiresAt,
        trialUsed: user.trialUsed ?? false,
        daysRemaining,
    };
}
