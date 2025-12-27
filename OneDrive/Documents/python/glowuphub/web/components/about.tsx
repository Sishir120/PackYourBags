"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Leaf, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function About() {
    return (
        <section className="py-32 bg-background-muted relative overflow-hidden">
            {/* Soft background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content - The Philosophy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <span className="text-primary font-medium tracking-widest uppercase text-sm">Our Philosophy</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                            Health is <br />
                            <span className="text-foreground-muted">Self-Trust</span><br />
                            Made Visible.
                        </h2>
                        <div className="space-y-6 text-lg text-foreground-muted">
                            <p>
                                We believe weight loss isn't about punishment or deprivation. It's about <strong className="text-foreground">keeping small promises to yourself</strong>, day after day.
                            </p>
                            <p>
                                <strong className="text-foreground">GlowUp Hub</strong> combines three essential pillars — **metabolic nutrition**, science-backed **movement**, and unshakeable **mindset** — into a daily practice that heals your **relationship with food**.
                            </p>
                            <p>
                                No obsession. No shame. Just consistent, compassionate **daily action** that builds self-trust and compounds into a lasting, visible transformation.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button variant="link" className="text-primary pl-0 text-lg gap-2 hover:gap-3 transition-all">
                                Learn Our Approach <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Visual - Gentle, Organic */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden bg-card border border-border shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-soft to-background" />

                        {/* Gentle orbiting rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/10 rounded-full animate-[spin_80s_linear_infinite]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-sage/15 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-lavender/10 rounded-full animate-[spin_40s_linear_infinite]" />

                        {/* Center content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center animate-breathe">
                                    <Heart className="w-10 h-10 text-primary" />
                                </div>
                                <p className="text-2xl font-semibold text-foreground">Self-Trust</p>
                                <p className="text-foreground-muted text-sm mt-2">The foundation of health</p>
                                <div className="mt-6 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 inline-block">
                                    <p className="text-xs font-bold text-primary tracking-wide">NO SHAME PROMISE</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating cards */}
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute top-16 right-4 md:right-8 p-4 bg-card/90 backdrop-blur-sm rounded-2xl border border-border shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                                    <Leaf className="w-4 h-4 text-sage" />
                                </div>
                                <div>
                                    <p className="text-xs text-foreground-muted">Sustainable</p>
                                    <p className="font-semibold text-foreground text-sm">Habits</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-20 left-4 md:left-8 p-4 bg-card/90 backdrop-blur-sm rounded-2xl border border-border shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-lavender/20 flex items-center justify-center">
                                    <Moon className="w-4 h-4 text-lavender" />
                                </div>
                                <div>
                                    <p className="text-xs text-foreground-muted">Balanced</p>
                                    <p className="font-semibold text-foreground text-sm">Metabolism</p>
                                </div>
                            </div>
                        </motion.div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}
