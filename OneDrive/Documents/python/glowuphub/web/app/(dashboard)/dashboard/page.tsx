"use client";

import { motion } from "framer-motion";
import { ActivityRings } from "@/components/dashboard/activity-rings";
import { SuccessStories } from "@/components/dashboard/success-stories";
import { LifestyleRituals } from "@/components/dashboard/lifestyle-rituals";
import { TransformationMap } from "@/components/dashboard/transformation-map";
import { ClinicalAdvice } from "@/components/dashboard/clinical-advice";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { StreakTracker } from "@/components/dashboard/streak-tracker";
import { FortuneCookie } from "@/components/rewards/fortune-cookie";
import { InteractiveLogModal } from "@/components/dashboard/interactive-log-modal";
import { useState } from "react";
import {
    Scale,
    Target,
    Zap,
    Flame,
    Droplets,
    Sparkles,
    ShieldCheck,
    Brain,
    Wind,
    Sun,
    Moon
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [isLogOpen, setIsLogOpen] = useState(false);

    return (
        <div className="space-y-16 pb-32">
            <InteractiveLogModal
                isOpen={isLogOpen}
                onClose={() => setIsLogOpen(false)}
                onComplete={(data) => {
                    console.log("Activity logged:", data);
                    // This is where real sync logic would go
                }}
            />
            {/* Clinical Greeting */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 px-4">
                <FadeIn direction="down">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Live Health Tracker</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none">
                            Welcome, <span className="text-emerald-500">Sishir</span>.
                        </h1>
                        <p className="text-lg text-foreground-muted max-w-xl leading-relaxed">
                            You're making <span className="text-foreground font-bold">Great Progress</span> this week.
                            Let's focus on staying active and healthy today.
                        </p>
                    </div>
                </FadeIn>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-16 px-8 rounded-2xl border-white/5 bg-white/3 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] group transition-all">
                        <ShieldCheck className="mr-2 w-4 h-4 text-emerald-500 group-hover:animate-pop" />
                        My Stats
                    </Button>
                    <Button
                        onClick={() => setIsLogOpen(true)}
                        className="h-16 px-10 rounded-2xl bg-emerald-500 text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] font-bold uppercase tracking-widest text-[10px]"
                    >
                        Start Daily Habits
                    </Button>
                </div>
            </header>

            {/* The Sanctuary Grid */}
            <div className="grid xl:grid-cols-12 gap-10">
                {/* Left: Bio-Data Visualization (8 cols) */}
                <div className="xl:col-span-8 space-y-10">
                    <FadeIn>
                        <StreakTracker count={5} activeDayIndex={4} days={['M', 'T', 'W', 'T', 'F', 'S', 'S']} />
                    </FadeIn>
                    <ClinicalAdvice />
                    {/* Primary Metabolic Engine */}
                    <FadeIn>
                        <div className="glass-premium rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-lavender/5 opacity-50" />

                            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                                <div className="relative group/bio">
                                    <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full opacity-30 group-hover/bio:opacity-60 transition-opacity duration-1000" />
                                    <ActivityRings size={280} move={82} glow={75} mind={60} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <Scale size={20} className="text-emerald-500 mb-1 opacity-50" />
                                        <span className="text-4xl font-black tracking-tighter">78.4</span>
                                        <span className="text-[10px] uppercase font-black text-foreground-muted tracking-[0.3em] mt-0.5">KG</span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-10">
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-bold tracking-tight">Daily Energy</h3>
                                        <p className="text-sm text-foreground-muted leading-relaxed">
                                            Your efficiency is at <span className="text-emerald-500 font-bold">85%</span>.
                                            You're successfully burning fat. Goal reach in <span className="text-foreground font-bold italic">14 days</span>!
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <BioStat
                                            label="Calorie Gap"
                                            value="-520"
                                            unit="kcal"
                                            icon={<Flame size={18} className="text-coral" />}
                                            trend="Great Job"
                                            progress={85}
                                            color="coral"
                                        />
                                        <BioStat
                                            label="Destination"
                                            value="72.0"
                                            unit="kg"
                                            icon={<Target size={18} className="text-emerald-500" />}
                                            trend="On track"
                                            progress={45}
                                            color="emerald"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Link href="/track" className="flex-1">
                                            <Button variant="ghost" className="w-full h-14 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                                                See Detailed Progress
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Transformation Map */}
                    <FadeIn delay={0.2}>
                        <TransformationMap />
                    </FadeIn>

                    {/* Ritual Integration */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <RitualCard
                            title="Body & Sleep"
                            desc="Stay hydrated and get enough rest for natural recovery."
                            icon={<Wind className="text-emerald-500" />}
                            stats={[{ label: "Water", value: "85%" }, { label: "Sleep", value: "7.2h" }]}
                        />
                        <RitualCard
                            title="Mind & Mood"
                            desc="Simple habits to stay focused, happy, and stress-free."
                            icon={<Brain className="text-lavender" />}
                            stats={[{ label: "Mood", value: "Stable" }, { label: "Focus", value: "High" }]}
                        />
                    </div>
                </div>

                {/* Right: Success & Accountability (4 cols) */}
                <aside className="xl:col-span-4 space-y-10">
                    <FadeIn direction="left" delay={0.4}>
                        <div className="glass-premium rounded-[3rem] p-8 border border-white/5 space-y-8">
                            <h3 className="text-xl font-bold tracking-tight">Our Success Stories</h3>
                            <SuccessStories />
                        </div>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.6}>
                        <FortuneCookie />
                    </FadeIn>

                    <FadeIn direction="left" delay={0.8}>
                        <div className="glass-premium rounded-[3rem] p-8 border border-white/5 space-y-8 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <h3 className="text-xl font-bold tracking-tight">Daily Rituals</h3>
                            <LifestyleRituals />
                        </div>
                    </FadeIn>

                    {/* Quick Insight Card */}
                    <FadeIn direction="left" delay={0.8}>
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                            <Sparkles size={24} className="text-emerald-500 mb-4" />
                            <p className="text-sm italic text-foreground-muted leading-relaxed mb-6">
                                "The body is the only sanctuary we truly own. Respect the protocol, and the protocol will respect your goals."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center font-black text-[10px] text-emerald-500">
                                    AI
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Your Health Guide AI</span>
                            </div>
                        </div>
                    </FadeIn>
                </aside>
            </div>
        </div>
    );
}

