"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, Activity, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Play", href: "/routines", icon: Dumbbell },
    { name: "Track", href: "/track", icon: Activity },
    { name: "Guidance", href: "/chat", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
];

export function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 glass-premium border-t border-white/5 px-6 flex items-center justify-between z-[40] lg:hidden">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center gap-1.5 relative py-2"
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
                            isActive ? "bg-primary/10 text-primary" : "text-foreground-muted hover:text-foreground"
                        )}>
                            <item.icon size={20} className={isActive ? "animate-pop" : ""} />
                        </div>
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            isActive ? "text-primary opacity-100" : "text-foreground-muted opacity-40"
                        )}>
                            {item.name}
                        </span>
                        {isActive && (
                            <motion.div
                                layoutId="mobile-nav-active"
                                className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_10px_rgba(0,251,255,0.8)]"
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
