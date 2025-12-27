"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    X,
    ChevronRight,
    Utensils,
    Camera,
    Check,
    Scale,
    Zap,
    Leaf,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MealLoggerProps {
    onSave: (data: any) => void;
    onClose: () => void;
}

export function MealLogger({ onSave, onClose }: MealLoggerProps) {
    const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
    const [description, setDescription] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const payload = {
            mealType,
            description,
            calories: parseInt(calories) || 0,
            protein: parseInt(protein) || 0,
            carbs: parseInt(carbs) || 0,
            fat: parseInt(fat) || 0,
            date: new Date().toISOString()
        };

        try {
            const res = await fetch('/api/meallogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSave(await res.json());
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Utensils size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Log a <span className="text-primary italic">Meal</span></h3>
                        <p className="text-xs text-foreground-muted font-bold uppercase tracking-widest">Scientific Nutrition Entry</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                    <X size={20} className="text-foreground-muted" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Meal Type Selector */}
                <div className="grid grid-cols-4 gap-3">
                    {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setMealType(type)}
                            className={cn(
                                "p-4 rounded-2xl border transition-all text-sm font-bold",
                                mealType === type
                                    ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                                    : "bg-white/5 border-white/5 text-foreground-muted hover:border-white/20"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Description & Photo Section */}
                <div className="space-y-4">
                    <div className="relative group">
                        <textarea
                            placeholder="What did you eat today?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all resize-none"
                        />
                        <button type="button" className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/10 hover:bg-primary/20 hover:text-primary transition-all text-foreground-muted">
                            <Camera size={20} />
                        </button>
                    </div>
                </div>

                {/* Macro Inputs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MacroInput
                        label="Calories"
                        value={calories}
                        onChange={setCalories}
                        icon={<Zap size={16} />}
                        unit="kcal"
                        color="text-amber-400"
                    />
                    <MacroInput
                        label="Protein"
                        value={protein}
                        onChange={setProtein}
                        icon={<Check size={16} />}
                        unit="g"
                        color="text-primary"
                    />
                    <MacroInput
                        label="Carbs"
                        value={carbs}
                        onChange={setCarbs}
                        icon={<Leaf size={16} />}
                        unit="g"
                        color="text-blue-400"
                    />
                    <MacroInput
                        label="Fat"
                        value={fat}
                        onChange={setFat}
                        icon={<Scale size={16} />}
                        unit="g"
                        color="text-rose-400"
                    />
                </div>

                {/* Professional Summary/Advice (Mocked) */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                    <Info size={18} className="text-primary mt-0.5" />
                    <p className="text-xs text-foreground-muted leading-relaxed">
                        <span className="text-primary font-bold">Expert Tip:</span> High protein intake during breakfast maintains satiety throughout the day and supports metabolic fire.
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={isSaving || !description}
                    className="w-full h-16 rounded-[2rem] bg-primary text-primary-foreground font-black text-lg shadow-[0_20px_40px_rgba(45,212,191,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    {isSaving ? "Saving Entry..." : "Log Entry"}
                </Button>
            </form>
        </motion.div>
    );
}

function MacroInput({ label, value, onChange, icon, unit, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 px-2">
                <span className={cn("opacity-70", color)}>{icon}</span>
                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{label}</span>
            </div>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-center placeholder:opacity-20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-foreground-muted/50">{unit}</span>
            </div>
        </div>
    );
}
