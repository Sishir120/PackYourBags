"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { ActionFab } from "@/components/dashboard/action-fab";
import { MobileBottomNav } from "@/components/dashboard/mobile-nav";
import { MetabolicSynthesis } from "@/components/ui/metabolic-synthesis";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background overflow-hidden relative font-sans antialiased text-foreground">
            <MetabolicSynthesis />
            {/* Dynamic Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/3 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-6 md:p-12 pb-20 md:pb-12 scrollbar-hide">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
                <MobileBottomNav />
            </div>

            <ActionFab />
            <CommandPalette />
        </div>
    );
}
