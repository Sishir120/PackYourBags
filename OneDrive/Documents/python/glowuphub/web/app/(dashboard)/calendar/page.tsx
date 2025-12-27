"use client";

import React from 'react';
import { ActivityCalendar } from "@/components/dashboard/activity-calendar";
import { FadeIn } from "@/components/ui/fade-in";
import { Sparkles, History, TrendingUp } from "lucide-react";

export default function CalendarPage() {
    return (
        <div className="space-y-12">
            <FadeIn direction="down">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Insight Hub</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-1.5">Activity <span className="text-primary italic">Archive</span></h1>
                        <p className="text-foreground-muted text-base leading-relaxed">Visualize your metabolic adaptation over time.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <History size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-foreground-muted opacity-40">Monthly Avg</p>
                                <p className="text-lg font-black tracking-tight">342 kcal</p>
                            </div>
                        </div>
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-foreground-muted opacity-40">Consistency</p>
                                <p className="text-lg font-black tracking-tight">92%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <ActivityCalendar />
        </div>
    );
}
