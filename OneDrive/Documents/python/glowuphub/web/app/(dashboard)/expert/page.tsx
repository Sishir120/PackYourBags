"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
    Users,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    MessageSquare,
    Search,
    Activity,
    Calendar,
    Sliders,
    Star,
    Clock,
    Target,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";

interface Client {
    id: string;
    name: string;
    goal: string;
    adherence: number;
    metabolicFlag: "green" | "yellow" | "red";
    lastAction: string;
    nextSession: string;
    macros: { protein: number; calories: number; fat: number };
    velocity: number;
}

const MOCK_CLIENTS: Client[] = [
    {
        id: "c1",
        name: "Alex Rivera",
        goal: "Weight Loss",
        adherence: 92,
        metabolicFlag: "green",
        lastAction: "Logged Breakfast",
        nextSession: "Today, 4:00 PM",
        macros: { protein: 95, calories: 88, fat: 70 },
        velocity: -0.8
    },
    {
        id: "c2",
        name: "Jordan Smith",
        goal: "Muscle Gain",
        adherence: 65,
        metabolicFlag: "red",
        lastAction: "Missed 2 Workouts",
        nextSession: "Tomorrow, 10:00 AM",
        macros: { protein: 40, calories: 110, fat: 95 },
        velocity: +0.2
    },
    {
        id: "c3",
        name: "Elena Vance",
        goal: "Maintenance",
        adherence: 88,
        metabolicFlag: "yellow",
        lastAction: "High Sodium Alert",
        nextSession: "Jan 15, 2:00 PM",
        macros: { protein: 80, calories: 95, fat: 85 },
        velocity: -0.3
    },
];

