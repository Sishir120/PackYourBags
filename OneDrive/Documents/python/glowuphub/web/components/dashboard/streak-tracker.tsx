"use client";

import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakTrackerProps {
    count: number;
    days: string[];
    activeDayIndex: number;
}

export function StreakTracker({ count = 5, days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], activeDayIndex = 4 }: StreakTrackerProps) {
    return (
        <div className="glass-premium rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-all duration-700" />

            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <div className="relative">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] transition-shadow duration-500"
                    >
                        <Flame size={32} fill="currentColor" className="animate-pulse" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-orange-500/20"
                    >
                        {count}
                    </motion.div>
                </div>

                <div className="flex-1 space-y-4 text-center sm:text-left">
                    <div>
                        <h4 className="text-xl font-bold tracking-tight">You're on Fire!</h4>
                        <p className="text-xs text-foreground-muted">You've hit your goals for <span className="text-white font-bold">{count} days</span> in a row.</p>
                    </div>

                    <div className="flex justify-center sm:justify-start gap-2">
                        {days.map((day, i) => {
                            const isPast = i < activeDayIndex;
                            const isToday = i === activeDayIndex;
                            return (
                                <div key={i} className="flex flex-col items-center gap-1.5">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
                                        isPast ? "bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.3)]" :
                                            isToday ? "bg-white/10 border border-orange-500 text-orange-500 animate-pulse" :
                                                "bg-white/5 text-foreground-muted border border-white/5"
                                    )}>
                                        {isPast ? <Star size={12} fill="currentColor" /> : day}
                                    </div>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-widest",
                                        isToday ? "text-orange-500" : "text-foreground-muted opacity-40"
                                    )}>
                                        {isToday ? "Today" : day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
