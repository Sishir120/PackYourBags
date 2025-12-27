"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, ShieldCheck, Zap } from "lucide-react";

export function ClinicalAdvice() {
    return (
        <FadeIn>
            <div className="glass-premium rounded-2xl p-6 border border-emerald-500/10 relative overflow-hidden group">
                {/* Animated Background Pulse */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] animate-breathe" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                        <Brain size={28} className="text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Genius Integration</span>
                                <div className="h-[1px] w-8 bg-emerald-500/20" />
                            </div>
                            <h3 className="text-lg font-bold tracking-tight">Morning Metabolic Calibration</h3>
                        </div>

                        <p className="text-sm text-foreground-muted leading-relaxed">
                            "Based on yesterday's <span className="text-foreground font-bold italic">glycemic variance</span>, I've adjusted your
                            structural integrity target by <span className="text-emerald-500 font-bold">+15g</span> protein.
                            Prioritize high-leucine sources to maximize synthesis."
                        </p>

                        <div className="flex gap-3">
                            <button className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white font-bold text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                                Apply Calibration
                            </button>
                            <button className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/5 font-bold text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all">
                                Scientific Rationale
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}

function FadeIn({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {children}
        </motion.div>
    );
}
