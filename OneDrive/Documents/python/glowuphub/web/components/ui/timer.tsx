'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useSound } from '@/hooks/use-sound';

interface TimerProps {
    initialSeconds?: number; // If provided, acts as countdown. If 0/undefined, acts as stopwatch.
    onComplete?: () => void;
}

export function Timer({ initialSeconds = 0, onComplete }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);
    const [mode] = useState<'stopwatch' | 'countdown'>(initialSeconds > 0 ? 'countdown' : 'stopwatch');

    // Sounds - only for mandatory feedback (timer complete)
    const { playTimerTick, playSuccess } = useSound();

    // For stopwatch, we track elapsed time
    const [elapsed, setElapsed] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                playTimerTick(); // Tick sound every second
                if (mode === 'countdown') {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            if (intervalRef.current) clearInterval(intervalRef.current);
                            setIsActive(false);
                            playSuccess(); // Success sound on complete
                            onComplete?.();
                            return 0;
                        }
                        return prev - 1;
                    });
                } else {
                    setElapsed(prev => prev + 1);
                }
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, mode, onComplete, playTimerTick, playSuccess]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'countdown') {
            setTimeLeft(initialSeconds);
        } else {
            setElapsed(0);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const displayTime = mode === 'countdown' ? formatTime(timeLeft) : formatTime(elapsed);
    const progress = mode === 'countdown'
        ? ((initialSeconds - timeLeft) / initialSeconds) * 100
        : 0; // Stopwatch doesn't have fixed progress

    return (
        <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto">
            {/* Timer Display */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-8 group">
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-1000 ${isActive ? 'bg-primary/20 opacity-100' : 'bg-primary/5 opacity-50'}`} />

                {/* Progress Ring (Countdown Only) */}
                {mode === 'countdown' && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-white/10"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]"
                            strokeDasharray="283"
                            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                            transition={{ duration: 1, ease: "linear" }}
                        />
                    </svg>
                )}

                {/* Stopwatch Ring (Simple Pulse) */}
                {mode === 'stopwatch' && (
                    <motion.div
                        animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-4 rounded-full border-2 border-white/10"
                    />
                )}

                {/* Time Text */}
                <div className="z-10 font-mono text-5xl font-bold text-foreground tracking-wider tabular-nums">
                    {displayTime}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={resetTimer}
                    className="p-4 rounded-full bg-secondary text-foreground-muted hover:bg-secondary/80 hover:text-foreground transition-all"
                >
                    <RotateCcw size={24} />
                </button>

                <button
                    onClick={toggleTimer}
                    className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    {isActive ? (
                        <Pause size={32} fill="currentColor" />
                    ) : (
                        <Play size={32} fill="currentColor" className="ml-1" />
                    )}
                </button>
            </div>

            <p className="mt-8 text-sm text-foreground-muted uppercase tracking-widest font-medium">
                {mode === 'countdown' ? (isActive ? 'Focus...' : 'Ready?') : 'Duration'}
            </p>
        </div>
    );
}