function BioStat({ label, value, unit, icon, trend, progress, color }: any) {
    const colors: any = {
        emerald: "bg-emerald-500",
        coral: "bg-coral",
        lavender: "bg-lavender"
    };

    return (
        <div className="glass-premium bg-white/2 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group/stat">
            <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/stat:rotate-6 transition-transform">
                    {icon}
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">{trend}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tabular-nums tracking-tighter">{value}</span>
                <span className="text-[9px] font-bold text-foreground-muted uppercase tracking-widest">{unit}</span>
            </div>
            <p className="text-[8px] font-black uppercase tracking-widest text-foreground-muted mt-0.5 opacity-50">{label}</p>
            <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={cn("h-full", colors[color])}
                />
            </div>
        </div>
    );
}

function RitualCard({ title, desc, icon, stats }: any) {
    return (
        <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5 hover:border-emerald-500/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:border-emerald-500/30 transition-all">
                {icon}
            </div>
            <h4 className="text-lg font-bold mb-3">{title}</h4>
            <p className="text-xs text-foreground-muted leading-relaxed mb-6">{desc}</p>
            <div className="pt-6 border-t border-white/5 flex gap-6">
                {stats.map((s: any) => (
                    <div key={s.label}>
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground-muted opacity-40 mb-1">{s.label}</p>
                        <p className="text-sm font-bold tracking-tight">{s.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
