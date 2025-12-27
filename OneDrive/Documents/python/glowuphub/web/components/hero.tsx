"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";
import { Play, Sparkles, Heart } from "lucide-react";
import { StoreBadges } from "@/components/ui/store-badges";

export function Hero() {
    return (
        <section className="relative w-full min-h-screen pt-20 flex items-center overflow-hidden bg-background">
            {/* Warm Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Soft blue/teal glow */}
                <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 md:bg-primary/20 rounded-full blur-[60px] md:blur-[120px] opacity-30 md:opacity-60" />
                {/* Sage accent */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-sage/10 md:bg-sage/20 rounded-full blur-[60px] md:blur-[120px] opacity-20 md:opacity-40" />
                {/* Lavender touch */}
                <div className="absolute top-[30%] left-[20%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-lavender/15 rounded-full blur-[60px] md:blur-[100px] opacity-20" />
            </div>

            <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center lg:items-start gap-6 md:gap-8 max-w-2xl text-center lg:text-left"
                >
                    {/* Immersive Mobile Background Visual (Brand Halo) */}
                    <div className="lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square opacity-15 z-0 pointer-events-none">
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-[80px] animate-pulse" />
                        <div className="absolute inset-10 rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-20 rounded-full border border-primary/5 animate-[spin_30s_linear_infinite_reverse]" />
                    </div>

                    {/* Expert Credentials Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs md:text-sm font-medium text-primary z-10">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        Expert-Led Weight Loss • 10,000+ Success Stories
                    </div>

                    <h1 className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.1] text-foreground mb-6 z-10">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                            Sustainable
                        </span>{" "}
                        <span className="text-foreground">Weight Loss.</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">
                            Healthy Habits.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-foreground-muted leading-relaxed max-w-lg px-2 md:px-0 mb-8 z-10">
                        Build <span className="text-primary font-semibold">lasting metabolic health</span> with expert nutritionist Sabita Subedi. <br className="hidden md:block" />
                        <span className="font-semibold text-foreground">No starvation. No shame. Just science.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto z-10">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto rounded-full h-14 px-8 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                        >
                            Start Losing Weight (Free)
                        </Button>
                        <Button
                            size="lg"
                            variant="ghost"
                            className="w-full sm:w-auto rounded-full h-14 px-8 gap-2 text-foreground hover:bg-white/5 font-medium border border-transparent hover:border-white/10"
                        >
                            <Play className="w-5 h-5 fill-current" /> View Success Stories
                        </Button>
                    </div>

                    {/* App Store Links */}
                    <div className="mt-6 z-10 w-full sm:w-auto flex flex-col items-center sm:items-start animate-fade-in-up">
                        <p className="text-xs text-foreground-muted font-bold tracking-widest uppercase mb-3">
                            Available on iOS & Android
                        </p>
                        <StoreBadges className="justify-center sm:justify-start scale-110 sm:scale-100 origin-left" />
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-foreground-muted mt-6 z-10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-background bg-zinc-800 bg-[url('https://i.pravatar.cc/100?img=${20 + i}')] bg-cover`} />
                            ))}
                        </div>
                        <p>Join <span className="text-foreground font-bold">10,000+ members</span> finding safety in their skin</p>
                    </div>

                </motion.div>

                {/* Desktop Content - Orbital Visual (Visible only on LG+) */}
                <div className="relative h-[700px] w-full hidden lg:flex items-center justify-center">

                    {/* Concentric orbital rings - smaller on mobile */}
                    <div className="absolute w-[280px] md:w-[500px] h-[280px] md:h-[500px] rounded-full border border-white/5" />
                    <div className="absolute w-[200px] md:w-[380px] h-[200px] md:h-[380px] rounded-full border border-white/5" />

                    {/* Soft rotating aura */}
                    <div className="absolute w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full opacity-10 md:opacity-20 animate-[spin_30s_linear_infinite]">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/0 via-primary/30 to-transparent blur-2xl" />
                    </div>

                    {/* Glass Vessel - smaller on mobile */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative w-[200px] md:w-[340px] h-[200px] md:h-[340px] rounded-full bg-card/40 border border-primary/10 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-primary/20"
                    >
                        {/* Decorative inner ring */}
                        <div className="absolute inset-3 md:inset-4 rounded-full border border-primary/10" />

                        {/* Inner Core */}
                        <div className="relative w-[110px] md:w-[180px] h-[110px] md:h-[180px] rounded-full bg-background/60 flex items-center justify-center shadow-inner border border-border">
                            {/* Logo with gentle pulse */}
                            <div className="relative w-[60px] md:w-[100px] h-[60px] md:h-[100px] rounded-full flex items-center justify-center">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-breathe" />
                                <Logo size={40} />
                            </div>
                        </div>

                        {/* Orbiting particles */}
                        <div className="absolute inset-0 animate-[spin_15s_linear_infinite]">
                            <div className="absolute top-0 left-1/2 w-1.5 md:w-2 h-1.5 md:h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(0,251,255,0.8)] -translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </motion.div>

                    {/* Floating Stat Card - Daily Practice */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute top-32 right-12 p-3 bg-card/90 backdrop-blur-lg rounded-2xl border border-border flex items-center gap-3 shadow-xl"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Heart className="w-4 h-4" />
                        </div>
                        <div className="pr-2">
                            <p className="text-[10px] text-foreground-muted leading-none mb-1">Daily Practice</p>
                            <p className="text-sm font-bold text-foreground leading-none">15 min</p>
                        </div>
                    </motion.div>

                    {/* Glow Score Card */}
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-40 left-8 p-3 bg-card/90 backdrop-blur-lg rounded-2xl border border-border flex items-center gap-3 shadow-xl"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="pr-2">
                            <p className="text-[10px] text-foreground-muted leading-none mb-1">Glow Score</p>
                            <p className="text-sm font-bold text-foreground leading-none">Building ✨</p>
                        </div>
                    </motion.div>

                </div>

            </div >
        </section >
    );
}
