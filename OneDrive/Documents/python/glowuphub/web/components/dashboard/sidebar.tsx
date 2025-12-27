"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import {
    LayoutDashboard,
    Dumbbell,
    Activity,
    MessageSquare,
    User,
    Settings,
    ShieldCheck,
    X,
    Scale,
    Calendar,
    History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navigation = {
    "Your Progress": [
        { name: "Daily Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Workout Plans", href: "/routines", icon: Dumbbell },
        { name: "Activity Archive", href: "/calendar", icon: Calendar },
        { name: "Activity Log", href: "/movement", icon: Activity },
        { name: "My Biometrics", href: "/track", icon: Scale },
    ],
    "Support": [
        { name: "My Plan", href: "/plan", icon: History },
        { name: "Ask an Expert", href: "/chat", icon: MessageSquare },
        { name: "Care Team", href: "/expert", icon: ShieldCheck },
    ],
    "Account": [
        { name: "My Profile", href: "/profile", icon: User },
    ]
};

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 glass-premium border-r border-white/5 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Mobile Close Button */}
            <button
                onClick={onClose}
                className="lg:hidden absolute top-4 right-4 p-2 text-foreground-muted hover:text-foreground"
            >
                <X size={20} />
            </button>

            <div className="p-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <Logo size={28} />
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        GlowUp<span className="text-primary">Hub</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 px-4 mt-6 space-y-8 overflow-y-auto scrollbar-hide">
                {Object.entries(navigation).map(([category, items]) => (
                    <div key={category} className="space-y-3">
                        <h3 className="px-4 text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] opacity-40">
                            {category}
                        </h3>
                        <div className="space-y-1">
                            {items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-300",
                                            isActive
                                                ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                                                : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                                            isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-foreground-muted group-hover:text-foreground"
                                        )}>
                                            <item.icon size={14} />
                                        </div>
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-indicator"
                                                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-white/5 transition-all"
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
            </div>
        </div>
    );
}
