"use client";

import { motion } from "framer-motion";
import { Circle, Activity, Heart, Sparkles, ShieldCheck, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Step 1: Low-Impact Release",
        description: "Targeted face yoga and breathwork you can do seated or lying down. No heavy cardio, just relief.",
        icon: <Activity className="w-6 h-6 text-primary" />,
        className: "md:col-span-1",
    },
    {
        title: "Step 2: Track Your Consistency",
        description: "Watch your daily consistency compound into visible results and unlocked rewards.",
        icon: <Sparkles className="w-6 h-6 text-sage" />,
        className: "md:col-span-1",
    },
    {
        title: "Step 3: Unpack the Shame",
        description: "Close with a 2-line journal entry. Re-write the story of how you speak to yourself, one day at a time.",
        icon: <Leaf className="w-6 h-6 text-lavender" />,
        className: "md:col-span-1",
    },
];

export function Features() {
    return (
        <section id="features" className="py-32 bg-background relative overflow-hidden">

            {/* Warm ambient background */}
            <div className="absolute top-1/4 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[40%] h-[40%] bg-sage/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                            3 Steps to Your <span className="text-primary italic">Daily Glow</span>
                        </h2>
                        <p className="text-xl text-foreground-muted">
                            A science-backed system for face yoga, breathwork, and consistency. No obsession. No shame.
                        </p>
                    </motion.div>
                </div>

                {/* Simple 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between",
                                "bg-card/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300",
                                feature.className
                            )}
                        >
                            {/* Subtle hover gradient */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(232, 180, 184, 0.08), transparent 40%)`
                                }}
                            />

                            <div className="relative z-10 w-12 h-12 rounded-2xl bg-primary-soft border border-primary/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                                {feature.icon}
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-foreground-muted leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
