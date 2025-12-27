"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
    Users,
    Search,
    Filter,
    TrendingUp,
    Target,
    Activity,
    Calendar,
    Heart,
    Save,
    X,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

interface Client {
    id: string;
    name: string;
    email: string;
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
    age?: number;
    gender?: string;
    goal?: string;
    activityLevel?: string;
    medicalNotes?: string;
    assignedPlan?: string;
}

interface NutritionPlan {
    id: string;
    name: string;
    description: string;
    targetGoal: string;
    features: string[];
}

export default function NutritionistAdminPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [plans, setPlans] = useState<NutritionPlan[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
    const [customCalories, setCustomCalories] = useState("");
    const [customProtein, setCustomProtein] = useState("");
    const [customCarbs, setCustomCarbs] = useState("");
    const [customFat, setCustomFat] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        fetchClients();
        fetchPlans();
    }, []);

    async function fetchClients() {
        try {
            const response = await fetch("/api/expert/clients");
            if (!response.ok) throw new Error("Failed to fetch clients");
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchPlans() {
        try {
            const response = await fetch("/api/expert/plans");
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.error("Failed to fetch plans");
        }
    }

    function calculateRecommendedMacros(client: Client) {
        if (!client.currentWeight || !client.height) return null;

        const weight = client.currentWeight;
        const height = client.height;
        const age = client.age || 30;
        const gender = client.gender === "M" ? "male" : "female";

        // Calculate BMR (Mifflin-St Jeor)
        let bmr;
        if (gender === "male") {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Activity multiplier
        const activityMultipliers: any = {
            "SEDENTARY": 1.2,
            "LIGHT": 1.375,
            "MODERATE": 1.55,
            "ACTIVE": 1.725,
            "ATHLETE": 1.9
        };

        const tdee = bmr * (activityMultipliers[client.activityLevel || "MODERATE"] || 1.55);

        // Adjust for goal
        let targetCalories = tdee;
        if (client.goal === "LOSS") {
            targetCalories = tdee - 500; // 500 cal deficit
        } else if (client.goal === "RECOMPOSITION") {
            targetCalories = tdee; // Maintain
        }

        // Calculate macros
        const protein = weight * 2.2; // 2.2g per kg
        const fat = Math.round((targetCalories * 0.25) / 9); // 25% from fat
        const carbCals = targetCalories - (protein * 4) - (fat * 9);
        const carbs = Math.round(carbCals / 4);

        return {
            calories: Math.round(targetCalories),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat),
            bmr: Math.round(bmr),
            tdee: Math.round(tdee)
        };
    }

    async function assignPlan() {
        if (!selectedClient || !selectedPlan) return;

        setSaving(true);
        try {
            await fetch("/api/expert/plans/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedClient.id,
                    planId: selectedPlan,
                    customMacros: {
                        calories: customCalories,
                        protein: customProtein,
                        carbs: customCarbs,
                        fat: customFat
                    },
                    notes
                })
            });

            // Update local state
            setClients(clients.map(c =>
                c.id === selectedClient.id
                    ? { ...c, assignedPlan: selectedPlan }
                    : c
            ));

            // Close modal
            setSelectedClient(null);
            setSelectedPlan("");
            setNotes("");
        } catch (error) {
            console.error("Failed to assign plan");
        } finally {
            setSaving(false);
        }
    }

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            Nutritionist <span className="text-primary">Dashboard</span>
                        </h1>
                        <p className="text-foreground-muted text-base">
                            Create and assign personalized nutrition plans
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <Users size={16} className="text-primary" />
                        <span className="text-sm font-bold text-primary">{clients.length} Clients</span>
                    </div>
                </div>
            </FadeIn>

            {/* Search */}
            <div className="relative group w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search clients by name or email..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Clients Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client, index) => {
                    const macros = calculateRecommendedMacros(client);

                    return (
                        <FadeIn key={client.id} delay={index * 0.05}>
                            <div className="glass-premium rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all space-y-4">
                                {/* Client Info */}
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{client.name}</h3>
                                    <p className="text-xs text-foreground-muted">{client.email}</p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-1">Current</p>
                                        <p className="text-xl font-bold">{client.currentWeight || "—"} kg</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-1">Target</p>
                                        <p className="text-xl font-bold">{client.targetWeight || "—"} kg</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-1">Height</p>
                                        <p className="text-xl font-bold">{client.height || "—"} cm</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-1">Age</p>
                                        <p className="text-xl font-bold">{client.age || "—"}</p>
                                    </div>
                                </div>

                                {/* Goal */}
                                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Goal</p>
                                    <p className="text-sm font-bold">{client.goal || "Not set"}</p>
                                </div>

                                {/* Recommended Macros */}
                                {macros && (
                                    <div className="p-3 rounded-xl bg-sage/5 border border-sage/10">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-sage mb-2">Recommended Macros</p>
                                        <div className="grid grid-cols-4 gap-2 text-center">
                                            <div>
                                                <p className="text-xs font-bold">{macros.calories}</p>
                                                <p className="text-[8px] text-foreground-muted">Cal</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">{macros.protein}g</p>
                                                <p className="text-[8px] text-foreground-muted">Pro</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">{macros.carbs}g</p>
                                                <p className="text-[8px] text-foreground-muted">Carb</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">{macros.fat}g</p>
                                                <p className="text-[8px] text-foreground-muted">Fat</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Assigned Plan */}
                                {client.assignedPlan && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                                        <CheckCircle2 size={14} className="text-green-500" />
                                        <span className="text-xs font-bold text-green-500">Plan Assigned</span>
                                    </div>
                                )}

                                {/* Actions */}
                                <Button
                                    onClick={() => {
                                        setSelectedClient(client);
                                        if (macros) {
                                            setCustomCalories(macros.calories.toString());
                                            setCustomProtein(macros.protein.toString());
                                            setCustomCarbs(macros.carbs.toString());
                                            setCustomFat(macros.fat.toString());
                                        }
                                    }}
                                    className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {client.assignedPlan ? "Update Plan" : "Assign Plan"}
                                </Button>
                            </div>
                        </FadeIn>
                    );
                })}
            </div>

            {/* Plan Assignment Modal */}
            {selectedClient && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-premium rounded-3xl p-8 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Assign Plan: {selectedClient.name}</h2>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedClient(null)}>
                                <X size={20} />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Select Plan */}
                            <div>
                                <label className="text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                                    Select Plan Template
                                </label>
                                <select
                                    value={selectedPlan}
                                    onChange={(e) => setSelectedPlan(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-foreground"
                                >
                                    <option value="">Choose a plan...</option>
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Custom Macros */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                                        Calories
                                    </label>
                                    <input
                                        type="number"
                                        value={customCalories}
                                        onChange={(e) => setCustomCalories(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-foreground"
                                        placeholder="2000"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                                        Protein (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={customProtein}
                                        onChange={(e) => setCustomProtein(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-foreground"
                                        placeholder="150"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                                        Carbs (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={customCarbs}
                                        onChange={(e) => setCustomCarbs(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-foreground"
                                        placeholder="200"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                                        Fat (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={customFat}
                                        onChange={(e) => setCustomFat(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-foreground"
                                        placeholder="55"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                                    Notes for Client
                                </label>
                                <textarea
                                    rows={4}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all resize-none text-foreground"
                                    placeholder="Additional guidance, restrictions, or recommendations..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => setSelectedClient(null)}
                                    variant="outline"
                                    className="flex-1 rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={assignPlan}
                                    disabled={!selectedPlan || saving}
                                    className="flex-1 rounded-xl bg-primary text-primary-foreground"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} className="mr-2" />
                                            Assign Plan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
