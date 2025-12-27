'use client';

import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SplitType = 'PPL' | 'Arnold' | 'UpperLower' | 'BroSplit';

interface SplitSelectorProps {
    currentSplit: SplitType;
    onSelect: (split: SplitType) => void;
}

const SPLITS: { id: SplitType; name: string; description: string; schedule: string[] }[] = [
    {
        id: 'PPL',
        name: 'Push / Pull / Legs',
        description: 'The gold standard for aesthetics & strength. 6 days/week.',
        schedule: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Rest']
    },
    {
        id: 'Arnold',
        name: 'Arnold Split',
        description: 'Chest/Back, Shoulders/Arms, Legs. High volume intensity.',
        schedule: ['Chest/Back', 'Shoulder/Arm', 'Legs', 'Chest/Back', 'Shoulder/Arm', 'Legs', 'Rest']
    },
    {
        id: 'UpperLower',
        name: 'Upper / Lower',
        description: 'Balanced frequency for strength and recovery. 4 days/week.',
        schedule: ['Upper', 'Lower', 'Rest', 'Upper', 'Lower', 'Rest', 'Rest']
    },
    {
        id: 'BroSplit',
        name: 'Body Part Split',
        description: 'Focus on one muscle group per day. Maximum pump.',
        schedule: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Rest', 'Rest']
    },
];

export function SplitSelector({ currentSplit, onSelect }: SplitSelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Select Your Protocol</h3>
            <div className="grid gap-4 md:grid-cols-2">
                {SPLITS.map((split) => (
                    <button
                        key={split.id}
                        onClick={() => onSelect(split.id)}
                        className={cn(
                            "relative p-5 rounded-2xl text-left border transition-all duration-300 group overflow-hidden",
                            currentSplit === split.id
                                ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(251,113,133,0.15)]"
                                : "bg-card/40 border-white/5 hover:bg-card/60 hover:border-white/10"
                        )}
                    >
                        {currentSplit === split.id && (
                            <motion.div
                                layoutId="split-active"
                                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"
                            />
                        )}

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className={cn(
                                    "font-bold text-lg",
                                    currentSplit === split.id ? "text-primary" : "text-foreground group-hover:text-primary/80 transition-colors"
                                )}>
                                    {split.name}
                                </span>
                                {currentSplit === split.id && <Check size={18} className="text-primary" />}
                            </div>

                            <p className="text-sm text-foreground-muted mb-4 leading-relaxed">
                                {split.description}
                            </p>

                            <div className="flex gap-1 flex-wrap">
                                {split.schedule.slice(0, 3).map((day, i) => (
                                    <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-secondary text-foreground-muted border border-white/5">
                                        {day}
                                    </span>
                                ))}
                                <span className="text-[10px] px-2 py-1 text-foreground-muted">...</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
