"use client";

import { useState } from "react";
import { Plus, X, Utensils, Scale, Dumbbell, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ACTIONS = [
    { name: "Log Meal", icon: Utensils, href: "/track", color: "bg-amber-500" },
    { name: "Log Weight", icon: Scale, href: "/track", color: "bg-primary" },
    { name: "Start HIIT", icon: Dumbbell, href: "/routines", color: "bg-lavender" },
    { name: "Ask Expert", icon: MessageSquare, href: "/chat", color: "bg-sage" },
];

export function ActionFab() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 md:bottom-12 md:right-12">
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col items-end gap-3 mb-2">
                        {ACTIONS.map((action, i) => (
                            <motion.div
                                key={action.name}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ delay: (ACTIONS.length - 1 - i) * 0.05 }}
                            >
                                <Link
                                    href={action.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 group"
                                >
                                    <span className="glass-premium px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                                        {action.name}
                                    </span>
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-background shadow-lg transition-transform hover:scale-110",
                                        action.color
                                    )}>
                                        <action.icon size={20} strokeWidth={3} />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 action-fab",
                    isOpen
                        ? "bg-secondary text-foreground-muted border border-white/10 rotate-45"
                        : "bg-primary text-background shadow-[0_0_30px_rgba(0,251,255,0.3)] hover:scale-105"
                )}
            >
                {isOpen ? <X size={28} /> : <Plus size={32} strokeWidth={3} />}
            </button>
        </div>
    );
}
