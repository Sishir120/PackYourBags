"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Check, Sparkles, Heart, Leaf, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Starter",
        tier: "FREE",
        price: "0",
        description: "Your daily safe space. No credit card required.",
        features: [
            "3 guided rituals per day",
            "Basic Glow Rings (7-day view)",
            "Community access (read-only)",
            "1 Mastery Pack preview",
        ],
        limits: [
            "Limited to 7-day history",
            "No macro tracking",
            "No progress photos",
        ],
        popular: false,
        icon: <Leaf className="w-5 h-5 text-sage" />,
        cta: "Start Free",
        highlight: "No credit card required",
    },
    {
        name: "Premium",
        tier: "PREMIUM",
        price: "14.99",
        description: "Complete transformation toolkit for self-directed achievers.",
        features: [
            "Unlimited meal & snack tracking",
            "Personalized macro targets",
            "All 4 Mastery Packs unlocked",
            "Progress photos & weight tracking",
            "Full analytics & insights",
            "Activity protocols & workouts",
            "100+ healthy recipes",
            "Rewards Treasury & badges",
            "Private reflection journal",
            "Full community participation",
        ],
        extras: [],
        popular: true,
        icon: <Sparkles className="w-5 h-5 text-primary" />,
        cta: "Start 14-Day Trial",
        highlight: "Most popular - 14-day guarantee",
        savingsAnnual: "Save $30/year",
    },
    {
        name: "Coach",
        tier: "COACH",
        price: "49",
        description: "Premium + expert guidance. A nutritionist in your pocket.",
        features: [
            "Everything in Premium",
            "24-48h expert chat access",
            "Ask about meals, hormones, labs",
            "Share photos for feedback",
            "Monthly live group Q&A",
            "Priority support",
            "Custom meal plan adjustments",
            "Bi-weekly expert check-ins",
        ],
        extras: [
            "20% off 12-Week Reset Program",
            "VIP community badge",
            "Early access to new features",
        ],
        popular: false,
        icon: <MessageCircle className="w-5 h-5 text-primary" />,
        cta: "Get Expert Support",
        highlight: "73% less than traditional coaching",
        savingsAnnual: "Save $98/year",
    },
];

const masteryPacks = [
    { name: "Face Balance Mastery", description: "Facial yoga, mewing, lymphatic flow" },
    { name: "Body Confidence Reset", description: "Occupying space without apology, gentle posture" },
    { name: "Skin Care Systems", description: "Rice water, rose water, consistency" },
    { name: "Mind & Self-Image", description: "Unlearning diet culture, nervous system calm" },
];

export function Pricing() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section id="pricing" className="py-32 bg-background-muted relative overflow-hidden">
            {/* Soft background accents */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-sage/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Start Your <span className="text-primary italic">Practice Today</span>
                        </h2>
                        <p className="text-foreground-muted text-lg mb-8">
                            Less than the price of a weekly self-care treat. Daily practices that compound into lasting confidence.
                        </p>

                        {/* Toggle */}
                        <div className="inline-flex items-center p-1.5 bg-card rounded-full border border-border shadow-sm">
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                                    !isAnnual ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
                                )}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                                    isAnnual ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
                                )}
                            >
                                Yearly <span className="text-[10px] ml-1 opacity-80">(2 months free)</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className={cn(
                                "relative p-8 rounded-3xl border flex flex-col",
                                plan.popular
                                    ? "bg-card border-primary/30 shadow-xl shadow-primary/5"
                                    : "bg-card/50 border-border"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                                        Recommended
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    plan.popular ? "bg-primary/20" : "bg-sage/20"
                                )}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                            </div>
                            <p className="text-foreground-muted text-sm mb-6">{plan.description}</p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-foreground">
                                    ${isAnnual && plan.price !== "0" ? (parseFloat(plan.price) * 10).toFixed(0) : plan.price}
                                </span>
                                <span className="text-foreground-muted">/{isAnnual ? "year" : "month"}</span>
                                {isAnnual && plan.savingsAnnual && (
                                    <div className="mt-2">
                                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                            {plan.savingsAnnual}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Button
                                className={cn(
                                    "w-full mb-4 font-bold rounded-full h-12 text-base",
                                    plan.popular
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                )}
                            >
                                {plan.cta}
                            </Button>

                            <p className="text-center text-xs text-foreground-muted mb-8">
                                {plan.highlight}
                            </p>

                            <div className="space-y-3 flex-1">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <div className="p-1 rounded-full bg-primary/15">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-sm text-foreground">{feature}</span>
                                    </div>
                                ))}
                                {plan.limits && plan.limits.length > 0 && (
                                    <>
                                        <div className="pt-3 mt-3 border-t border-border">
                                            <p className="text-xs text-foreground-muted mb-2 uppercase tracking-wider">Limitations:</p>
                                        </div>
                                        {plan.limits.map((limit) => (
                                            <div key={limit} className="flex items-center gap-3 opacity-60">
                                                <div className="p-1 rounded-full bg-foreground-muted/10">
                                                    <Minus className="w-3 h-3 text-foreground-muted" />
                                                </div>
                                                <span className="text-sm text-foreground-muted">{limit}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {plan.extras && plan.extras.length > 0 && (
                                    <>
                                        <div className="pt-3 mt-3 border-t border-border">
                                            <p className="text-xs text-foreground-muted mb-2 uppercase tracking-wider">Bonus Benefits:</p>
                                        </div>
                                        {plan.extras.map((extra) => (
                                            <div key={extra} className="flex items-center gap-3">
                                                <div className="p-1 rounded-full bg-lavender/20">
                                                    <Sparkles className="w-3 h-3 text-lavender" />
                                                </div>
                                                <span className="text-sm text-foreground">{extra}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                        </motion.div>
                    ))}
                </div>

                {/* Mastery Packs Section */}
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold text-foreground mb-3">Mastery Packs Included</h3>
                    <p className="text-foreground-muted max-w-2xl mx-auto">
                        All Mastery Packs are <span className="text-foreground font-semibold">instantly unlocked</span> with Premium.
                        Free members can earn them one-by-one by completing 30-day "Promise Streaks".
                    </p>
                </div>

                {/* Mastery Packs Section - Accordion on Mobile, Grid on Desktop */}
                <div className="max-w-5xl mx-auto px-4 md:px-0">
                    {/* Desktop Grid */}
                    <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {masteryPacks.map((pack, idx) => (
                            <motion.div
                                key={pack.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05, duration: 0.4 }}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Heart className="w-4 h-4 text-primary" />
                                </div>
                                <h4 className="font-semibold text-foreground mb-1">{pack.name}</h4>
                                <p className="text-sm text-foreground-muted">{pack.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile Accordion */}
                    <div className="md:hidden space-y-3">
                        <MasteryAccordions packs={masteryPacks} />
                    </div>
                </div>

            </div>
        </section>
    );
}

function MasteryAccordions({ packs }: { packs: typeof masteryPacks }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {packs.map((pack, i) => (
                <div key={pack.name} className="bg-card/50 border border-border rounded-2xl overflow-hidden">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full p-5 flex items-center justify-between text-left"
                    >
                        <div className="flex items-center gap-3">
                            <Heart className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground">{pack.name}</span>
                        </div>
                        {openIndex === i ? <Minus className="w-4 h-4 text-foreground-muted" /> : <Plus className="w-4 h-4 text-foreground-muted" />}
                    </button>
                    <AnimatePresence>
                        {openIndex === i && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-5 pt-0 border-t border-border/50">
                                    <p className="text-sm text-foreground-muted leading-relaxed">{pack.description}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
