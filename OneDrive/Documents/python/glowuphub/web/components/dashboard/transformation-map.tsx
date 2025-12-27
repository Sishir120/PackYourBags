"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Target, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const MILESTONES = [
    {
        id: "m1",
        title: "Metabolic Baseline",
        desc: "Biological calibration & TDEE synchronization",
        status: "complete",
        icon: ShieldCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        id: "m2",
        title: "Deficit Adaptation",
        desc: "Standardizing metabolic fuel partitioning",
        status: "current",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        id: "m3",
        title: "Adipose Mobilization",
        desc: "Targeted lipolysis via intensity protocols",
        status: "locked",
        icon: Target,
        color: "text-foreground-muted",
        bg: "bg-white/5"
    },
    {
        id: "m4",
        title: "Homeostatic Peak",
        desc: "Sustainable maintenance & biological stability",
        status: "locked",
        icon: Sparkles,
        color: "text-foreground-muted",
        bg: "bg-white/5"
    },
];

export function TransformationMap() {
    return (
        <div className="glass-premium rounded-2xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Sparkles size={80} className="text-primary" />
            </div>

            <div className="relative z-10 space-y-8">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">Biological Journey</h3>
                    <p className="text-xs text-foreground-muted leading-relaxed max-w-sm">
                        Your transformation is architected into four scientific phases.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {MILESTONES.map((m, i) => (
                        <div key={m.id} className="relative group/step">
                            {/* Connecting Line */}
                            {i < MILESTONES.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 left-[calc(100%-0.75rem)] w-full h-[1px] bg-white/5 z-0" />
                            )}

                            <div className={cn(
                                "relative z-10 p-4 rounded-xl border border-white/5 transition-all duration-500",
                                m.status === 'current' ? "bg-white/5 border-primary/20 shadow-lg shadow-primary/5" : "bg-transparent"
                            )}>
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all",
                                    m.bg, m.color
                                )}>
                                    {m.status === 'complete' ? <Check size={18} /> : <m.icon size={18} />}
                                </div>
                                <h4 className={cn(
                                    "text-xs font-bold mb-1.5 transition-colors",
                                    m.status === 'locked' ? "text-foreground-muted" : "text-foreground"
                                )}>{m.title}</h4>
                                <p className="text-[9px] text-foreground-muted leading-relaxed">{m.desc}</p>

                                {m.status === 'current' && (
                                    <motion.div
                                        layoutId="step-indicator"
                                        className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary"
                                    >
                                        Active Phase <ArrowRight size={10} />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Zap size={18} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Biological Velocity</p>
                            <p className="text-sm font-bold text-emerald-500">Optimal (Phase 2 Compliance)</p>
                        </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">
                        Request Protocol Adjustment
                    </button>
                </div>
            </div>
        </div>
    );
}