export default function ExpertDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        // Simulate API loading
        setTimeout(() => {
            setClients(MOCK_CLIENTS);
            setLoading(false);
        }, 500);
    }, []);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.goal.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeClients = clients.length;
    const avgAdherence = clients.length > 0
        ? Math.round(clients.reduce((sum, c) => sum + c.adherence, 0) / clients.length)
        : 0;
    const alerts = clients.filter(c => c.metabolicFlag === "red").length;
    const todaySessions = clients.filter(c => c.nextSession.includes("Today")).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <FadeIn direction="down">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-1.5">
                            Care <span className="text-primary">Team</span> Dashboard
                        </h1>
                        <p className="text-foreground-muted text-base leading-relaxed">
                            Monitor client progress and provide expert guidance
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="rounded-2xl h-12 gap-2"
                        >
                            <Calendar size={18} />
                            <span className="hidden sm:inline">Review Schedule</span>
                        </Button>
                        <Link href="/chat">
                            <Button className="rounded-2xl h-12 bg-primary text-primary-foreground gap-2">
                                <MessageSquare size={18} />
                                <span className="hidden sm:inline">Client Messages</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </FadeIn>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <QuickStat
                    label="Active Clients"
                    value={activeClients.toString()}
                    icon={<Users className="text-primary" />}
                    trend="+3 this week"
                />
                <QuickStat
                    label="Avg Adherence"
                    value={`${avgAdherence}%`}
                    icon={<Target className="text-sage" />}
                    trend={avgAdherence >= 80 ? "Excellent" : "Needs attention"}
                    color={avgAdherence >= 80 ? "sage" : "amber"}
                />
                <QuickStat
                    label="Alerts"
                    value={alerts.toString()}
                    icon={<AlertCircle className="text-rose-500" />}
                    color="rose"
                />
                <QuickStat
                    label="Sessions Today"
                    value={todaySessions.toString()}
                    icon={<Clock className="text-lavender" />}
                    color="lavender"
                />
            </div>

            <div className="grid xl:grid-cols-3 gap-10">
                {/* Client List */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold">Client Roster ({filteredClients.length})</h2>
                        <div className="relative group w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredClients.length === 0 ? (
                        <div className="glass-premium rounded-2xl p-12 border border-white/5 text-center">
                            <p className="text-foreground-muted">No clients found matching your search.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredClients.map((client, index) => (
                                <FadeIn key={client.id} delay={index * 0.05}>
                                    <Link href={`/expert/client/${client.id}`} className="block">
                                        <div className="glass-premium rounded-2xl p-5 md:p-6 border border-white/5 hover:border-primary/20 transition-all group">
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                {/* Client Identity */}
                                                <div className="flex items-center gap-3 min-w-[180px]">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-sage/20 flex items-center justify-center font-black text-lg text-primary border border-white/10 group-hover:border-primary/30 transition-all">
                                                        {client.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-base leading-none mb-1.5">{client.name}</h4>
                                                        <p className="text-[10px] text-foreground-muted uppercase tracking-wider flex items-center gap-1">
                                                            <Target size={10} />
                                                            {client.goal}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Macro Progress */}
                                                <div className="flex-1 grid grid-cols-3 gap-4 md:gap-6">
                                                    <MacroMini label="Protein" value={client.macros.protein} color="primary" />
                                                    <MacroMini label="Energy" value={client.macros.calories} color="rose" />
                                                    <MacroMini label="Fat" value={client.macros.fat} color="amber" />
                                                </div>

                                                {/* Status & Actions */}
                                                <div className="flex items-center gap-4 lg:gap-6 pl-0 lg:pl-8 lg:border-l border-white/5">
                                                    <div className="flex-1 text-left lg:text-right">
                                                        <div className="flex items-center justify-start lg:justify-end gap-2 mb-1.5">
                                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Adherence</span>
                                                            <span className={cn(
                                                                "text-sm font-bold px-2 py-0.5 rounded-full",
                                                                client.adherence > 85 ? "bg-sage/10 text-sage" :
                                                                    client.adherence > 70 ? "bg-amber-400/10 text-amber-400" :
                                                                        "bg-rose-400/10 text-rose-400"
                                                            )}>{client.adherence}%</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 justify-start lg:justify-end">
                                                            <span className={cn(
                                                                "text-[10px] font-black",
                                                                client.velocity < 0 ? "text-primary" : "text-rose-400"
                                                            )}>
                                                                {client.velocity > 0 ? '+' : ''}{client.velocity}kg/wk
                                                            </span>
                                                            {client.metabolicFlag === 'green' && <CheckCircle2 size={14} className="text-sage" />}
                                                            {client.metabolicFlag === 'yellow' && <AlertCircle size={14} className="text-amber-400" />}
                                                            {client.metabolicFlag === 'red' && <AlertCircle size={14} className="text-rose-500" />}
                                                        </div>
                                                        <p className="text-[9px] text-foreground-muted mt-1 italic">{client.lastAction}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/chat?client=${client.id}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                                                            >
                                                                <MessageSquare size={18} />
                                                            </Button>
                                                        </Link>
                                                        <Link
                                                            href={`/expert/client/${client.id}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-lavender/20 hover:text-lavender transition-all"
                                                            >
                                                                <Sliders size={18} />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeIn>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Analytics Pane */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold">Team Analytics</h2>
                    <div className="glass-premium rounded-[2.5rem] p-7 border border-white/5 space-y-8">
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Transformation Velocity</h4>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black tabular-nums">-14.2</p>
                                <span className="text-[9px] font-bold text-foreground-muted uppercase tracking-widest opacity-40">kg total this month</span>
                            </div>
                            <p className="text-[8px] text-foreground-muted font-bold">
                                Team Adherence: <span className="text-sage">{avgAdherence}%</span> • <span className="text-primary">Avg -0.6kg/wk</span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">Client Health Distribution</h4>
                            <div className="h-6 w-full flex rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-sage w-[60%] border-r border-background/20" />
                                <div className="h-full bg-amber-400 w-[25%] border-r border-background/20" />
                                <div className="h-full bg-rose-500 w-[15%]" />
                            </div>
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-50 px-1">
                                <span>Stable (60%)</span>
                                <span>Monitoring (25%)</span>
                                <span>Critical (15%)</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">Immediate Priorities</h4>
                            {alerts > 0 && (
                                <PriorityItem
                                    label={`Critical: ${clients.find(c => c.metabolicFlag === "red")?.name}`}
                                    desc="Requires immediate attention"
                                    color="rose"
                                />
                            )}
                            {todaySessions > 0 && (
                                <PriorityItem
                                    label={`${todaySessions} Session${todaySessions > 1 ? 's' : ''} Today`}
                                    desc="Review prep materials"
                                    color="primary"
                                />
                            )}
                            <PriorityItem
                                label="Weekly Reports Due"
                                desc="Analyze progress trends"
                                color="lavender"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickStat({ label, value, icon, trend, color = "primary" }: any) {
    return (
        <FadeIn>
            <div className="glass-premium rounded-2xl p-5 border border-white/5 space-y-4 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        color === "rose" ? "bg-rose-500/10" :
                            color === "sage" ? "bg-sage/10" :
                                color === "amber" ? "bg-amber-500/10" :
                                    color === "lavender" ? "bg-lavender/10" :
                                        "bg-primary/10"
                    )}>
                        {icon}
                    </div>
                    {trend && <span className="text-[8px] font-bold text-sage uppercase tracking-tighter opacity-70">{trend}</span>}
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">{label}</p>
                    <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
                </div>
            </div>
        </FadeIn>
    );
}

function MacroMini({ label, value, color }: any) {
    const colors: any = {
        primary: "bg-primary",
        rose: "bg-rose-500",
        amber: "bg-amber-500"
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end px-1">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{label}</span>
                <span className="text-[10px] font-bold">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={cn("h-full", colors[color])}
                />
            </div>
        </div>
    );
}

function PriorityItem({ label, desc, color }: any) {
    const colors: any = {
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        primary: "bg-primary/10 text-primary border-primary/20",
        lavender: "bg-lavender/10 text-lavender border-lavender/20"
    };

    return (
        <div className={cn("flex items-start gap-3 p-3 rounded-xl border group cursor-pointer hover:bg-white/5 transition-all", colors[color])}>
            <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", colors[color])} />
            <div className="flex-1">
                <h5 className="text-[10px] font-bold leading-none mb-1 group-hover:text-primary transition-colors">{label}</h5>
                <p className="text-[9px] text-foreground-muted">{desc}</p>
            </div>
        </div>
    );
}
