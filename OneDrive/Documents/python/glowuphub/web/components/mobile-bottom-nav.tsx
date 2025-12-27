"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Compass, PlusCircle, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MobileBottomNav() {
    const pathname = usePathname();

    const tabs = [
        { href: "/dashboard", icon: Home, label: "Home" },
        { href: "/routines", icon: Compass, label: "Explore" },
        { href: "/track", icon: PlusCircle, label: "Track", isPrimary: true },
        { href: "/calendar", icon: Calendar, label: "Plan" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    // Hide on non-dashboard pages if needed, or keep persistent
    const shouldShow =
        pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/routines") ||
        pathname?.startsWith("/track") ||
        pathname?.startsWith("/calendar") ||
        pathname?.startsWith("/profile") ||
        pathname?.startsWith("/settings");

    if (!shouldShow) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe-area">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-t border-white/10" />

            <nav className="relative flex items-center justify-around h-16 px-2">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;

                    if (tab.isPrimary) {
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className="relative -top-5"
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25 border-4 border-black"
                                >
                                    <tab.icon size={24} className="text-white" />
                                </motion.div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1",
                                isActive ? "text-primary" : "text-zinc-500"
                            )}
                        >
                            <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
