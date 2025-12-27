"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    Sun,
    Moon,
    Clock,
    ChevronRight,
    Sparkles,
    Zap,
    Play,
    Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";


const MOCK_RITUALS = [
    {
        id: "r1",
        name: "Morning Radiance",
        category: "Morning",
        description: "Start your day with clarity and energy.",
        habits: [
            { id: "h1", name: "Sunlight Exposure", duration: 10, description: "Get 10 minutes of direct sunlight." },
            { id: "h2", name: "Hydration Flow", duration: 2, description: "Drink 500ml of water with electrolytes." },
            { id: "h3", name: "Mindful Movement", duration: 15, description: "Gentle yoga or stretching." },
        ]
    },
    {
        id: "r2",
        name: "Evening Wind-down",
        category: "Evening",
        description: "Prepare your mind and body for deep rest.",
        habits: [
            { id: "h4", name: "Digital Detox", duration: 30, description: "No screens 30 mins before bed." },
            { id: "h5", name: "Gratitude Journal", duration: 5, description: "Note down 3 things you're grateful for." },
            { id: "h6", name: "Deep Breathing", duration: 5, description: "4-7-8 breathing technique." },
        ]
    }
];

const MOCK_WORKOUTS = [
    {
        id: "w1",
        name: "Metabolic Fire",
        category: "HIIT",
        description: "Ignite your metabolism with high-intensity intervals.",
        duration: 20,
        exercises: [
            { id: "e1", name: "Jump Squats", duration: 45, instructions: "Explode upwards, land softly.", targetMuscle: "Quads" },
            { id: "e2", name: "Mountain Climbers", duration: 45, instructions: "Maintain a flat back, drive knees.", targetMuscle: "Core" },
            { id: "e3", name: "Active Recovery", duration: 30, instructions: "Breathe deeply, light step.", targetMuscle: "Recovery" },
        ]
    },
    {
        id: "w2",
        name: "Zen Flow",
        category: "Yoga",
        description: "Restore balance and flexibility.",
        duration: 30,
        exercises: [
            { id: "e4", name: "Sun Salutations", duration: 120, instructions: "Flow with breath.", targetMuscle: "Full Body" },
            { id: "e5", name: "Warrior II", duration: 60, instructions: "Steady gaze, strong legs.", targetMuscle: "Legs" },
        ]
    }
];

import { ActivityProtocol, ProtocolStep } from "@/components/workouts/activity-protocol";

const RITUAL_PROTOCOLS: Record<string, ProtocolStep[]> = {
    'h1': [
        {
            title: "Face the Light",
            description: "Go outside or stand by a window. Let the sunlight hit your eyes (indirectly).",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/walking_protocol_main_1766485275665.png",
            duration: 300,
            tip: "This regulates your circadian rhythm and boosts serotonin."
        }
    ],
    'h2': [
        {
            title: "Hydration Ritual",
            description: "Sip slowly. Imagine the nutrients reaching every cell.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cooldown_protocol_common_1766485407095.png",
            duration: 60,
            tip: "Adding a pinch of sea salt can improve absorption."
        }
    ],
    'h3': [
        {
            title: "Morning Stretch",
            description: "Reach for the sky, then touch your toes. Wake up the spine.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/yoga_protocol_main_1766485293224.png",
            duration: 600,
            tip: "Focus on your breath as you move."
        }
    ],
    'h6': [
        {
            title: "4-7-8 Breathing",
            description: "Inhale for 4, hold for 7, exhale for 8. Relax your jaw.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/yoga_protocol_main_1766485293224.png",
            duration: 300,
            tip: "This triggers the parasympathetic nervous system."
        }
    ]
};

