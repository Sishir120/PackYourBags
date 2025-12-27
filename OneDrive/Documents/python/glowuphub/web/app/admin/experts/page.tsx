"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
    Users,
    MessageSquare,
    TrendingUp,
    Activity,
    Search,
    Filter,
    ArrowUpRight,
    Heart
} from "lucide-react";
import { motion } from "framer-motion";

export default function ExpertAdminPage() {
    const clients = [
        { id: 1, name: "Elena R.", status: "Elite", glowScore: 92, consistency: "100%", lastActive: "2 mins ago" },
        { id: 2, name: "Sophia M.", status: "Pro", glowScore: 85, consistency: "88%", lastActive: "1 hour ago" },
        { id: 3, name: "Isabella K.", status: "Elite", glowScore: 95, consistency: "95%", lastActive: "Just now" },
        { id: 4, name: "Mia W.", status: "Standard", glowScore: 78, consistency: "75%", lastActive: "3 hours ago" },
    ];

    return (
        <div className="min-h-screen bg-[#09090B] text-foreground p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Expert Hub</h1>
                    <p className="text-zinc-400">Guiding our premium clients to their radiant potential.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <MessageSquare className="w-4 h-4 mr-2" /> Message All
                    </Button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Active Clients", value: "154", icon: Users, color: "text-primary" },
                    { label: "Avg. Glow Score", value: "88", icon: Heart, color: "text-rose-400" },
                    { label: "Consistency", value: "92%", icon: Activity, color: "text-sage" },
                    { label: "Pending Chats", value: "12", icon: MessageSquare, color: "text-lavender" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Client List */}
                <div className="lg:col-span-2">
                    <Card className="bg-zinc-900/50 border-zinc-800 h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-white">Client Progress Matrix</CardTitle>
                            <div className="relative w-48">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                <input
                                    placeholder="Search clients..."
                                    className="w-full bg-zinc-950 border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {clients.map((client) => (
                                    <motion.div
                                        key={client.id}
                                        whileHover={{ y: -2 }}
                                        className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-primary/30 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                {client.name[0]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-white">{client.name}</p>
                                                    <Badge variant="outline" className="text-[10px] py-0 border-primary/20 text-primary">
                                                        {client.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-zinc-500">Last active: {client.lastActive}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Glow</p>
                                                <p className="font-bold text-primary">{client.glowScore}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Consist.</p>
                                                <p className="font-bold text-white">{client.consistency}</p>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <Badge className="bg-sage/20 text-sage border-0 text-[10px]">Scientific</Badge>
                                                <p className="text-[10px] text-zinc-500 mt-1">Validated</p>
                                            </div>
                                            <Button size="sm" variant="ghost" className="rounded-full hover:bg-primary/20 text-primary">
                                                View <ArrowUpRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Insight Panel */}
                <div>
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-sage" /> Priority Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800">
                                    <p className="text-sm font-medium text-white mb-2">Consistency Drop Detected</p>
                                    <p className="text-xs text-zinc-400 mb-3">Sophia M. has missed 3 sessions of "Morning Routines" this week.</p>
                                    <Button size="sm" className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700">Message Support</Button>
                                </div>
                                <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800">
                                    <p className="text-sm font-medium text-white mb-2">New Personal Best</p>
                                    <p className="text-xs text-zinc-400 mb-3">Elena R. achieved a 95 Glow Score 3 days in a row.</p>
                                    <Button size="sm" className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700">Send Kudos ✨</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
