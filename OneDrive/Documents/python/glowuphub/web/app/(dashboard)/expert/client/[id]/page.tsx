"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    Calculator,
    ClipboardList,
    Save,
    TrendingUp,
    User,
    Scale,
    ArrowUpRight,
    Sparkles,
    CheckCircle2,
    Calendar,
    UtensilsCrossed,
    Zap,
    History,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import {
    calculateBMR,
    calculateTDEE,
    getCalorieTarget,
    calculateMacros,
    ActivityLevel,
    Gender,
    Goal
} from "@/lib/calculations";

const MOCK_CLIENT_DATA = {
    id: "c1",
    name: "Alex Rivera",
    age: 28,
    weight: 85.5,
    height: 182,
    gender: 'M' as Gender,
    activityLevel: 'MODERATE' as ActivityLevel,
    goal: 'LOSS' as Goal,
    history: [
        { date: '2025-12-01', weight: 89.2 },
        { date: '2025-12-08', weight: 87.8 },
        { date: '2025-12-15', weight: 86.4 },
        { date: '2025-12-22', weight: 85.5 },
    ]
};

export default function ClientNutritionPlanner({ params }: { params: { id: string } }) {
    const [client, setClient] = useState(MOCK_CLIENT_DATA);
    const [isSaving, setIsSaving] = useState(false);

    // Planner State
    const [weight, setWeight] = useState(client.weight);
    const [activity, setActivity] = useState<ActivityLevel>(client.activityLevel);
    const [goal, setGoal] = useState<Goal>(client.goal);

    // Derived Calculations
    const bmr = useMemo(() => calculateBMR(weight, client.height, client.age, client.gender), [weight, activity, goal]);
    const tdee = useMemo(() => calculateTDEE(bmr, activity), [bmr, activity]);
    const calorieTarget = useMemo(() => getCalorieTarget(tdee, goal), [tdee, goal]);
    const macros = useMemo(() => calculateMacros(calorieTarget, weight, goal), [calorieTarget, weight, goal]);

    const handleSavePrescription = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 2000);
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/expert" className="flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors font-bold text-sm tracking-widest uppercase">
                    <ChevronLeft size={16} /> Back to Oversight
                </Link>
                <div className="flex gap-4">
                    <Button
                        onClick={handleSavePrescription}
                        className="rounded-2xl h-12 px-6 gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {isSaving ? <CheckCircle2 size={18} className="animate-in fade-in" /> : <Save size={18} />}
                        {isSaving ? "Prescription Saved" : "Save Prescription"}
                    </Button>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-10">
                {/* Left: Client Profile & Bio */}
                <div className="space-y-8">
                    <FadeIn direction="up">
                        <div className="glass-premium rounded-[3rem] p-10 border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <User size={120} />
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center font-black text-3xl text-primary border border-primary/20 shadow-[0_0_30px_rgba(0,251,255,0.1)]">
                                    AR
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">{client.name}</h2>
                                    <p className="text-foreground-muted font-bold uppercase tracking-widest text-xs">Bio Integrity ID: {client.id.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Biological Age</span>
                                    <p className="text-lg font-bold">{client.age} yrs</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Current Stature</span>
                                    <p className="text-lg font-bold">{client.height} cm</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Start Weight</span>
                                    <p className="text-lg font-bold">89.2 kg</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Current Weight</span>
                                    <p className="text-lg font-bold text-primary">{weight} kg</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.2}>
                        <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5 space-y-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <History size={20} className="text-primary" />
                                Protocol History
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { ver: 'v2.1', date: 'Dec 15', goal: 'Deficit' },
                                    { ver: 'v2.0', date: 'Dec 01', goal: 'Initial Base' },
                                ].map((h, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 cursor-pointer">
                                        <div>
                                            <span className="text-[10px] font-black text-primary">{h.ver}</span>
                                            <p className="text-[10px] font-bold text-foreground-muted">{h.date} • {h.goal}</p>
                                        </div>
                                        <ChevronLeft size={12} className="rotate-180 opacity-40" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Center: Prescription System */}
                <div className="xl:col-span-2 space-y-8">
                    <FadeIn direction="up">
                        <section className="glass-premium rounded-[3rem] border border-white/5 p-10 space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <Calculator size={200} />
                            </div>

                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Nutrition Prescription Planner</h2>
                                    <p className="text-foreground-muted text-sm">Fine-tune metabolic targets based on biometric data.</p>
                                </div>
                                <div className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Zap size={16} fill="currentColor" />
                                        <span className="text-lg font-black tracking-tighter">{calorieTarget} <span className="text-[10px] uppercase font-bold text-primary/70">kcal / day</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Control Grid */}
                            <div className="grid md:grid-cols-3 gap-8 relative z-10">
                                {/* Weight Control */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Base Weight (kg)</label>
                                        <span className="text-xs font-black text-primary">{weight}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="40"
                                        max="200"
                                        step="0.1"
                                        value={weight}
                                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-[8px] font-bold opacity-30">
                                        <span>40kg</span>
                                        <span>200kg</span>
                                    </div>
                                </div>

                                {/* Activity Control */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Metabolic Load</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['SEDENTARY', 'MODERATE', 'ACTIVE', 'ATHLETE'] as ActivityLevel[]).map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setActivity(lvl)}
                                                className={cn(
                                                    "px-3 py-2 rounded-xl text-[10px] font-bold border transition-all",
                                                    activity === lvl
                                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                                        : "bg-white/5 border-white/5 text-foreground-muted hover:border-white/20"
                                                )}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Goal Control */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Therapeutic Objective</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['LOSS', 'MAINTENANCE', 'RECOMPOSITION', 'GAIN'] as Goal[]).map(g => (
                                            <button
                                                key={g}
                                                onClick={() => setGoal(g)}
                                                className={cn(
                                                    "px-3 py-2 rounded-xl text-[10px] font-bold border transition-all",
                                                    goal === g
                                                        ? "bg-sage text-background border-sage shadow-lg shadow-sage/20"
                                                        : "bg-white/5 border-white/5 text-foreground-muted hover:border-white/20"
                                                )}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Macro Distribution */}
                            <div className="grid md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
                                <div className="glass-premium rounded-3xl p-6 border border-white/5 relative group hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <UtensilsCrossed size={14} className="text-primary" />
                                        </div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Protein</span>
                                    </div>
                                    <div className="text-3xl font-black mb-1 tracking-tighter">{macros.protein}g</div>
                                    <p className="text-[10px] text-foreground-muted font-bold tracking-widest uppercase">Target: {(macros.protein * 4 / calorieTarget * 100).toFixed(0)}% Energy</p>
                                </div>

                                <div className="glass-premium rounded-3xl p-6 border border-white/5 relative group hover:border-rose-500/20 transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                            <Sparkles size={14} className="text-rose-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Carbohydrates</span>
                                    </div>
                                    <div className="text-3xl font-black mb-1 tracking-tighter">{macros.carbs}g</div>
                                    <p className="text-[10px] text-foreground-muted font-bold tracking-widest uppercase">Target: {(macros.carbs * 4 / calorieTarget * 100).toFixed(0)}% Energy</p>
                                </div>

                                <div className="glass-premium rounded-3xl p-6 border border-white/5 relative group hover:border-amber-500/20 transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                            <Scale size={14} className="text-amber-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Dietary Fats</span>
                                    </div>
                                    <div className="text-3xl font-black mb-1 tracking-tighter">{macros.fat}g</div>
                                    <p className="text-[10px] text-foreground-muted font-bold tracking-widest uppercase">Target: {(macros.fat * 9 / calorieTarget * 100).toFixed(0)}% Energy</p>
                                </div>
                            </div>
                        </section>
                    </FadeIn>

                    {/* Diet Structure & Clinical Notes */}
                    <FadeIn direction="up" delay={0.4}>
                        <div className="grid md:grid-cols-2 gap-10">
                            <section className="glass-premium rounded-[3rem] border border-white/5 p-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">Client Protocol Structure</h2>
                                    <Button variant="ghost" className="rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest">Reset</Button>
                                </div>
                                <div className="space-y-4">
                                    <PlanSegment label="Breakfast" macros={{ p: 35, c: 45, f: 15 }} time="08:00 AM" />
                                    <PlanSegment label="Lunch" macros={{ p: 45, c: 65, f: 20 }} time="01:30 PM" />
                                    <PlanSegment label="Dinner" macros={{ p: 40, c: 50, f: 18 }} time="07:30 PM" />
                                </div>
                            </section>

                            <section className="glass-premium rounded-[3rem] border border-white/5 p-10 space-y-8">
                                <div className="flex items-center gap-2">
                                    <FileText size={20} className="text-primary" />
                                    <h2 className="text-xl font-bold">Clinical Observations</h2>
                                </div>
                                <textarea
                                    className="w-full h-[300px] bg-white/5 border border-white/5 rounded-[2rem] p-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 font-medium placeholder:text-foreground-muted/20 resize-none"
                                    placeholder="Enter clinical observations, client feedback, or specific supplement protocols..."
                                />
                                <div className="flex items-center gap-2 px-2">
                                    <div className="w-2 h-2 rounded-full bg-sage" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Auto-saved to Cloud</span>
                                </div>
                            </section>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}

function PlanSegment({ label, macros, time }: any) {
    return (
        <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-secondary/50 transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/20 transition-all">
                    <UtensilsCrossed size={18} className="text-foreground-muted group-hover:text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-lg leading-none mb-1">{label}</h4>
                    <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">{time}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-center px-4 border-r border-white/5">
                    <span className="text-[9px] font-black uppercase opacity-40 block mb-1">PRO</span>
                    <span className="font-bold text-primary">{macros.p}g</span>
                </div>
                <div className="text-center px-4 border-r border-white/5">
                    <span className="text-[9px] font-black uppercase opacity-40 block mb-1">CHO</span>
                    <span className="font-bold text-rose-500">{macros.c}g</span>
                </div>
                <div className="text-center px-4">
                    <span className="text-[9px] font-black uppercase opacity-40 block mb-1">FAT</span>
                    <span className="font-bold text-amber-500">{macros.f}g</span>
                </div>
                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/5">
                    <ArrowUpRight size={18} className="opacity-40" />
                </Button>
            </div>
        </div>
    );
}
