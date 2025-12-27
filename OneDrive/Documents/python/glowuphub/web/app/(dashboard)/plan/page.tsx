"use client";

import React, { useState, useEffect } from 'react';
import { FadeIn } from "@/components/ui/fade-in";
import {
    Target,
    TrendingUp,
    Activity,
    Utensils,
    Heart,
    Calendar,
    MessageSquare,
    Sparkles,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NutritionPlan {
    name: string;
    description: string;
    assignedBy: string;
    assignedDate: string;
    macros: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    notes?: string;
    features: string[];
}

export default function MyPlanPage() {
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<NutritionPlan | null>(null);

    useEffect(() => {
        fetchPlan();
    }, []);

    async function fetchPlan() {
        try {
            // TODO: Create API to fetch user's assigned plan
            // For now, mock data
            setTimeout(() => {
                setPlan({
                    name: "Sustainable Weight Loss",
                    description: "Personalized plan designed by Sabita Subedi to help you reach your goals safely and sustainably.",
                    assignedBy: "Sabita Subedi",
                    assignedDate: "Dec 20, 2025",
                    macros: {
                        calories: 1800,
                        protein: 140,
                        carbs: 180,
                        fat: 50
                    },
                    notes: "Focus on whole foods and consistent meal timing. Prioritize protein at each meal to preserve muscle mass during your weight loss journey.",
                    features: [
                        "High protein (1.6-2.2g/kg)",
                        "Moderate carbs (2-3g/kg)",
                        "Strategic meal timing",
                        "Weekly check-ins"
                    ]
                });
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error("Failed to fetch plan");
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!plan) {
        return (
            <FadeIn>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="max-w-md text-center space-y-6">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Target size={32} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">No Plan Assigned Yet</h2>
                        <p className="text-foreground-muted">
                            Your nutritionist will create a personalized plan based on your goals and biometric data.
                        </p>
                        <Link href="/chat">
                            <Button className="rounded-full bg-primary text-primary-foreground">
                                <MessageSquare size={16} className="mr-2" />
                                Message Your Nutritionist
                            </Button>
                        </Link>
                    </div>
                </div>
            </FadeIn>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <FadeIn direction="down">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-1.5">
                            My Nutrition <span className="text-primary">Plan</span>
                        </h1>
                        <p className="text-foreground-muted text-base">
                            Personalized by Sabita Subedi
                        </p>
                    </div>
                    <Link href="/chat">
                        <Button className="rounded-2xl h-12 bg-primary text-primary-foreground gap-2">
                            <MessageSquare size={18} />
                            Ask Questions
                        </Button>
                    </Link>
                </div>
            </FadeIn>

            {/* Plan Overview */}
            <FadeIn delay={0.1}>
                <div className="glass-premium rounded-[3rem] p-8 border border-white/5 space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                            <p className="text-foreground-muted">{plan.description}</p>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-sage/10 border border-sage/20 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-sage" />
                            <span className="text-sm font-bold text-sage">Active</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-foreground-muted">
                        <Sparkles size={16} className="text-primary" />
                        <span>Assigned by <span className="font-bold text-foreground">{plan.assignedBy}</span> on {plan.assignedDate}</span>
                    </div>

                    {plan.notes && (
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <p className="text-sm font-bold text-primary mb-2">📝 Nutritionist Notes</p>
                            <p className="text-sm text-foreground-muted">{plan.notes}</p>
                        </div>
                    )}
                </div>
            </FadeIn>

            {/* Daily Macros */}
            <FadeIn delay={0.2}>
                <div>
                    <h3 className="text-xl font-bold mb-6">Daily Macro Targets</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MacroCard
                            icon={<Activity className="text-primary" />}
                            label="Calories"
                            value={plan.macros.calories}
                            unit="kcal"
                            color="primary"
                        />
                        <MacroCard
                            icon={<TrendingUp className="text-rose-500" />}
                            label="Protein"
                            value={plan.macros.protein}
                            unit="g"
                            color="rose"
                        />
                        <MacroCard
                            icon={<Utensils className="text-amber-500" />}
                            label="Carbs"
                            value={plan.macros.carbs}
                            unit="g"
                            color="amber"
                        />
                        <MacroCard
                            icon={<Heart className="text-lavender" />}
                            label="Fats"
                            value={plan.macros.fat}
                            unit="g"
                            color="lavender"
                        />
                    </div>
                </div>
            </FadeIn>

            {/* Plan Features */}
            <FadeIn delay={0.3}>
                <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5">
                    <h3 className="text-xl font-bold mb-6">Plan Features</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {plan.features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5"
                            >
                                <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                                <span className="text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {/* Quick Actions */}
            <FadeIn delay={0.4}>
                <div className="grid sm:grid-cols-3 gap-6">
                    <Link href="/track" className="block">
                        <div className="glass-premium rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all text-center space-y-3 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Utensils size={24} className="text-primary" />
                            </div>
                            <h4 className="font-bold">Log Meals</h4>
                            <p className="text-xs text-foreground-muted">Track your daily nutrition</p>
                        </div>
                    </Link>

                    <Link href="/chat" className="block">
                        <div className="glass-premium rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all text-center space-y-3 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-sage/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageSquare size={24} className="text-sage" />
                            </div>
                            <h4 className="font-bold">Message Sabita</h4>
                            <p className="text-xs text-foreground-muted">Get expert guidance</p>
                        </div>
                    </Link>

                    <Link href="/progress" className="block">
                        <div className="glass-premium rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all text-center space-y-3 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-lavender/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp size={24} className="text-lavender" />
                            </div>
                            <h4 className="font-bold">View Progress</h4>
                            <p className="text-xs text-foreground-muted">Track your journey</p>
                        </div>
                    </Link>
                </div>
            </FadeIn>
        </div>
    );
}

function MacroCard({ icon, label, value, unit, color }: any) {
    const colors: any = {
        primary: "bg-primary/10 border-primary/20",
        rose: "bg-rose-500/10 border-rose-500/20",
        amber: "bg-amber-500/10 border-amber-500/20",
        lavender: "bg-lavender/10 border-lavender/20"
    };

    return (
        <div className={cn("glass-premium rounded-2xl p-6 border space-y-4", colors[color])}>
            <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted mb-1">{label}</p>
                <p className="text-3xl font-black">
                    {value}
                    <span className="text-lg text-foreground-muted ml-1">{unit}</span>
                </p>
            </div>
        </div>
    );
}
