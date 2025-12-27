"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Image as ImageIcon,
    Sparkles,
    User,
    Heart,
    Lock,
    ArrowRight,
    Star,
    Clock,
    TrendingUp,
    Target,
    Activity,
    Upload,
    X,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import Image from "next/image";

interface Message {
    id: string;
    role: "expert" | "user";
    content?: string;
    mediaUrl?: string;
    mediaType?: "IMAGE" | "VOICE";
    time: string;
}

interface UserStats {
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
    age?: number;
    goal?: string;
    adherence?: number;
}

const NUTRITIONIST = {
    id: "nutritionist_sabita",
    name: "Sabita Subedi",
    role: "Clinical Nutritionist",
    avatar: "SS",
    specialty: "Hormonal Health & Metabolic Healing",
    responseTime: "24-48h",
    rating: 4.9,
    status: "online"
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [userTier, setUserTier] = useState<string>("free"); // free, premium, coach
    const [userStats, setUserStats] = useState<UserStats>({});
    const [uploadingImage, setUploadingImage] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchUserData();
        fetchMessages();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function fetchUserData() {
        try {
            const response = await fetch("/api/user");
            const data = await response.json();

            setUserTier(data.subscriptionTier || "free");
            setUserStats({
                currentWeight: data.currentWeight,
                targetWeight: data.targetWeight,
                height: data.height,
                age: data.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() : undefined,
                goal: data.goal,
                adherence: 85 // Calculate from logs
            });
        } catch (error) {
            console.error("Failed to fetch user data");
        } finally {
            setLoading(false);
        }
    }

    async function fetchMessages() {
        try {
            const response = await fetch(`/api/messages?userId=${NUTRITIONIST.id}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.map((msg: any) => ({
                    id: msg.id,
                    role: msg.senderId === NUTRITIONIST.id ? "expert" : "user",
                    content: msg.content,
                    mediaUrl: msg.mediaUrl,
                    mediaType: msg.mediaType,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                })));
            }
        } catch (error) {
            console.error("Failed to fetch messages");
        }
    }

    async function handleSend() {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInput("");

        // Send to API
        try {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: NUTRITIONIST.id,
                    content: input
                })
            });
        } catch (error) {
            console.error("Failed to send message");
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);

        // TODO: Upload to cloud storage and get URL
        // For now, create a local URL
        const imageUrl = URL.createObjectURL(file);

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            mediaUrl: imageUrl,
            mediaType: "IMAGE",
            content: "📸 Progress photo",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setUploadingImage(false);

        // Send to API with media
        try {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: NUTRITIONIST.id,
                    content: "Progress photo",
                    mediaUrl: imageUrl,
                    mediaType: "IMAGE"
                })
            });
        } catch (error) {
            console.error("Failed to send image");
        }
    }

    // Show paywall for free users
    if (!loading && (userTier === "free" || (!userTier))) {
        return <PaywallScreen />;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-12rem)] flex gap-8">
            {/* User Stats Sidebar */}
            <div className="hidden xl:flex flex-col w-80 glass-premium rounded-[2.5rem] border border-white/5 p-6 space-y-6">
                <div>
                    <h2 className="font-bold text-lg mb-2">Your Profile</h2>
                    <p className="text-xs text-foreground-muted">Data shared with your nutritionist</p>
                </div>

                <div className="space-y-4">
                    <StatItem
                        icon={<TrendingUp size={16} />}
                        label="Current Weight"
                        value={userStats.currentWeight ? `${userStats.currentWeight} kg` : "Not set"}
                    />
                    <StatItem
                        icon={<Target size={16} />}
                        label="Target Weight"
                        value={userStats.targetWeight ? `${userStats.targetWeight} kg` : "Not set"}
                    />
                    <StatItem
                        icon={<Activity size={16} />}
                        label="Height"
                        value={userStats.height ? `${userStats.height} cm` : "Not set"}
                    />
                    <StatItem
                        icon={<Heart size={16} />}
                        label="Goal"
                        value={userStats.goal || "Not set"}
                    />
                </div>

                <div className="pt-6 border-t border-white/5">
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-primary" />
                            <span className="font-bold text-[10px] uppercase tracking-widest">Response Time</span>
                        </div>
                        <p className="text-sm font-bold text-primary">{NUTRITIONIST.responseTime}</p>
                        <p className="text-[10px] text-foreground-muted">
                            Sabita reviews messages daily. You'll get a personalized response within 24-48 hours.
                        </p>
                    </div>
                </div>

                <Link href="/dashboard/plan">
                    <Button className="w-full rounded-2xl bg-sage text-white hover:bg-sage/90">
                        View My Plan
                    </Button>
                </Link>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col glass-premium rounded-[3rem] border border-white/5 relative overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-sage/20 flex items-center justify-center font-black text-lg border border-white/10">
                                {NUTRITIONIST.avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sage border-2 border-background animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg leading-none">{NUTRITIONIST.name}</h3>
                                <div className="flex items-center gap-0.5">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs font-bold text-yellow-400">{NUTRITIONIST.rating}</span>
                                </div>
                            </div>
                            <p className="text-xs text-foreground-muted mt-1">{NUTRITIONIST.specialty}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                                <p className="text-[10px] text-sage font-bold uppercase tracking-widest">Online</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                {userTier === "coach" ? "Coach Tier" : "Premium"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth scrollbar-hide"
                >
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Sparkles size={32} className="text-primary" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Start Your Conversation</h3>
                            <p className="text-sm text-foreground-muted max-w-md mx-auto">
                                Ask Sabita about your nutrition goals, share progress photos, or get personalized meal advice.
                            </p>
                        </div>
                    )}

                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex items-start gap-4",
                                    msg.role === 'user' ? "flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border",
                                    msg.role === 'expert'
                                        ? "bg-primary/10 border-primary/20 text-primary"
                                        : "bg-white/5 border-white/10 text-foreground"
                                )}>
                                    {msg.role === 'expert' ? <Sparkles size={20} /> : <User size={20} />}
                                </div>

                                <div className={cn(
                                    "max-w-[75%] space-y-2",
                                    msg.role === 'user' ? "items-end text-right" : ""
                                )}>
                                    <div className={cn(
                                        "p-5 rounded-[1.5rem]",
                                        msg.role === 'expert'
                                            ? "bg-white/5 border border-white/5 text-foreground rounded-tl-none"
                                            : "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/10"
                                    )}>
                                        {msg.mediaUrl && msg.mediaType === "IMAGE" && (
                                            <div className="mb-3 rounded-xl overflow-hidden">
                                                <Image
                                                    src={msg.mediaUrl}
                                                    alt="Progress photo"
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-auto"
                                                />
                                            </div>
                                        )}
                                        {msg.content && <p className="text-sm leading-relaxed">{msg.content}</p>}
                                    </div>
                                    <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest opacity-50 px-2">{msg.time}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Input */}
                <div className="p-8 pt-4">
                    <div className="relative glass-premium border border-white/10 rounded-[2rem] p-2 flex items-center gap-2 transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_30px_rgba(0,251,255,0.05)]">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl text-foreground-muted hover:text-primary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                        </Button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about meals, share progress, or get advice..."
                            className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm placeholder:text-foreground-muted/50"
                        />

                        <Button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                                input.trim()
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "bg-white/5 text-foreground-muted opacity-50"
                            )}
                        >
                            <Send size={20} className={cn("transition-transform", input.trim() ? "translate-x-0.5 -translate-y-0.5" : "")} />
                        </Button>
                    </div>
                    <p className="text-[10px] text-foreground-muted text-center mt-4">
                        <Sparkles size={10} className="inline mr-1" />
                        Messages are private and secure • Reviewed by Sabita Subedi • <span className="text-primary">Avg. reply: 4 hours</span>
                    </p>
                </div>
            </div>
        </div >
    );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {icon}
                </div>
                <span className="text-xs font-bold text-foreground-muted">{label}</span>
            </div>
            <span className="text-sm font-bold">{value}</span>
        </div>
    );
}

function PaywallScreen() {
    return (
        <FadeIn>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="max-w-2xl text-center space-y-8">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                        <Lock size={40} className="text-primary" />
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Expert Chat is <span className="text-primary">Premium Only</span>
                        </h2>
                        <p className="text-lg text-foreground-muted">
                            Get personalized guidance from Sabita Subedi, clinical nutritionist with  4+ years helping women achieve sustainable results.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 max-w-xl mx-auto">
                        <div className="p-4 rounded-2xl bg-card border border-border">
                            <Star size={24} className="text-primary mx-auto mb-2" />
                            <p className="font-bold text-sm">4.9★ Rating</p>
                            <p className="text-xs text-foreground-muted">10K+ clients</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border">
                            <Clock size={24} className="text-sage mx-auto mb-2" />
                            <p className="font-bold text-sm">24-48h Reply</p>
                            <p className="text-xs text-foreground-muted">Fast support</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border">
                            <Heart size={24} className="text-rose-500 mx-auto mb-2" />
                            <p className="font-bold text-sm">92% Success</p>
                            <p className="text-xs text-foreground-muted">Real results</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/#pricing">
                            <Button size="lg" className="rounded-full h-14 px-8 bg-primary text-primary-foreground font-bold gap-2 shadow-lg shadow-primary/20">
                                Unlock Expert Chat
                                <ArrowRight size={20} />
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button size="lg" variant="outline" className="rounded-full h-14 px-8">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>

                    <p className="text-sm text-foreground-muted">
                        💬 Available with <span className="text-primary font-semibold">Coach Tier</span> ($49/month)
                    </p>
                </div>
            </div>
        </FadeIn>
    );
}
