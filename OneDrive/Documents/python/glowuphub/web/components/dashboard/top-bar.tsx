"use client";

import { Bell, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sidebar } from "./sidebar";

export function TopBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="h-16 glass-premium border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="w-8 h-8"
                    >
                        <Menu size={20} />
                    </Button>
                </div>

                <div className="flex-1 max-w-sm hidden md:block">
                    <div className="relative group cursor-pointer" onClick={() => (window as any).dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted group-hover:text-primary transition-colors" />
                        <div className="w-full bg-white/3 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[13px] text-foreground-muted flex items-center justify-between group-hover:border-emerald-500/20 transition-all">
                            <span>Biological Interface Search...</span>
                            <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] font-black px-1 py-0.5 rounded-md bg-white/5">⌘</span>
                                <span className="text-[9px] font-black px-1 py-0.5 rounded-md bg-white/5">K</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Node Sync</span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-foreground-muted hover:text-primary transition-colors">
                        <Bell size={18} />
                    </Button>
                    <div className="h-6 w-[1px] bg-white/10 mx-1.5" />
                    <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black group-hover:text-emerald-500 transition-colors tracking-tight">Active Practitioner</p>
                            <p className="text-[8px] text-foreground-muted font-black uppercase tracking-[0.2em] opacity-30">Biological ID: GP-882</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 p-[1px] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
                            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                                <User size={14} className="text-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {isMobileMenuOpen && (
                <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            )}
        </>
    );
}
