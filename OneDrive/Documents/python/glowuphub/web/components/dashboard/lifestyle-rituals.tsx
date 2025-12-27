"use client";

import { motion } from "framer-motion";
import { Check, Moon, Sun, Coffee, Wind, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const RITUALS = [
    { id: 'water', label: 'Morning Hydration', icon: <Coffee size={14} />, time: 'Morning', status: 'done' },
    { id: 'breath', label: 'Box Breathing (5 min)', icon: <Wind size={14} />, time: 'Morning', status: 'pending' },
    { id: 'sun', label: 'Natural Sunlight', icon: <Sun size={14} />, time: 'Afternoon', status: 'pending' },
    { id: 'sleep', label: 'No Screen (1h before)', icon: <Moon size={14} />, time: 'Evening', status: 'pending' },
    { id: 'gratitude', label: 'Gratitude Reflection', icon: <Heart size={14} />, time: 'Evening', status: 'pending' },
];

export function LifestyleRituals() {
    const [rituals, setRituals] = useState(RITUALS);

    const toggleRitual = (id: string) => {
        setRituals(prev => prev.map(r =>
            r.id === id ? { ...r, status: r.status === 'done' ? 'pending' : 'done' } : r
        ));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1">Lifestyle Rituals</h3>
            <div className="space-y-2">
                {rituals.map((ritual, i) => (
                    <motion.div
                        key={ritual.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => toggleRitual(ritual.id)}
                        className={cn(
                            "group p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                            ritual.status === 'done'
                                ? "bg-sage/10 border-sage/20"
                                : "glass-premium border-white/5 hover:border-primary/20"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center border transition-all",
                                ritual.status === 'done'
                                    ? "bg-sage text-background border-sage shadow-[0_0_10px_rgba(157,214,147,0.2)]"
                                    : "bg-white/5 border-white/5 text-foreground-muted group-hover:border-primary/20"
                            )}>
                                {ritual.status === 'done' ? <Check size={14} strokeWidth={3} /> : ritual.icon}
                            </div>
                            <div>
                                <h4 className={cn(
                                    "text-[13px] font-bold tracking-tight transition-all",
                                    ritual.status === 'done' ? "text-sage opacity-70 line-through" : "text-foreground"
                                )}>
                                    {ritual.label}
                                </h4>
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-20 mt-0.5 block">
                                    {ritual.time}
                                </span>
                            </div>
                        </div>

                        <div className={cn(
                            "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-[0.2em] border transition-all",
                            ritual.status === 'done'
                                ? "bg-sage/20 border-sage/30 text-sage"
                                : "bg-white/5 border-white/10 text-foreground-muted opacity-30"
                        )}>
                            {ritual.status === 'done' ? 'Completed' : 'Pending'}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-6 rounded-[1.5rem] bg-indigo-500/10 border border-indigo-500/20 relative overflow-hidden group">
                <div className="relative z-10">
                    <h4 className="font-bold text-xs mb-1 text-indigo-300">Transformation tip</h4>
                    <p className="text-[10px] text-foreground-muted leading-relaxed opacity-70">
                        Consistency in sleep hygiene accounts for up to 30% of metabolic efficiency.
                        Don't skip the "No Screen" ritual tonight!
                    </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                    <Moon size={48} className="text-indigo-400" />
                </div>
            </div>
        </div>
    );
}
