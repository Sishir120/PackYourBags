"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Flame,
    Timer,
    Calendar as CalendarIcon,
    Sparkles,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityLog {
    id: string;
    date: Date;
    type: string;
    duration: number;
    calories: number;
    intensity: 'Low' | 'Moderate' | 'High';
}

const MOCK_HISTORY: ActivityLog[] = [
    { id: '1', date: new Date(2023, 11, 22), type: 'Walking', duration: 45, calories: 210, intensity: 'Moderate' },
    { id: '2', date: new Date(2023, 11, 21), type: 'Yoga', duration: 30, calories: 120, intensity: 'Low' },
    { id: '3', date: new Date(2023, 11, 20), type: 'HIIT', duration: 25, calories: 350, intensity: 'High' },
    { id: '4', date: new Date(2023, 11, 18), type: 'Cycling', duration: 60, calories: 480, intensity: 'High' },
    { id: '5', date: new Date(2023, 11, 15), type: 'Walking', duration: 20, calories: 95, intensity: 'Low' },
];

export function ActivityCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const getActivityForDate = (day: number) => {
        return MOCK_HISTORY.filter(log =>
            log.date.getDate() === day &&
            log.date.getMonth() === currentDate.getMonth() &&
            log.date.getFullYear() === currentDate.getFullYear()
        );
    };

    const selectedLogs = selectedDate ? getActivityForDate(selectedDate.getDate()) : [];

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Main View */}
            <div className="lg:col-span-2 space-y-6">
                <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                                <CalendarIcon size={20} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/5 border border-white/5 transition-all">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/5 border border-white/5 transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted py-2 opacity-50">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square opacity-0" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const logs = getActivityForDate(day);
                            const hasActivity = logs.length > 0;
                            const isSelected = selectedDate?.getDate() === day;
                            const maxIntensity = logs.reduce((max, log) => {
                                if (log.intensity === 'High') return 'High';
                                if (log.intensity === 'Moderate' && max !== 'High') return 'Moderate';
                                return max;
                            }, 'None' as 'None' | 'Low' | 'Moderate' | 'High');

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                    className={cn(
                                        "aspect-square rounded-2xl border transition-all relative group flex flex-col items-center justify-center p-2",
                                        isSelected ? "bg-primary border-primary text-black" : "bg-white/3 border-white/5 hover:border-white/10",
                                        !isSelected && hasActivity && (
                                            maxIntensity === 'High' ? "bg-primary/20 border-primary/40" :
                                                maxIntensity === 'Moderate' ? "bg-sage/20 border-sage/40" :
                                                    "bg-white/5 border-white/10"
                                        )
                                    )}
                                >
                                    <span className={cn("text-sm font-black", isSelected ? "text-black" : "text-white/40")}>{day}</span>
                                    {!isSelected && hasActivity && (
                                        <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Heatmap Legend */}
                <div className="flex items-center gap-6 px-4">
                    <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">Intensity Index</span>
                    <div className="flex gap-4">
                        {[
                            { label: 'Low', color: 'bg-white/5 border-white/10' },
                            { label: 'Moderate', color: 'bg-sage/20 border-sage/40' },
                            { label: 'High', color: 'bg-primary/20 border-primary/40' }
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded-md border", item.color)} />
                                <span className="text-[10px] font-bold text-foreground-muted opacity-60 uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Detail Sidebar */}
            <div className="space-y-6">
                <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5 h-full">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Sparkles size={12} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Daily Digest</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight tabular-nums">
                            {selectedDate?.toLocaleDateString('default', { day: 'numeric', month: 'short' })}
                        </h3>
                    </div>

                    {selectedLogs.length > 0 ? (
                        <div className="space-y-4">
                            {selectedLogs.map(log => (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={log.id}
                                    className="p-5 rounded-3xl bg-white/3 border border-white/5 space-y-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{log.type}</p>
                                            <h4 className="text-lg font-bold tracking-tight">Immersive Session</h4>
                                        </div>
                                        <div className={cn(
                                            "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
                                            log.intensity === 'High' ? "bg-primary/10 text-primary" : "bg-white/5 text-foreground-muted"
                                        )}>
                                            {log.intensity}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Timer size={12} className="text-foreground-muted" />
                                            <span className="text-xs font-bold text-foreground-muted">{log.duration}m</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Flame size={12} className="text-orange-400" />
                                            <span className="text-xs font-bold text-foreground-muted">{log.calories} kcal</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-foreground-muted uppercase tracking-widest">Daily Total</span>
                                    <span className="text-xl font-black text-white">{selectedLogs.reduce((acc, log) => acc + log.calories, 0)} <span className="text-[10px] text-foreground-muted font-bold ml-1">KCAL</span></span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                            <Zap size={48} />
                            <p className="text-xs font-bold uppercase tracking-widest">No protocol data recorded</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
