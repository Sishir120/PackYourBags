"use client";

import { useEffect, useState } from "react";
import {
    Search,
    LayoutDashboard,
    Dumbbell,
    Activity,
    MessageSquare,
    ShieldCheck,
    User,
    Settings,
    Plus,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const COMMANDS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "Navigation" },
    { name: "Routines", href: "/routines", icon: Dumbbell, category: "Navigation" },
    { name: "Progress", href: "/track", icon: Activity, category: "Navigation" },
    { name: "AI Guide", href: "/chat", icon: MessageSquare, category: "Navigation" },
    { name: "Expert Portal", href: "/expert", icon: ShieldCheck, category: "Navigation" },
    { name: "Profile", href: "/profile", icon: User, category: "Navigation" },
    { name: "Settings", href: "/settings", icon: Settings, category: "Navigation" },
    { name: "Log Meal", action: "log-meal", icon: Plus, category: "Actions" },
    { name: "Log Weight", action: "log-weight", icon: Plus, category: "Actions" },
];

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const filteredCommands = COMMANDS.filter(cmd =>
        cmd.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (cmd: any) => {
        setIsOpen(false);
        if (cmd.href) {
            router.push(cmd.href);
        } else {
            console.log("Triggering action:", cmd.action);
            // Handle actions here or via custom event
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="glass-premium w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden"
                    >
                        <div className="flex items-center px-6 border-b border-white/5 h-16">
                            <Search className="w-5 h-5 text-foreground-muted mr-4" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for anything... (Type 'k' to navigate)"
                                className="flex-1 bg-transparent border-none text-lg focus:outline-none placeholder:text-foreground-muted/40 font-medium"
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black py-1 px-2 rounded-lg bg-white/5 text-foreground-muted uppercase tracking-widest">ESC</span>
                                <button onClick={() => setIsOpen(false)}>
                                    <X size={20} className="text-foreground-muted hover:text-foreground transition-colors" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                            {filteredCommands.length > 0 ? (
                                <div className="space-y-6">
                                    {["Navigation", "Actions"].map(category => {
                                        const categoryCommands = filteredCommands.filter(c => c.category === category);
                                        if (categoryCommands.length === 0) return null;
                                        return (
                                            <div key={category} className="space-y-2">
                                                <h3 className="px-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-50">{category}</h3>
                                                <div className="space-y-1">
                                                    {categoryCommands.map((cmd) => (
                                                        <button
                                                            key={cmd.name}
                                                            onClick={() => handleSelect(cmd)}
                                                            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/5 group transition-all text-left"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                                <cmd.icon size={18} />
                                                            </div>
                                                            <span className="font-bold text-sm tracking-tight">{cmd.name}</span>
                                                            <span className="ml-auto text-[10px] text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-foreground-muted text-sm font-medium">No commands found for "{query}"</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
