"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
    User,
    Shield,
    Bell,
    Database,
    LogOut,
    ChevronRight,
    TrendingUp,
    Calendar,
    Award,
    Zap,
    Sparkles,
    Mail,
    Edit2,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import { useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/ui/toast";

const ACHIEVEMENTS = [
    { id: 1, name: "Early Bird", description: "Completed 5 morning flows.", icon: <Zap size={20} className="text-orange-400" />, color: "bg-orange-500/10 border-orange-500/20" },
    { id: 2, name: "Deep Glow", description: "Maintained an 85+ score for a week.", icon: <Sparkles size={20} className="text-primary" />, color: "bg-primary/10 border-primary/20" },
    { id: 3, name: "Hydra Master", description: "Logged 3L of water for 3 days.", icon: <Award size={20} className="text-sage" />, color: "bg-sage/10 border-sage/20" },
];

interface UserData {
    name: string;
    email: string;
    streak: number;
    glowScore: number;
    subscriptionTier: string;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
            setLoading(true);
            const response = await fetch("/api/user");
            if (!response.ok) throw new Error("Failed to fetch user data");

            const data = await response.json();
            setUserData({
                name: data.name || "User",
                email: data.email || "user@example.com",
                streak: data.streak || 0,
                glowScore: data.glowScore || 0,
                subscriptionTier: data.subscriptionTier || "free",
                createdAt: data.createdAt || new Date().toISOString()
            });
        } catch (error) {
            showToast("Failed to load profile data", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleSignOut() {
        try {
            localStorage.clear();
            sessionStorage.clear();
            showToast("Signing out...", "info");
            setTimeout(() => router.push("/"), 1000);
        } catch (error) {
            showToast("Failed to sign out", "error");
        }
    }

    function showToast(message: string, type: ToastType) {
        setToast({ message, type });
    }

    function getMemberSince() {
        if (!userData?.createdAt) return "Recently";
        const date = new Date(userData.createdAt);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    function getTierLabel() {
        if (!userData) return "Free";
        const tier = userData.subscriptionTier?.toLowerCase();
        if (tier === "premium") return "Premium";
        if (tier === "coach") return "Coach";
        return "Free";
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <FadeIn direction="down">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Profile & Preferences</h1>
            </FadeIn>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Profile Card & Basic Info */}
                <div className="lg:col-span-1 space-y-8">
                    <FadeIn>
                        <div className="glass-premium rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <User size={120} />
                            </div>

                            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                                <div className="relative group/avatar">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-sage/20 border border-white/10 flex items-center justify-center p-8 group-hover/avatar:scale-105 transition-transform duration-500">
                                        <User size={64} className="text-primary opacity-80" />
                                    </div>
                                    <button
                                        onClick={() => showToast("Avatar upload coming soon!", "info")}
                                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center border-4 border-background hover:scale-110 active:scale-90 transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">{userData?.name}</h2>
                                    <p className="text-foreground-muted flex items-center justify-center gap-2 mt-1">
                                        <Mail size={14} /> {userData?.email}
                                    </p>
                                </div>

                                <div className="pt-6 w-full flex flex-col gap-3">
                                    {getTierLabel() === "Free" ? (
                                        <Button
                                            onClick={() => router.push("/#pricing")}
                                            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/10"
                                        >
                                            Upgrade to Premium
                                        </Button>
                                    ) : (
                                        <div className="w-full h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <span className="font-bold text-primary">{getTierLabel()} Member</span>
                                        </div>
                                    )}
                                    <Button
                                        variant="ghost"
                                        onClick={() => showToast("Public profiles coming soon!", "info")}
                                        className="w-full h-14 rounded-2xl text-foreground-muted hover:text-foreground hover:bg-white/5"
                                    >
                                        View Public Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5 space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground-muted/60">Account Info</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage">
                                        <Shield size={20} />
                                    </div>
                                    <span className="font-bold">Member Since</span>
                                </div>
                                <span className="text-sm font-medium text-foreground-muted">{getMemberSince()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="font-bold">Tier</span>
                                </div>
                                <span className="text-sm font-medium text-foreground-muted">{getTierLabel()}</span>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Detailed Stats & Achievements */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="grid sm:grid-cols-2 gap-8">
                        <FadeIn delay={0.2}>
                            <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5 h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg uppercase tracking-tight">Activity Streak</h3>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black tracking-tighter text-primary">{userData?.streak || 0}</span>
                                    <span className="text-lg font-bold text-foreground-muted">DAYS</span>
                                </div>
                                <p className="text-sm text-foreground-muted mt-4 italic">
                                    {(userData?.streak || 0) < 15
                                        ? "Next badge unlocked at day 15!"
                                        : "Amazing consistency! Keep it up!"}
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5 h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage">
                                        <Award size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg uppercase tracking-tight">Glow Score</h3>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black tracking-tighter text-sage">{userData?.glowScore || 0}</span>
                                </div>
                                <p className="text-sm text-foreground-muted mt-4 italic">
                                    {(userData?.glowScore || 0) >= 85
                                        ? "Top 5% of all members this month!"
                                        : "Keep going to reach the top tier!"}
                                </p>
                            </div>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.4}>
                        <div className="glass-premium rounded-[3rem] p-10 border border-white/5">
                            <h3 className="text-2xl font-bold mb-8">Unlocked Achievements</h3>
                            <div className="grid sm:grid-cols-3 gap-6">
                                {ACHIEVEMENTS.map((ach) => (
                                    <div key={ach.id} className={cn("p-6 rounded-[2rem] border flex flex-col items-center text-center space-y-4 group cursor-help transition-all hover:scale-105", ach.color)}>
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                            {ach.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">{ach.name}</h4>
                                            <p className="text-[10px] text-foreground-muted mt-1 leading-tight">{ach.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Quick Settings Access */}
                    <FadeIn delay={0.5}>
                        <div className="glass-premium rounded-[3rem] p-10 border border-white/5 space-y-8">
                            <h3 className="text-2xl font-bold">Account Settings</h3>
                            <div className="grid gap-4">
                                <SettingRow
                                    icon={<Bell size={18} />}
                                    label="Notification Preferences"
                                    onClick={() => router.push("/settings")}
                                />
                                <SettingRow
                                    icon={<Shield size={18} />}
                                    label="Security & Privacy"
                                    onClick={() => router.push("/settings")}
                                />
                                <SettingRow
                                    icon={<Database size={18} />}
                                    label="Data & Storage"
                                    onClick={() => showToast("Data export coming soon!", "info")}
                                />
                                <Button
                                    variant="ghost"
                                    onClick={handleSignOut}
                                    className="w-full h-16 rounded-2xl flex items-center justify-between px-6 text-coral hover:text-coral hover:bg-coral/10 border border-transparent hover:border-coral/20 group transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <LogOut size={18} className="group-hover:rotate-[-10deg] transition-transform" />
                                        <span className="font-bold uppercase tracking-widest text-xs">Sign Out</span>
                                    </div>
                                    <ChevronRight size={18} />
                                </Button>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

function SettingRow({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full h-16 rounded-2xl flex items-center justify-between px-6 bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group"
        >
            <div className="flex items-center gap-4 text-foreground/80 group-hover:text-foreground">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-1">
                    {icon}
                </div>
                <span className="font-bold text-sm tracking-tight">{label}</span>
            </div>
            <ChevronRight size={18} className="text-foreground-muted group-hover:text-primary transition-colors" />
        </button>
    );
}