export default function RoutinesPage() {
    const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());
    const [activeWorkout, setActiveWorkout] = useState<any>(null);
    const [activeProtocol, setActiveProtocol] = useState<{ id: string, name: string, steps: ProtocolStep[] } | null>(null);

    const toggleHabit = (habitId: string) => {
        setCompletedHabits(prev => {
            const next = new Set(prev);
            if (next.has(habitId)) next.delete(habitId);
            else next.add(habitId);
            return next;
        });
    };

    const handleProtocolComplete = (habitId: string) => {
        toggleHabit(habitId);
        setActiveProtocol(null);
    };

    return (
        <div className="space-y-12 pb-20">
            {activeProtocol && (
                <ActivityProtocol
                    isOpen={!!activeProtocol}
                    onClose={() => setActiveProtocol(null)}
                    title={activeProtocol.name}
                    activityId={activeProtocol.id}
                    steps={activeProtocol.steps}
                    onComplete={() => handleProtocolComplete(activeProtocol.id)}
                />
            )}

            <FadeIn direction="down">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-1.5">Protocols <span className="text-primary">&</span> Play</h1>
                        <p className="text-foreground-muted text-base leading-relaxed">Structured movement for biological maintenance.</p>
                    </div>
                </div>
            </FadeIn>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Rituals Section */}
                <div className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted/40 px-1">Daily Rituals</h2>
                    <div className="space-y-4">
                        {MOCK_RITUALS.map((routine, index) => (
                            <FadeIn key={routine.id} delay={index * 0.1}>
                                <div className="glass-premium rounded-[2rem] p-6 border border-white/5 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                            routine.category === 'Morning' ? "bg-orange-500/10 text-orange-400" : "bg-purple-500/10 text-purple-400"
                                        )}>
                                            {routine.category === 'Morning' ? <Sun size={16} /> : <Moon size={16} />}
                                        </div>
                                        <h3 className="text-lg font-bold tracking-tight">{routine.name}</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {routine.habits.map((habit) => (
                                            <div key={habit.id} className="flex gap-2">
                                                <button
                                                    onClick={() => toggleHabit(habit.id)}
                                                    className={cn(
                                                        "flex-1 p-3 rounded-xl border flex items-center justify-between transition-all group",
                                                        completedHabits.has(habit.id) ? "bg-primary/5 border-primary/20" : "bg-white/3 border-white/5 hover:border-white/10"
                                                    )}
                                                >
                                                    <span className={cn("font-bold text-[13px] tracking-tight", completedHabits.has(habit.id) && "line-through opacity-50")}>{habit.name}</span>
                                                    {completedHabits.has(habit.id) ? <Check size={14} className="text-primary" /> : <div className="w-3.5 h-3.5 rounded-full border border-white/20 group-hover:border-white/40" />}
                                                </button>
                                                {RITUAL_PROTOCOLS[habit.id] && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setActiveProtocol({ id: habit.id, name: habit.name, steps: RITUAL_PROTOCOLS[habit.id] })}
                                                        className="px-3 rounded-xl border-white/5 hover:bg-primary/10 hover:text-primary transition-all"
                                                    >
                                                        <Play size={12} fill="currentColor" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>

                {/* Training Section */}
                <div className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted/40 px-1">Training Modules</h2>
                    <div className="space-y-4">
                        {MOCK_WORKOUTS.map((workout, index) => (
                            <FadeIn key={workout.id} delay={index * 0.1}>
                                <div className="glass-premium rounded-[2rem] p-6 border border-white/5 group hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.1em]">{workout.category}</span>
                                                <span className="text-[9px] font-black text-foreground-muted opacity-40 uppercase tracking-widest">{workout.duration} MINS</span>
                                            </div>
                                            <h3 className="text-xl font-black tracking-tight">{workout.name}</h3>
                                        </div>
                                        <Button
                                            onClick={() => setActiveWorkout(workout)}
                                            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground p-0 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/10"
                                        >
                                            <Play size={16} fill="currentColor" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-foreground-muted leading-relaxed opacity-70">{workout.description}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Session Overlay */}
            <AnimatePresence mode="wait">
                {activeWorkout && (
                    <ActivityProtocol
                        isOpen={!!activeWorkout}
                        onClose={() => setActiveWorkout(null)}
                        title={activeWorkout.name}
                        activityId={activeWorkout.category}
                        steps={activeWorkout.exercises.map((e: any) => ({
                            title: e.name,
                            description: e.instructions,
                            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/home_workout_main_1766485319868.png",
                            duration: e.duration,
                            tip: `Focus on your ${e.targetMuscle}`
                        }))}
                        onComplete={() => {
                            setActiveWorkout(null);
                            // Log logic here
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Routine Detail Card Placeholder */}
            <FadeIn delay={0.3}>
                <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                        <div className="w-full lg:w-1/4 aspect-square rounded-[2rem] bg-gradient-to-br from-primary/20 to-sage/20 border border-white/10 flex items-center justify-center p-6 group-hover:scale-[1.02] transition-transform duration-700">
                            <Sparkles size={80} className="text-primary opacity-40" />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                                Expert Recommendation
                            </div>
                            <h3 className="text-2xl font-bold italic tracking-tighter leading-tight">"The power of routines is not in the acts themselves, but in the consistency of the practice."</h3>
                            <p className="text-foreground-muted text-base leading-relaxed opacity-70">
                                Unlock higher energy levels and mental clarity by following these scientifically-backed metabolic protocols.
                                Members who complete both routines daily report a 40% increase in productivity.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <Button className="rounded-xl h-12 px-6 gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all font-bold text-sm tracking-tight">
                                    Explore Methodologies <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
