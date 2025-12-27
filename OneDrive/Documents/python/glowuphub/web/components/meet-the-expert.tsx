"use client";

import { motion } from "framer-motion";
import { Award, Users, Heart, MessageCircle, ArrowRight, Star, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const credentials = [
    { icon: <Users className="w-5 h-5" />, label: "10,000+ Women Guided", stat: "10K+" },
    { icon: <Star className="w-5 h-5" />, label: "4.9/5 Client Rating", stat: "4.9★" },
    { icon: <Heart className="w-5 h-5" />, label: "Weight-Neutral Approach", stat: "Science-Based" },
];

const achievements = [
    "Precision Nutrition Level 1 Certified",
    "Personalized habits based on your metrics",
    "4 years clinical nutrition practice",
    "Featured wellness educator on Social Media"
];

export function MeetTheExpert() {
    return (
        <section id="expert" className="py-32 bg-background relative overflow-hidden">
            {/* Soft background accents */}
            <div className="absolute top-0 left-1/4 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[30%] h-[30%] bg-sage/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Image / Avatar Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative flex justify-center lg:justify-start"
                    >
                        <div className="relative">
                            {/* Decorative rings */}
                            <div className="absolute -inset-4 rounded-full border border-primary/20 animate-pulse" />
                            <div className="absolute -inset-8 rounded-full border border-primary/10" />

                            {/* Expert avatar */}
                            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-card shadow-2xl overflow-hidden relative bg-gradient-to-br from-primary/10 to-sage/10">
                                <Image
                                    src="/assets/expert.jpg"
                                    alt="Nutritionist Sabita Subedi"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Floating credential badges */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -right-6 top-16 p-4 bg-card/95 backdrop-blur-lg rounded-2xl border border-primary/20 shadow-xl"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <MessageCircle size={16} className="text-primary" />
                                    <p className="text-xs font-black uppercase tracking-wider text-foreground-muted">Expert Chat</p>
                                </div>
                                <p className="text-sm font-bold text-primary">24-48h Response</p>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="absolute -left-6 bottom-20 p-4 bg-card/95 backdrop-blur-lg rounded-2xl border border-sage/20 shadow-xl"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp size={16} className="text-sage" />
                                    <p className="text-xs font-black uppercase tracking-wider text-foreground-muted">Success Rate</p>
                                </div>
                                <p className="text-sm font-bold text-sage">92% Client Results</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            <p className="text-sm font-bold text-primary">Meet Your Expert Guide</p>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Nutritionist <span className="text-primary">Sabita Subedi</span>
                        </h2>

                        <p className="text-foreground-muted text-lg leading-relaxed mb-6">
                            Sabita has spent <span className="text-foreground font-semibold">4 years</span> helping women repair their relationship with food,
                            energy, and their bodies — <span className="text-foreground font-semibold">without shame, without weigh-ins</span>, and without extreme diets.
                        </p>

                        <p className="text-foreground-muted text-lg leading-relaxed mb-8">
                            Her approach observes your current nutrition intakes, evaluates them, and suggests better habits
                            specifically tailored to your gender, height, age, and weight.
                        </p>

                        {/* Achievements List */}
                        <div className="mb-8 space-y-3">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-foreground-muted">{achievement}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Credentials */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {credentials.map((cred, index) => (
                                <motion.div
                                    key={cred.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="text-center p-4 bg-card/50 rounded-2xl border border-border hover:border-primary/20 transition-all group"
                                >
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        {cred.icon}
                                    </div>
                                    <p className="text-2xl font-bold text-foreground mb-1">{cred.stat}</p>
                                    <p className="text-xs text-foreground-muted">{cred.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                size="lg"
                                className="rounded-full h-14 px-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 group"
                                onClick={() => window.location.href = "/#pricing"}
                            >
                                Unlock Expert Chat
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full h-14 px-8 gap-2 group"
                                onClick={() => window.open('https://www.facebook.com/profile.php?id=61572327367366', '_blank')}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Follow on Facebook
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <p className="text-sm text-foreground-muted mt-6 text-center lg:text-left">
                            💬 Get personalized guidance through <span className="text-primary font-semibold">Coach Tier</span> —
                            Ask about meals, labs, symptoms, and more.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
