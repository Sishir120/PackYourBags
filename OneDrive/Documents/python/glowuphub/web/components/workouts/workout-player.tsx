"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    SkipForward,
    ChevronLeft,
    Timer,
    Flame,
    CheckCircle2,
    AlertCircle,
    Star,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Exercise {
    id: string;
    name: string;
    duration: number; // seconds
    videoUrl?: string;
    instructions: string;
    targetMuscle: string;
}

interface WorkoutPlayerProps {
    workoutName: string;
    exercises: Exercise[];
    onComplete: (data: any) => void;
    onClose: () => void;
}

export function WorkoutPlayer({ workoutName, exercises, onComplete, onClose }: WorkoutPlayerProps) {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [difficulty, setDifficulty] = useState<number | null>(null);

    const currentExercise = exercises[currentExerciseIndex];

    useEffect(() => {
        if (currentExercise) {
            setTimeLeft(currentExercise.duration);
        }
    }, [currentExerciseIndex, currentExercise]);

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleNext();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleNext = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setIsActive(false);
        } else {
            setIsActive(false);
            setIsFinished(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

    if (isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-black border border-white/10 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl"
            >
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto">
                    <CheckCircle2 size={48} />
                </div>
                <div>
                    <h2 className="text-4xl font-black mb-2">Workout <span className="text-primary italic">Complete</span></h2>
                    <p className="text-foreground-muted font-bold tracking-widest uppercase text-xs">You've unlocked a bonus recovery point</p>
                </div>

                <div className="space-y-4 pt-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-foreground-muted">Rate the difficulty</p>
                    <div className="flex justify-center gap-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setDifficulty(star)}
                                className={cn(
                                    "w-12 h-12 rounded-2xl border transition-all flex items-center justify-center",
                                    difficulty === star
                                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/40"
                                        : "bg-white/5 border-white/5 text-foreground-muted hover:border-white/20"
                                )}
                            >
                                <Star size={20} fill={difficulty === star ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={() => onComplete({ difficulty })}
                    className="w-full h-16 rounded-[2rem] bg-primary text-primary-foreground font-black text-lg mt-8"
                >
                    Finish & Log
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full max-w-4xl bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px]"
        >
            {/* Visual Component (Mocking Video) */}
            <div className="flex-1 bg-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 animate-pulse flex flex-col items-center justify-center gap-4">
                        <motion.div
                            animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="p-8 rounded-full bg-white/10"
                        >
                            <Flame size={64} className="text-primary" />
                        </motion.div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] opacity-30">Video Guidance Loading...</span>
                    </div>
                </div>

                {/* Top Controls */}
                <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-20">
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all text-white">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="px-6 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Session</span>
                    </div>
                </div>

                {/* Bottom Progress */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/40 to-transparent">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-primary shadow-[0_0_20px_rgba(45,212,191,0.5)]"
                        />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted">Exercise {currentExerciseIndex + 1} of {exercises.length}</p>
                </div>
            </div>

            {/* Info Component */}
            <div className="w-full md:w-[380px] p-8 md:p-12 flex flex-col justify-between bg-black">
                <div className="space-y-8">
                    <div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 block">{workoutName}</span>
                        <h2 className="text-3xl font-black tracking-tight leading-none mb-4">{currentExercise?.name}</h2>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                                <Timer size={12} className="text-foreground-muted" />
                                <span className="text-[10px] font-bold text-foreground-muted">{formatTime(currentExercise?.duration)}</span>
                            </div>
                            <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2 text-primary">
                                <Flame size={12} />
                                <span className="text-[10px] font-bold">{currentExercise?.targetMuscle}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <Info size={20} className="text-primary shrink-0 mt-1" />
                            <p className="text-xs text-foreground-muted leading-relaxed font-medium capitalize">
                                {currentExercise?.instructions}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="text-center">
                        <span className="text-7xl font-black tracking-tighter text-white tabular-nums">
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={cn(
                                "flex-1 h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-xl",
                                isActive
                                    ? "bg-white/10 border border-white/10 text-white hover:bg-white/20"
                                    : "bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.97]"
                            )}
                        >
                            {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
                        </button>
                        <button
                            onClick={handleNext}
                            className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                        >
                            <SkipForward size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
