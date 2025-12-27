"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dumbbell,
    Footprints,
    Zap,
    History,
    Activity,
    LineChart as LineChartIcon,
    History as HistoryIcon,
    Flame
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";
import { SessionLogger } from "@/components/gym/session-logger";
import { LifestyleTracker } from "@/components/workouts/lifestyle-tracker";

type ProtocolMode = 'lifestyle' | 'gym';

export default function MovementPage() {
    const [mode, setMode] = useState<ProtocolMode>('lifestyle');

    return (
        <div className="space-y-12">
            {/* Clinical Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
                <FadeIn direction="down">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Your Daily Movement</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-none">
                            Keep <span className="text-primary">Moving</span>.
                        </h1>
                        <p className="text-base text-foreground-muted max-w-lg leading-relaxed">
                            Log your workouts and daily activity to stay on track. Small steps lead to <span className="text-foreground font-bold">Big Results</span>.
                        </p>
                    </div>
                </FadeIn>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                    <button
                        onClick={() => setMode('lifestyle')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                            mode === 'lifestyle'
                                ? "bg-primary text-black shadow-lg"
                                : "text-foreground-muted hover:text-white"
                        )}
                    >
                        <Footprints size={14} />
                        Lifestyle
                    </button>
                    <button
                        onClick={() => setMode('gym')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                            mode === 'gym'
                                ? "bg-primary text-black shadow-lg"
                                : "text-foreground-muted hover:text-white"
                        )}
                    >
                        <Dumbbell size={14} />
                        Gym
                    </button>
                </div>
            </header>

            <div className="grid xl:grid-cols-12 gap-10">
                {/* Main Action Area */}
                <div className="xl:col-span-8 space-y-8">
                    <AnimatePresence mode="wait">
                        {mode === 'lifestyle' ? (
                            <motion.div
                                key="lifestyle"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <section>
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted/40 mb-6 px-4">Daily Activity Log</h2>
                                    <LifestyleTracker />
                                </section>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="gym"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <section>
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted/40 mb-6 px-4">Strength Training</h2>
                                    <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5">
                                        <SessionLogger />
                                    </div>
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Activity Stats Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    <FadeIn direction="right" delay={0.2}>
                        <div className="glass-premium rounded-[2rem] p-6 border border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground-muted">Workout Summary</h3>
                                <Activity size={16} className="text-primary" />
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Flame size={16} />
                                        </div>
                                        <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-widest">Total Burn</span>
                                    </div>
                                    <span className="font-mono text-lg font-black italic">1,240 <span className="text-[8px] font-sans not-italic uppercase opacity-40">kCal</span></span>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                            <HistoryIcon size={16} />
                                        </div>
                                        <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-widest">Time Active</span>
                                    </div>
                                    <span className="font-mono text-lg font-black italic">45 <span className="text-[8px] font-sans not-italic uppercase opacity-40">Min</span></span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[9px] text-foreground-muted font-bold uppercase tracking-widest leading-relaxed opacity-60">
                                    Weekly consistency is currently <span className="text-primary">84%</span>. Maintaining this velocity will result in a projected metabolic age reduction of 1.2 years.
                                </p>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="right" delay={0.4}>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden group">
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center font-black text-[8px] text-primary">
                                        GA
                                    </div>
                                    <h4 className="text-xs font-black tracking-tight">Guideline Adjustment</h4>
                                </div>
                                <p className="text-[11px] text-foreground/70 leading-relaxed italic border-l border-primary/30 pl-4">
                                    "Prioritize compound lifts during your gym sessions to maximize post-exercise oxygen consumption (EPOC)."
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
