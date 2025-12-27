"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ChevronRight,
    ChevronLeft,
    Play,
    Pause,
    Check,
    Timer as TimerIcon,
    Sparkles,
    Volume2,
    Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/use-sound";
import { getCalorieBurnRate } from "@/lib/calculations/calories";

export interface ProtocolStep {
    title: string;
    description: string;
    image: string;
    duration?: number; // in seconds
    tip?: string;
}

interface ActivityProtocolProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    activityId: string; // Used for MET lookup
    steps: ProtocolStep[];
    onComplete: (durationMinutes: number, calories: number) => void;
    weightKg?: number;
}

export function ActivityProtocol({ isOpen, onClose, title, activityId, steps, onComplete, weightKg = 75 }: ActivityProtocolProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [timeLeft, setTimeLeft] = useState(steps[0]?.duration || 0);
    const [isPaused, setIsPaused] = useState(false);
    const [totalActiveTime, setTotalActiveTime] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const { playSuccess } = useSound();

    const calorieBurnRate = getCalorieBurnRate(activityId, weightKg);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when closed
            setCurrentStep(0);
            setTotalActiveTime(0);
            setCaloriesBurned(0);
            setIsFinished(false);
            return;
        }

        // Reset timer when step changes
        if (steps[currentStep]?.duration) {
            setTimeLeft(steps[currentStep].duration!);
        } else {
            setTimeLeft(0);
        }
    }, [currentStep, isOpen, steps]);

    useEffect(() => {
        if (!isOpen || isPaused || isFinished) return;

        const timer = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft((prev) => prev - 1);
            }
            setTotalActiveTime((prev) => prev + 1);
            setCaloriesBurned((prev) => prev + calorieBurnRate);
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, isPaused, timeLeft, calorieBurnRate, isFinished]);

    if (!isOpen) return null;

    const step = steps[currentStep];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            playSuccess();
            setIsFinished(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isFinished) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl glass-premium rounded-[3rem] p-12 text-center space-y-8 border border-white/10"
                >
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto">
                        <Check size={48} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black mb-2">Protocol <span className="text-primary italic">Success</span></h2>
                        <p className="text-foreground-muted font-bold tracking-widest uppercase text-[10px]">Your body is adapting to the stress.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                            <div className="flex items-center justify-center gap-2 text-primary mb-2">
                                <TimerIcon size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                            </div>
                            <p className="text-3xl font-black text-white">{Math.floor(totalActiveTime / 60)}m {totalActiveTime % 60}s</p>
                        </div>
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                            <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                                <Flame size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Burned</span>
                            </div>
                            <p className="text-3xl font-black text-white">{Math.round(caloriesBurned)} kcal</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => onComplete(Math.floor(totalActiveTime / 60), Math.round(caloriesBurned))}
                        className="w-full h-16 rounded-[2rem] bg-primary text-black font-black text-lg mt-8"
                    >
                        Sync Results & Close
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl overflow-hidden md:p-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-full md:max-w-6xl md:h-[800px] flex flex-col md:flex-row bg-background/50 md:rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 z-50 p-3 rounded-full bg-white/5 text-foreground-muted hover:text-white transition-all backdrop-blur-md border border-white/5"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Immersive Visual */}
                <div className="relative w-full h-1/2 md:h-full md:w-1/2 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={step.image}
                            src={step.image}
                            initial={{ scale: 1.1, filter: "blur(10px)", opacity: 0 }}
                            animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                            exit={{ scale: 1.05, filter: "blur(10px)", opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

                    {/* Navigation Progress Sidebar (Desktop) */}
                    <div className="absolute left-8 bottom-8 hidden md:block space-y-3">
                        {steps.map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={cn(
                                    "w-1 h-8 rounded-full transition-all duration-500",
                                    i === currentStep ? "bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                                        i < currentStep ? "bg-primary/40" : "bg-white/10"
                                )} />
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-widest transition-opacity duration-500",
                                    i === currentStep ? "opacity-100" : "opacity-0"
                                )}>Step {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Instructions & Controls */}
                <div className="w-full h-1/2 md:h-full md:w-1/2 p-8 md:p-20 flex flex-col justify-between relative z-10 bg-gradient-to-b from-transparent to-black/40">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-primary" size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{title} Protocol</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-none text-white">
                                {step.title}
                            </h1>
                            <p className="text-base md:text-lg text-foreground-muted leading-relaxed max-w-md">
                                {step.description}
                            </p>
                        </div>

                        {/* Live Metrics */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-orange-400">
                                <Flame size={16} />
                                <span className="text-2xl font-black tabular-nums">{Math.round(caloriesBurned)} kcal</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex items-center gap-2 text-foreground-muted">
                                <TimerIcon size={16} />
                                <span className="text-2xl font-black tabular-nums">{formatTime(totalActiveTime)}</span>
                            </div>
                        </div>

                        {/* Tip Box */}
                        {step.tip && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2"
                            >
                                <div className="flex items-center gap-2 text-primary">
                                    <Volume2 size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Expert Tip</span>
                                </div>
                                <p className="text-xs text-foreground/70 leading-relaxed italic">
                                    "{step.tip}"
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <div className="space-y-8">
                        {/* Timer Section */}
                        <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 w-fit">
                            <div className="space-y-1 min-w-[120px]">
                                <p className="text-[9px] font-black uppercase tracking-widest text-foreground-muted opacity-40">
                                    {step.duration ? "Step Time" : "Session Time"}
                                </p>
                                <p className="text-4xl font-mono font-black text-white">
                                    {step.duration ? formatTime(timeLeft) : formatTime(totalActiveTime)}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10 shadow-lg shadow-black/20"
                            >
                                {isPaused ? <Play size={24} fill="white" /> : <Pause size={24} fill="white" />}
                            </button>
                        </div>

                        {/* Navigation Controls */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className="h-14 px-8 rounded-2xl border border-white/5 font-black uppercase tracking-widest text-[9px] disabled:opacity-0"
                            >
                                <ChevronLeft className="mr-2" size={16} />
                                Previous
                            </Button>
                            <Button
                                onClick={handleNext}
                                className="h-16 px-12 rounded-2xl bg-primary text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] font-black uppercase tracking-widest text-[11px] flex-1"
                            >
                                {currentStep === steps.length - 1 ? "Complete Protocol" : "Next Step"}
                                <ChevronRight className="ml-2" size={18} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Progress Bar (Mobile) */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 md:hidden">
                    <motion.div
                        className="h-full bg-primary"
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
