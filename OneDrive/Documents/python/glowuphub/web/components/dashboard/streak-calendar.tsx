"use client";

import { motion } from "framer-motion";
import { format, eachDayOfInterval, subDays, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

interface StreakCalendarProps {
    data: Record<string, number>;
    onToggleDate?: (date: string) => void;
}

export function StreakCalendar({ data, onToggleDate }: StreakCalendarProps) {
    // Generate last 60 days
    const today = new Date();
    // Use stable generation to avoid hydration mismatch if possible, or just memoize in parent.
    // For now, we keep generation here but rely on passed 'data' for status.
    const days = eachDayOfInterval({
        start: subDays(today, 59),
        end: today,
    });

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-6">
                <div className="flex gap-2 text-xs text-foreground-muted">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-secondary/50 border border-white/5" />
                        <span>Rest/Miss</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-primary/40 border border-primary/20" />
                        <span>Good</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-primary shadow-[0_0_10px_var(--primary)] border border-primary" />
                        <span>Perfect</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
                {days.map((day, i) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const status = data[dateKey] || 0;

                    return (
                        <motion.div
                            key={dateKey}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.005 }}
                            whileHover={{ scale: 1.1, zIndex: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onToggleDate && onToggleDate(dateKey)}
                            className={cn(
                                "aspect-square rounded-sm relative group cursor-pointer border transition-all duration-300",
                                status === 0 && "bg-white/3 border-white/5 hover:border-white/20",
                                status === 1 && "bg-emerald-500/30 border-emerald-500/30",
                                status === 2 && "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] border-emerald-500"
                            )}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity z-20 border border-white/10 backdrop-blur-md">
                                {format(day, 'MMM d')}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <p className="text-center text-xs text-foreground-muted mt-6 italic opacity-70">
                Tap any day to toggle status: Miss → Good → Perfect
            </p>
        </div>
    );
}
