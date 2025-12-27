"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Cookie } from "lucide-react";
import { useSound } from "@/hooks/use-sound"; // Assuming this exists or will be stubbed
import { cn } from "@/lib/utils";

const FORTUNES = [
    "Your body is your temple. Keep it clean and healthy.",
    "The secret of getting ahead is getting started.",
    "A journey of a thousand miles begins with a single step.",
    "Strength does not come from physical capacity. It comes from an indomitable will.",
    "Today is the first day of the rest of your life. Make it count.",
    "Your only limit is you. Break through!",
    "Success is what happens after you've survived all your mistakes.",
    "Discipline is choosing between what you want now and what you want most.",
    "Small progress is still progress. Don't stop.",
    "Believe in yourself and you're halfway there."
];

export function FortuneCookie() {
    const [isOpen, setIsOpen] = useState(false);
    const [fortune, setFortune] = useState("");
    const [isCracking, setIsCracking] = useState(false);

    const handleCrack = () => {
        if (isOpen) return;

        setIsCracking(true);
        setTimeout(() => {
            const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
            setFortune(randomFortune);
            setIsOpen(true);
            setIsCracking(false);
        }, 800);
    };

    return (
        <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-lavender/5 opacity-50" />

            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div
                        key="closed"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="relative z-10 flex flex-col items-center gap-6"
                    >
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold tracking-tight">Your Daily Dose</h3>
                            <p className="text-xs text-foreground-muted">Crack the cookie for today's motivation.</p>
                        </div>

                        <motion.button
                            onClick={handleCrack}
                            disabled={isCracking}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "relative w-32 h-32 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all",
                                isCracking && "animate-wiggle"
                            )}
                        >
                            <Cookie size={48} className={cn(isCracking && "animate-pulse")} />
                            {isCracking && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    className="absolute inset-0 rounded-full bg-amber-500/20"
                                />
                            )}
                        </motion.button>

                        <button
                            onClick={handleCrack}
                            disabled={isCracking}
                            className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 hover:text-amber-500 transition-colors"
                        >
                            {isCracking ? "Opening..." : "Click to Crack"}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="open"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="relative z-10 flex flex-col items-center gap-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2"
                        >
                            <Sparkles size={24} />
                        </motion.div>

                        <div className="space-y-4 max-w-[240px]">
                            <p className="text-sm font-bold leading-relaxed italic text-white">
                                "{fortune}"
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Fortune Revealed</p>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all mt-4"
                        >
                            Get Another Tomorrow
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sprinkles of light */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
