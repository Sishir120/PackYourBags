'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const PHASES = [
    { label: 'Inhale', duration: 4, scale: 1.5, opacity: 0.8 },
    { label: 'Hold', duration: 7, scale: 1.5, opacity: 1 },
    { label: 'Exhale', duration: 8, scale: 1, opacity: 0.6 },
];

export function BreathingCircle() {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            const currentPhase = PHASES[phaseIndex];
            timer = setTimeout(() => {
                setPhaseIndex((prev) => (prev + 1) % PHASES.length);
                if (phaseIndex === 2) setCycleCount(c => c + 1);
            }, currentPhase.duration * 1000);
        }
        return () => clearTimeout(timer);
    }, [isActive, phaseIndex]);

    const currentPhase = PHASES[phaseIndex];

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full py-10">
            {/* Background Glows */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: isActive ? [1, 1.5, 1] : 1,
                        opacity: isActive ? [0.3, 0.6, 0.3] : 0.3,
                    }}
                    transition={{
                        duration: 19, // Total cycle
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-64 h-64 bg-primary/20 rounded-full blur-3xl"
                />
            </div>

            {/* Main Circle */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                <div
                    onClick={() => setIsActive(!isActive)}
                    className="relative w-48 h-48 flex items-center justify-center cursor-pointer group"
                >
                    {/* Ring 1 */}
                    <motion.div
                        animate={{
                            scale: isActive ? currentPhase.scale : 1,
                            backgroundColor: isActive ? 'var(--primary-soft)' : '#FDF2F4',
                        }}
                        transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-primary-soft border-4 border-primary/30 shadow-2xl shadow-primary/20"
                    />

                    {/* Ring 2 (Ripple) */}
                    <motion.div
                        animate={{
                            scale: isActive ? [1, 1.2, 1] : 1,
                            opacity: isActive ? [0.5, 0, 0.5] : 0,
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border border-primary/50"
                    />

                    {/* Center Content: Character or Tap Prompt */}
                    <div className="relative z-20 flex flex-col items-center">
                        <AnimatePresence mode='wait'>
                            {isActive ? (
                                <motion.div
                                    key="character-active"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: currentPhase.scale * 0.8,
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
                                    className="relative w-32 h-32"
                                >
                                    <Image
                                        src="/assets/characters/hydration.png"
                                        alt="Breathing Buddy"
                                        fill
                                        className="object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                                    />
                                    <motion.div
                                        key={currentPhase.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -bottom-4 left-0 right-0 text-center font-black text-white text-sm uppercase tracking-widest drop-shadow-md"
                                    >
                                        {currentPhase.label}
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="relative w-24 h-24 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                                        <Image
                                            src="/assets/characters/hydration.png"
                                            alt="Breathing Buddy"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="font-black text-sm text-foreground-muted uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                                        Tap to Start
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Instructions */}
                <div className="text-center space-y-2 max-w-sm">
                    <p className="text-foreground text-sm font-medium">Relieve anxiety & reset your nervous system.</p>
                    <p className="text-foreground-muted text-xs">Completed Cycles: {cycleCount}</p>
                </div>
            </div>
        </div>
    );
}
