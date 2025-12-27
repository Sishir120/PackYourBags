'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Play, Clock, Dumbbell, History, Check } from 'lucide-react';
import { useSound } from '@/hooks/use-sound';
import { cn } from '@/lib/utils';
import { Timer } from '@/components/ui/timer';

interface ExerciseSet {
    id: string;
    reps: number;
    weight: number;
    completed: boolean;
}

interface Exercise {
    id: string;
    name: string;
    sets: ExerciseSet[];
}

export function SessionLogger() {
    const { playSuccess } = useSound();
    const [isActive, setIsActive] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [exercises, setExercises] = useState<Exercise[]>([
        {
            id: '1',
            name: 'Bench Press',
            sets: [
                { id: 's1', reps: 10, weight: 135, completed: false },
                { id: 's2', reps: 10, weight: 135, completed: false },
                { id: 's3', reps: 8, weight: 135, completed: false },
            ]
        }
    ]);

    const toggleSet = (exerciseId: string, setId: string) => {
        const exercise = exercises.find(e => e.id === exerciseId);
        const set = exercise?.sets.find(s => s.id === setId);

        if (set && !set.completed) {
            playSuccess(); // Satisfying ding on completion
        }

        setExercises(prev => prev.map(e => {
            if (e.id !== exerciseId) return e;
            return {
                ...e,
                sets: e.sets.map(s => {
                    if (s.id !== setId) return s;
                    return { ...s, completed: !s.completed };
                })
            };
        }));
    };

    const addExercise = () => {
        const newExercise: Exercise = {
            id: Math.random().toString(),
            name: 'New Exercise',
            sets: [{ id: Math.random().toString(), reps: 10, weight: 0, completed: false }]
        };
        setExercises([...exercises, newExercise]);
    };

    return (
        <div className="text-center py-10 px-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group cursor-pointer" onClick={() => setIsActive(true)}>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                <Play className="text-primary ml-1" size={24} fill="currentColor" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Initiate Live Session</h3>
            <p className="text-[12px] text-foreground-muted max-w-sm mx-auto leading-relaxed">
                Log hypertrophy variables, track chronostatic rest intervals, and visualize volumetric growth.
            </p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Session Header */}
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/5 sticky top-0 z-20 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Active Synthesis</h3>
                        <p className="text-[9px] text-red-400 font-mono uppercase tracking-tighter">Biokinetic Recording...</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        playSuccess();
                        setIsActive(false);
                    }}
                    className="px-5 py-2 bg-primary text-black font-black rounded-lg text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                    Conclude Session
                </button>
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {exercises.map((exercise, i) => (
                        <motion.div
                            key={exercise.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card/40 rounded-2xl border border-white/5 overflow-hidden"
                        >
                            <div className="p-3 bg-white/[0.03] flex justify-between items-center border-b border-white/5">
                                <input
                                    value={exercise.name}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        setExercises(prev => prev.map((ex, idx) => idx === i ? { ...ex, name: newName } : ex));
                                    }}
                                    className="bg-transparent font-black text-sm text-white focus:outline-none focus:text-primary transition-colors w-full uppercase tracking-tight"
                                />
                                <div className="flex gap-2">
                                    <button className="p-1.5 hover:bg-white/5 rounded-lg text-foreground-muted hover:text-red-400 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-2">
                                <div className="grid grid-cols-10 gap-2 mb-2 px-2 text-[10px] uppercase font-bold text-foreground-muted tracking-wider text-center">
                                    <div className="col-span-1">Set</div>
                                    <div className="col-span-3">lbs</div>
                                    <div className="col-span-3">Reps</div>
                                    <div className="col-span-1"></div>
                                    <div className="col-span-2">Done</div>
                                </div>

                                <div className="space-y-1">
                                    {exercise.sets.map((set, setIndex) => (
                                        <div
                                            key={set.id}
                                            className={cn(
                                                "grid grid-cols-10 gap-2 items-center p-2 rounded-xl transition-all duration-300",
                                                set.completed ? "bg-emerald-500/10" : "hover:bg-white/5"
                                            )}
                                        >
                                            <div className="col-span-1 text-center font-mono text-sm text-foreground-muted">{setIndex + 1}</div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    value={set.weight}
                                                    className="w-full bg-secondary/50 rounded-lg px-2 py-1 text-center font-mono text-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    value={set.reps}
                                                    className="w-full bg-secondary/50 rounded-lg px-2 py-1 text-center font-mono text-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div className="col-span-1"></div>
                                            <div className="col-span-2 flex justify-center">
                                                <button
                                                    onClick={() => toggleSet(exercise.id, set.id)}
                                                    className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                                                        set.completed
                                                            ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110"
                                                            : "bg-secondary text-foreground-muted hover:bg-secondary/80"
                                                    )}
                                                >
                                                    <Check size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-2 mt-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                    <Plus size={14} /> Add Set
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button
                    onClick={addExercise}
                    className="w-full py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-foreground-muted hover:text-white hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-[0.2em]"
                >
                    <Plus size={16} />
                    Add Exercise Protocol
                </button>
            </div>
        </div>
    );
}
