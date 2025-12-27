"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    ArrowRight,
    Scale,
    Ruler,
    Calendar,
    User,
    Activity,
    Target,
    Utensils,
    Stethoscope,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

type Step =
    | 'WELCOME'
    | 'NAME'
    | 'GENDER'
    | 'AGE'
    | 'HEIGHT'
    | 'WEIGHT'
    | 'ACTIVITY'
    | 'DIET'
    | 'GOAL'
    | 'MEDICAL'
    | 'SUMMARY';

const STEPS: Step[] = [
    'WELCOME',
    'NAME',
    'GENDER',
    'AGE',
    'HEIGHT',
    'WEIGHT',
    'ACTIVITY',
    'DIET',
    'GOAL',
    'MEDICAL',
    'SUMMARY'
];

export default function OnboardingPage() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: 25,
        height: 170,
        weight: 70,
        activityLevel: '',
        dietaryPref: 'NONE',
        goal: '',
        medicalNotes: ''
    });

    const currentStep = STEPS[currentStepIndex];
    const progress = (currentStepIndex / (STEPS.length - 1)) * 100;

    const next = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const back = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    const updateData = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sage/10 rounded-full blur-[120px]" />

            {/* Header / Progress */}
            <div className="p-8 flex items-center justify-between relative z-10 max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <div className="w-5 h-5 bg-primary rounded-md" />
                    </div>
                    <span className="font-black tracking-tighter text-xl uppercase italic">GlowUp <span className="text-primary">Hub</span></span>
                </div>

                <div className="hidden md:flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">Setup Progress</span>
                    <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-primary shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-2xl h-[500px] flex flex-col relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="w-full"
                        >
                            {renderStep(currentStep, formData, updateData, next)}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Controls */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02] backdrop-blur-xl relative z-20">
                <div className="max-w-xl mx-auto flex items-center justify-between gap-6">
                    <Button
                        variant="ghost"
                        onClick={back}
                        disabled={currentStepIndex === 0}
                        className="h-14 px-8 rounded-2xl text-foreground-muted hover:text-foreground hover:bg-white/5 disabled:opacity-0"
                    >
                        <ChevronLeft className="mr-2" size={20} /> Back
                    </Button>

                    {currentStep !== 'WELCOME' && currentStep !== 'SUMMARY' && (
                        <Button
                            onClick={next}
                            className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
                        >
                            Next <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Button>
                    )}

                    {currentStep === 'WELCOME' && (
                        <Button
                            onClick={next}
                            className="h-16 px-12 rounded-[2rem] bg-primary text-primary-foreground font-black text-lg shadow-[0_20px_40px_rgba(45,212,191,0.3)] hover:scale-105 active:scale-95 transition-all"
                        >
                            Start Consultation <ArrowRight className="ml-3" size={24} />
                        </Button>
                    )}

                    {currentStep === 'SUMMARY' && (
                        <Button
                            className="h-16 px-12 rounded-[2rem] bg-primary text-primary-foreground font-black text-lg shadow-[0_20px_40px_rgba(45,212,191,0.3)] hover:scale-105 active:scale-95 transition-all"
                        >
                            Finalize & Access <CheckCircle2 className="ml-3" size={24} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function renderStep(step: Step, data: any, update: (k: string, v: any) => void, next: () => void) {
    switch (step) {
        case 'WELCOME':
            return (
                <div className="text-center space-y-8">
                    <div className="w-24 h-24 rounded-[3rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-10 text-primary">
                        <User size={48} />
                    </div>
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">Welcome to <br /><span className="text-primary italic">Expert Guidance.</span></h1>
                        <p className="text-xl text-foreground-muted max-w-md mx-auto">This isn't a prototype. This is a scientific engine to help an expert understand you deeply.</p>
                    </div>
                </div>
            );
        case 'NAME':
            return (
                <div className="space-y-10">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block">Introduction</span>
                        <h2 className="text-4xl font-bold tracking-tight">What should we call you?</h2>
                    </div>
                    <div className="relative group">
                        <input
                            autoFocus
                            type="text"
                            value={data.name}
                            onChange={(e) => update('name', e.target.value)}
                            placeholder="Your full name"
                            className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-3xl font-bold focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-foreground-muted/20"
                        />
                    </div>
                    <p className="text-sm text-foreground-muted italic leading-relaxed">We use your name to personalize your consultation reports and 1:1 communications.</p>
                </div>
            );
        case 'GENDER':
            return (
                <div className="space-y-10">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block">Biology</span>
                        <h2 className="text-4xl font-bold tracking-tight">Biological sex affects metabolic baseline.</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <OnboardingCard
                            label="Male"
                            active={data.gender === 'M'}
                            onClick={() => update('gender', 'M')}
                            icon={<User size={32} />}
                        />
                        <OnboardingCard
                            label="Female"
                            active={data.gender === 'F'}
                            onClick={() => update('gender', 'F')}
                            icon={<User size={32} className="opacity-70" />}
                        />
                    </div>
                    <p className="text-sm text-foreground-muted leading-relaxed">This is used for BMR calculations. You can specify gender identity in your profile settings later.</p>
                </div>
            );
        case 'AGE':
            return (
                <div className="space-y-10">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block">Metrics</span>
                        <h2 className="text-4xl font-bold tracking-tight">How many years young?</h2>
                    </div>
                    <div className="flex flex-col items-center gap-10">
                        <div className="text-8xl font-black text-primary tracking-tighter">{data.age}</div>
                        <input
                            type="range"
                            min="16"
                            max="100"
                            value={data.age}
                            onChange={(e) => update('age', parseInt(e.target.value))}
                            className="w-full accent-primary h-2 bg-white/5 rounded-full cursor-pointer"
                        />
                    </div>
                    <p className="text-sm text-foreground-muted text-center italic">Calculations adjust as hormonal baselines shift over time.</p>
                </div>
            );
        case 'HEIGHT':
            return (
                <div className="space-y-10">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block">Metrics</span>
                        <h2 className="text-4xl font-bold tracking-tight">Your height in CM?</h2>
                    </div>
                    <div className="flex flex-col items-center gap-10">
                        <div className="flex items-baseline gap-4">
                            <span className="text-8xl font-black text-primary tracking-tighter">{data.height}</span>
                            <span className="text-2xl font-bold text-foreground-muted">CM</span>
                        </div>
                        <input
                            type="range"
                            min="120"
                            max="240"
                            value={data.height}
                            onChange={(e) => update('height', parseInt(e.target.value))}
                            className="w-full accent-primary h-2 bg-white/5 rounded-full cursor-pointer"
                        />
                    </div>
                </div>
            );
        case 'WEIGHT':
            return (
                <div className="space-y-10">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block">Baseline</span>
                        <h2 className="text-4xl font-bold tracking-tight">Current body weight?</h2>
                    </div>
                    <div className="flex flex-col items-center gap-10">
                        <div className="flex items-baseline gap-4">
                            <span className="text-8xl font-black text-primary tracking-tighter">{data.weight}</span>
                            <span className="text-2xl font-bold text-foreground-muted">KG</span>
                        </div>
                        <input
                            type="range"
                            min="40"
                            max="200"
                            value={data.weight}
                            onChange={(e) => update('weight', parseInt(e.target.value))}
                            className="w-full accent-primary h-2 bg-white/5 rounded-full cursor-pointer"
                        />
                    </div>
                    <p className="text-sm text-foreground-muted text-center">Be honest. This is a judgment-free zone used only for science.</p>
                </div>
            );
        case 'ACTIVITY':
            return (
                <div className="space-y-8">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2 block">Lifestyle</span>
                        <h2 className="text-3xl font-bold tracking-tight">Active daily movement?</h2>
                    </div>
                    <div className="grid gap-4">
                        <SimpleOption active={data.activityLevel === 'SEDENTARY'} onClick={() => update('activityLevel', 'SEDENTARY')} label="Sedentary" desc="Little to no exercise / Desk job" />
                        <SimpleOption active={data.activityLevel === 'LIGHT'} onClick={() => update('activityLevel', 'LIGHT')} label="Light" desc="1-3 sessions per week" />
                        <SimpleOption active={data.activityLevel === 'MODERATE'} onClick={() => update('activityLevel', 'MODERATE')} label="Moderate" desc="3-5 sessions per week" />
                        <SimpleOption active={data.activityLevel === 'ACTIVE'} onClick={() => update('activityLevel', 'ACTIVE')} label="Active" desc="6-7 sessions per week" />
                    </div>
                </div>
            );
        case 'DIET':
            return (
                <div className="space-y-8">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2 block">Nutrition</span>
                        <h2 className="text-3xl font-bold tracking-tight">Dietary preferences?</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SimpleOption active={data.dietaryPref === 'NONE'} onClick={() => update('dietaryPref', 'NONE')} label="Anything" />
                        <SimpleOption active={data.dietaryPref === 'VEGAN'} onClick={() => update('dietaryPref', 'VEGAN')} label="Vegan" />
                        <SimpleOption active={data.dietaryPref === 'VEGETARIAN'} onClick={() => update('dietaryPref', 'VEGETARIAN')} label="Vegetarian" />
                        <SimpleOption active={data.dietaryPref === 'KETO'} onClick={() => update('dietaryPref', 'KETO')} label="Keto" />
                    </div>
                </div>
            );
        case 'GOAL':
            return (
                <div className="space-y-8">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2 block">Destination</span>
                        <h2 className="text-3xl font-bold tracking-tight">Primary focus?</h2>
                    </div>
                    <div className="grid gap-4">
                        <ActiveOption
                            active={data.goal === 'LOSS'}
                            onClick={() => update('goal', 'LOSS')}
                            label="Fat Loss"
                            desc="Drop weight while preserving lean muscle."
                            icon={<Scale size={24} />}
                        />
                        <ActiveOption
                            active={data.goal === 'RECOMPOSITION'}
                            onClick={() => update('goal', 'RECOMPOSITION')}
                            label="Body Recomp"
                            desc="Focus on muscle shift and toning."
                            icon={<Activity size={24} />}
                        />
                        <ActiveOption
                            active={data.goal === 'MAINTENANCE'}
                            onClick={() => update('goal', 'MAINTENANCE')}
                            label="Maintenance"
                            desc="Optimizing performance and stability."
                            icon={<Target size={24} />}
                        />
                    </div>
                </div>
            );
        case 'MEDICAL':
            return (
                <div className="space-y-8">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2 block">Constraints</span>
                        <h2 className="text-3xl font-bold tracking-tight">Anything we should know?</h2>
                        <p className="text-xs text-foreground-muted mt-2">Optional: Injuries, metabolic conditions, or allergies.</p>
                    </div>
                    <textarea
                        value={data.medicalNotes}
                        onChange={(e) => update('medicalNotes', e.target.value)}
                        placeholder="e.g., Lower back injury, PCOS, Peanut allergy..."
                        className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all resize-none"
                    />
                </div>
            );
        case 'SUMMARY':
            return (
                <div className="text-center space-y-8">
                    <div className="w-24 h-24 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center mx-auto mb-10 text-sage">
                        <CheckCircle2 size={48} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight mb-4">You're all set, {data.name.split(' ')[0]}.</h2>
                        <p className="text-xl text-foreground-muted max-w-md mx-auto">Your expert is ready to review your data and begin the first consultation.</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl inline-block max-w-sm mx-auto text-left space-y-2">
                        <p className="text-xs font-bold text-foreground-muted uppercase tracking-widest">Calculated Metrics</p>
                        <div className="flex justify-between font-bold"><span>BMI Baseline:</span> <span className="text-primary">24.2</span></div>
                        <div className="flex justify-between font-bold"><span>Est. TDEE:</span> <span className="text-primary">2,450 kcal</span></div>
                    </div>
                </div>
            );
    }
}

function OnboardingCard({ label, active, onClick, icon }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6",
                active
                    ? "bg-primary/10 border-primary shadow-[0_20px_40px_rgba(45,212,191,0.2)]"
                    : "bg-white/5 border-white/5 hover:border-white/20"
            )}
        >
            <div className={cn("p-4 rounded-2xl bg-white/5", active ? "text-primary" : "text-foreground-muted")}>
                {icon}
            </div>
            <span className={cn("text-2xl font-bold", active ? "text-foreground" : "text-foreground-muted")}>{label}</span>
        </button>
    );
}

function SimpleOption({ label, desc, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-6 rounded-[1.5rem] border text-left transition-all",
                active
                    ? "bg-primary/10 border-primary"
                    : "bg-white/5 border-white/5 hover:border-white/20"
            )}
        >
            <div className="font-bold text-lg">{label}</div>
            {desc && <div className="text-xs text-foreground-muted">{desc}</div>}
        </button>
    );
}

function ActiveOption({ label, desc, active, onClick, icon }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-8 rounded-[2rem] border-2 flex items-center gap-6 text-left transition-all group",
                active
                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                    : "bg-white/5 border-white/5 hover:border-white/20"
            )}
        >
            <div className={cn("p-4 rounded-2xl bg-white/10 transition-colors", active ? "text-primary bg-primary/20" : "text-foreground-muted group-hover:text-foreground")}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="font-bold text-xl">{label}</div>
                <div className="text-xs text-foreground-muted">{desc}</div>
            </div>
            {active && <CheckCircle2 size={24} className="text-primary" />}
        </button>
    );
}
