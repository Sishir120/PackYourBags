"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Features", href: "/#features" },
        { name: "Journeys", href: "/#testimonials" },
        { name: "Pricing", href: "/#pricing" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <Logo size={40} className="group-hover:scale-105 transition-transform" />
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        GlowUp<span className="text-primary">Hub</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" className="rounded-full font-medium text-foreground hover:text-primary hover:bg-primary/5">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20">
                            Sign Up Free
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-border overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-foreground/80"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Auth Links */}
                            <div className="pt-4 border-t border-border flex flex-col gap-3">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full rounded-full font-medium">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full rounded-full font-semibold bg-primary text-primary-foreground">
                                        Sign Up Free
                                    </Button>
                                </Link>
                            </div>

                            {/* Mobile Menu App Store Links */}
                            <div className="pt-4">
                                <p className="text-xs text-foreground-muted font-medium mb-3 uppercase tracking-wider">Get the Mobile App</p>
                                <div className="flex flex-col gap-3">
                                    <Link href="#" className="flex items-center gap-2 text-foreground font-medium bg-secondary/50 p-3 rounded-lg border border-border">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-6 w-auto" alt="App Store" />
                                        <span className="text-sm">Download on iOS</span>
                                    </Link>
                                    <Link href="#" className="flex items-center gap-2 text-foreground font-medium bg-secondary/50 p-3 rounded-lg border border-border">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-6 w-auto" alt="Play Store" />
                                        <span className="text-sm">Get on Android</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
