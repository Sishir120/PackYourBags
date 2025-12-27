"use client";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Instagram, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background border-t border-border pt-20 pb-10">
            <div className="container mx-auto px-6">

                <div className="grid lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <Logo size={40} className="group-hover:scale-105 transition-transform" />
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                GlowUp<span className="text-primary">Hub</span>
                            </span>
                        </Link>
                        <p className="text-foreground-muted text-sm leading-relaxed">
                            Gentle daily practices that build lasting confidence. Your journey to self-trust and natural radiance starts here.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                                <Heart className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-foreground font-semibold mb-6">Explore</h4>
                        <ul className="space-y-4 text-sm text-foreground-muted">
                            <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing & Plans</Link></li>
                            <li><Link href="/#testimonials" className="hover:text-primary transition-colors">Journeys</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-foreground font-semibold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-foreground-muted">
                            <ul className="space-y-4 text-sm text-foreground-muted">
                                <li><Link href="/#philosophy" className="hover:text-primary transition-colors">Our Philosophy</Link></li>
                                <li><Link href="/#testimonials" className="hover:text-primary transition-colors">Community</Link></li>
                                <li><Link href="/blog" className="hover:text-primary transition-colors">Journal</Link></li>
                                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                            </ul>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-foreground font-semibold mb-6">Stay Inspired</h4>
                        <p className="text-foreground-muted text-sm mb-4">1 gentle self-care idea, once a week. No spam, ever.</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Your email"
                                className="bg-card border-border text-foreground rounded-full focus-visible:ring-primary"
                            />
                            <Button className="rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
                                Join
                            </Button>
                        </div>
                    </div>

                </div>

                <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-foreground-muted">
                    <p>© 2024 GlowUp Hub. Made with care for your journey.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Cookies</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
