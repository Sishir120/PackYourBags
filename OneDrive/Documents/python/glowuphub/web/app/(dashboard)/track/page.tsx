"use client";

import { motion } from "framer-motion";
import {
    TrendingDown,
    Zap,
    Check,
    Scale,
    Utensils,
    Clock,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    LineChart,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { BmiCalculator } from "@/components/dashboard/bmi-calculator";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { MealLogger } from "@/components/nutrition/meal-logger";
import { BioDigitalTwin } from "@/components/dashboard/bio-digital-twin";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function TrackPage() {
    const [isMealLoggerOpen, setIsMealLoggerOpen] = useState(false);

    return (
        <div className="space-y-16">
            {/* Clinical Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
                <FadeIn direction="down">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">My Health Data</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-none">
                            Body <span className="text-emerald-500">Progress</span>.
                        </h1>
                        <p className="text-base text-foreground-muted max-w-lg leading-relaxed">
                            Tracking your daily stats helps you reach your goals faster. Every detail counts toward <span className="text-foreground font-bold">Your Success</span>.
                        </p>
                    </div>
                </FadeIn>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => setIsMealLoggerOpen(true)}
                        className="h-12 px-8 rounded-xl bg-emerald-500 text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] font-bold uppercase tracking-[0.15em] text-[9px]"
                    >
                        <Utensils className="mr-2 w-3.5 h-3.5" />
                        Log a Meal
                    </Button>
                </div>
            </header>

            <AnimatePresence>
                {isMealLoggerOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMealLoggerOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <div className="relative z-10 w-full max-w-2xl">
                            <MealLogger
                                onSave={() => setIsMealLoggerOpen(false)}
                                onClose={() => setIsMealLoggerOpen(false)}
                            />
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Analysis Grid */}
            <div className="grid xl:grid-cols-12 gap-6">
                {/* Visual Bio-Digital Twin & Biometrics (4 cols) */}
                <div className="xl:col-span-4 space-y-6">
                    <FadeIn direction="right">
                        <BioDigitalTwin hydration={85} energy={72} focus={94} stress={15} />
                    </FadeIn>

                    <FadeIn direction="right" delay={0.2}>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 relative overflow-hidden group">
                            <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-1000" />

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center font-black text-[8px] text-emerald-500">
                                        AI
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold tracking-tight">Expert Health Tip</h4>
                                        <p className="text-[7px] text-foreground-muted font-black uppercase tracking-widest opacity-40">Personal Advice</p>
                                    </div>
                                </div>

                                <p className="text-xs text-foreground/70 leading-relaxed italic border-l border-emerald-500/30 pl-4">
                                    "Try drinking more water today to help your body feel its best."
                                </p>

                                <div className="flex flex-col gap-2 pt-1">
                                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-[8px] uppercase tracking-widest cursor-pointer hover:bg-emerald-600 transition-colors shadow-sm text-center">
                                        I Drank Extra Water
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Primary Tracking Hub (8 cols) */}
                <div className="xl:col-span-8 space-y-6">
                    {/* Body Composition Calibration */}
                    <FadeIn direction="up">
                        <BmiCalculator />
                    </FadeIn>

                    {/* Weight Trajectory */}
                    <FadeIn delay={0.1}>
                        <div className="glass-premium rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                <LineChart size={60} className="text-primary" />
                            </div>

                            <div className="relative z-10 space-y-5">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                    <div className="space-y-0.5">
                                        <h3 className="text-lg font-bold tracking-tight">Weight Progress</h3>
                                        <p className="text-[8px] text-foreground-muted font-black uppercase tracking-widest text-emerald-500">Your Journey to Healthy Weight</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                                            <TrendingDown size={12} className="text-emerald-500" />
                                            <span className="text-xs font-bold">-0.8kg <span className="text-[9px] text-foreground-muted uppercase ml-1">last 7d</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[220px]">
                                    <WeightChart />
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                    {/* Insights & Planning */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <InsightCard
                            title="Goal Timeline"
                            desc="When you'll reach your target."
                            icon={<Zap className="text-amber-500" size={14} />}
                            mainValue="Mar 12"
                            subValue="12 Weeks Left"
                            color="amber"
                        />
                        <InsightCard
                            title="Habit Streak"
                            desc="How well you're sticking to habits."
                            icon={<Activity className="text-emerald-500" size={14} />}
                            mainValue="94%"
                            subValue="Elite Status"
                            color="emerald"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InsightCard({ title, desc, icon, mainValue, subValue, color }: any) {
    return (
        <div className="glass-premium rounded-xl p-4 border border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                        {icon}
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground-muted opacity-40">{title}</h4>
                </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-black tracking-tighter">{mainValue}</span>
                <span className={cn("text-[9px] font-bold uppercase",
                    color === 'amber' ? 'text-amber-500' : 'text-emerald-500'
                )}>{subValue}</span>
            </div>
            <p className="text-[10px] text-foreground-muted leading-relaxed opacity-60 line-clamp-1">{desc}</p>
        </div>
    );
}
