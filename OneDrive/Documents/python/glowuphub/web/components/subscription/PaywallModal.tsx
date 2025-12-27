'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    FeatureKey,
    PRICING,
    FEATURE_DISPLAY_NAMES,
    FEATURE_DESCRIPTIONS,
    FEATURE_KEYS,
} from '@/lib/subscription/gates';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    triggerFeature?: FeatureKey;
    onStartTrial?: () => void;
    onSubscribe?: (plan: 'monthly' | 'yearly') => void;
}

const HIGHLIGHTED_FEATURES: FeatureKey[] = [
    FEATURE_KEYS.UNLIMITED_PRACTICES,
    FEATURE_KEYS.PHOTO_PROGRESS,
    FEATURE_KEYS.FULL_GLOW_HISTORY,
    FEATURE_KEYS.PRIVATE_JOURNAL,
    FEATURE_KEYS.JOIN_CHALLENGES,
    FEATURE_KEYS.AI_COACH,
];

export function PaywallModal({
    isOpen,
    onClose,
    triggerFeature,
    onStartTrial,
    onSubscribe,
}: PaywallModalProps) {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
    const [isLoading, setIsLoading] = useState(false);

    const handleStartTrial = async () => {
        setIsLoading(true);
        try {
            onStartTrial?.();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            onSubscribe?.(selectedPlan);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
                    >
                        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="relative p-8 pb-6 text-center bg-gradient-to-b from-primary/10 to-transparent">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition"
                                >
                                    <X className="w-5 h-5 text-foreground-muted" />
                                </button>

                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                                    <Crown className="w-8 h-8 text-primary" />
                                </div>

                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    Unlock Your Full Potential
                                </h2>

                                {triggerFeature && (
                                    <p className="text-foreground-muted">
                                        <span className="text-primary font-medium">
                                            {FEATURE_DISPLAY_NAMES[triggerFeature]}
                                        </span>{' '}
                                        is a Premium feature
                                    </p>
                                )}
                            </div>

                            {/* Features List */}
                            <div className="px-8 py-6 border-t border-border">
                                <p className="text-sm text-foreground-muted mb-4 uppercase tracking-wider">
                                    Everything in Premium
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {HIGHLIGHTED_FEATURES.map((feature) => (
                                        <div key={feature} className="flex items-center gap-2">
                                            <div className="p-1 rounded-full bg-primary/20">
                                                <Check className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-sm text-foreground">
                                                {FEATURE_DISPLAY_NAMES[feature]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing Toggle */}
                            <div className="px-8 py-6 border-t border-border">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedPlan('monthly')}
                                        className={`flex-1 p-4 rounded-2xl border transition-all ${selectedPlan === 'monthly'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/30'
                                            }`}
                                    >
                                        <p className="text-sm text-foreground-muted mb-1">Monthly</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            ${PRICING.monthly.price}
                                            <span className="text-sm font-normal text-foreground-muted">/mo</span>
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => setSelectedPlan('yearly')}
                                        className={`flex-1 p-4 rounded-2xl border transition-all relative ${selectedPlan === 'yearly'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/30'
                                            }`}
                                    >
                                        <span className="absolute -top-2 right-3 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                            BEST VALUE
                                        </span>
                                        <p className="text-sm text-foreground-muted mb-1">Yearly</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            ${(PRICING.yearly.price / 12).toFixed(2)}
                                            <span className="text-sm font-normal text-foreground-muted">/mo</span>
                                        </p>
                                        <p className="text-xs text-primary mt-1">{PRICING.yearly.savings}</p>
                                    </button>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="px-8 pb-8 space-y-3">
                                <Button
                                    onClick={handleStartTrial}
                                    disabled={isLoading}
                                    className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg shadow-lg shadow-primary/20"
                                >
                                    <Zap className="w-5 h-5 mr-2" />
                                    Start {PRICING.trial.days}-Day Free Trial
                                </Button>

                                <p className="text-center text-xs text-foreground-muted">
                                    Then {selectedPlan === 'yearly'
                                        ? `$${PRICING.yearly.price}/year`
                                        : `$${PRICING.monthly.price}/month`
                                    }. Cancel anytime.
                                </p>

                                <button
                                    onClick={onClose}
                                    className="w-full text-sm text-foreground-muted hover:text-foreground transition py-2"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/**
 * Upgrade Banner - for subtle inline prompts
 */
interface UpgradeBannerProps {
    feature: FeatureKey;
    onUpgrade: () => void;
}

export function UpgradeBanner({ feature, onUpgrade }: UpgradeBannerProps) {
    return (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-lavender/10 border border-primary/20">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">
                            Unlock {FEATURE_DISPLAY_NAMES[feature]}
                        </p>
                        <p className="text-sm text-foreground-muted">
                            {FEATURE_DESCRIPTIONS[feature]}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={onUpgrade}
                    size="sm"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    Upgrade
                </Button>
            </div>
        </div>
    );
}

/**
 * Locked Feature Overlay - shows lock icon over gated content
 */
interface LockedOverlayProps {
    feature: FeatureKey;
    onUpgrade: () => void;
}

export function LockedOverlay({ feature, onUpgrade }: LockedOverlayProps) {
    return (
        <div
            onClick={onUpgrade}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center cursor-pointer group transition-all hover:bg-background/70"
        >
            <div className="p-4 rounded-2xl bg-primary/20 mb-3 group-hover:bg-primary/30 transition">
                <Crown className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold text-foreground">Premium Feature</p>
            <p className="text-sm text-foreground-muted">
                Tap to unlock {FEATURE_DISPLAY_NAMES[feature]}
            </p>
        </div>
    );
}
