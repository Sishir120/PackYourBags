"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Smile,
    Meh,
    Frown,
    Check,
    Flame,
    Droplets,
    Moon,
    Sparkles,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InteractiveLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
}

const STEPS = [
    {
        id: "mood",
        title: "How are you feeling?",
        subtitle: "Every emotion is part of the journey.",
        options: [
            { label: "Great", icon: Smile, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Okay", icon: Meh, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Tired", icon: Frown, color: "text-lavender", bg: "bg-lavender/10" },
        ]
    },
    {
        id: "habits",
        title: "Quick Check-in",
        subtitle: "Did you stick to your core habits today?",
        options: [
            { label: "Movement", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Hydration", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Early Bed", icon: Moon, color: "text-lavender", bg: "bg-lavender/10" },
        ],
        multi: true
    },
    {
        id: "reflection",
        title: "Daily Reflection",
        subtitle: "What are you grateful for today?",
        type: "text"
    }
];

export function InteractiveLogModal({ isOpen, onClose, onComplete }: InteractiveLogModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const step = STEPS[currentStep];

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleOptionSelect = (optionLabel: string) => {
        if (step.multi) {
            const current = selections[step.id] || [];
            if (current.includes(optionLabel)) {
                setSelections({ ...selections, [step.id]: current.filter((l: string) => l !== optionLabel) });
            } else {
                setSelections({ ...selections, [step.id]: [...current, optionLabel] });
            }
        } else {
            setSelections({ ...selections, [step.id]: optionLabel });
            // For mood (single select), auto-advance
            if (step.id === "mood") {
                setTimeout(handleNext, 400);
            }
        }
    };

    const handleComplete = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            onComplete(selections);
            setIsSubmitting(false);
            onClose();
            setCurrentStep(0);
            setSelections({});
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative z-10 w-full max-w-lg glass-premium rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                    <motion.div
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    />
                </div>

                <div className="p-8 pt-10">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-foreground-muted hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight">{step.title}</h2>
                                <p className="text-sm text-foreground-muted">{step.subtitle}</p>
                            </div>

                            {step.options ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {step.options.map((option) => {
                                        const isSelected = step.multi
                                            ? selections[step.id]?.includes(option.label)
                                            : selections[step.id] === option.label;

                                        return (
                                            <button
                                                key={option.label}
                                                onClick={() => handleOptionSelect(option.label)}
                                                className={cn(
                                                    "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all duration-300",
                                                    isSelected
                                                        ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                                        : "bg-white/5 border-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", option.bg, option.color)}>
                                                    <option.icon size={28} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{option.label}</span>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
                                                    >
                                                        <Check size={12} className="text-black stroke-[4]" />
                                                    </motion.div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <textarea
                                        autoFocus
                                        placeholder="A small win, a person, or just a moment..."
                                        className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                                        onChange={(e) => setSelections({ ...selections, [step.id]: e.target.value })}
                                        value={selections[step.id] || ""}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between mt-12">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[9px] disabled:opacity-0"
                        >
                            <ChevronLeft size={16} className="mr-2" />
                            Back
                        </Button>

                        {(step.multi || step.type === "text") && (
                            <Button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="h-14 px-10 rounded-2xl bg-emerald-500 text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] font-black uppercase tracking-widest text-[10px]"
                            >
                                {isSubmitting ? (
                                    <Sparkles className="animate-spin" />
                                ) : (
                                    <>
                                        {currentStep === STEPS.length - 1 ? "Complete Daily Goal" : "Continue"}
                                        <ChevronRight size={16} className="ml-2" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
