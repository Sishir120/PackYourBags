"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export function AppShowcase() {
    return (
        <section className="py-24 bg-background-muted border-y border-border relative overflow-hidden">
            {/* Warm ambient glow */}
            <div className="absolute top-1/2 right-0 w-[50%] h-[80%] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-8 relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            Available on iOS & Android
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                            Your Daily <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sage">
                                Practice Companion
                            </span>
                        </h2>
                        <p className="text-xl text-foreground-muted max-w-lg">
                            Gentle reminders, guided practices, and your Glow Rings — all in your pocket. Take your practice with you, anywhere. <span className="block mt-2 text-sm italic">Syncs perfectly.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                className="h-14 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 gap-3 font-semibold text-lg"
                                onClick={() => window.open('/download#android', '_blank')}
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                </svg>
                                Download Android APK
                            </Button>
                            <Button
                                className="h-14 px-8 rounded-full bg-transparent border border-border text-foreground hover:bg-card gap-3 font-semibold text-lg"
                                onClick={() => window.open('/download#ios', '_blank')}
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                Install on iOS (PWA)
                            </Button>
                        </div>
                        <p className="text-xs text-foreground-muted italic max-w-md">
                            * Direct secure download from our servers. Verified safe for all devices.
                        </p>

                        <div className="flex items-center gap-4 text-sm text-foreground-muted">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-primary-soft border-2 border-background" />
                                ))}
                            </div>
                            <p>Join 10,000+ active members on their glow journey</p>
                        </div>
                    </motion.div>

                    {/* Right: Phone Render */}
                    <div className="relative h-[600px] w-full flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full h-full max-w-[500px]"
                        >
                            {/* Soft glow behind phone */}
                            <div className="absolute inset-0 bg-primary/15 blur-[100px] rounded-full opacity-60" />

                            <Image
                                src="/assets/app-mockup.png"
                                alt="GlowUp Hub App Interface"
                                fill
                                className="object-contain drop-shadow-2xl z-10"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
