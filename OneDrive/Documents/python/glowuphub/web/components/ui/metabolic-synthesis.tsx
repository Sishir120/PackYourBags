"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function MetabolicSynthesis() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
            {/* Organic Flowing Lines */}
            <svg viewBox="0 0 1000 1000" className="w-full h-full opacity-20">
                <motion.path
                    d="M-100,500 Q250,250 500,500 T1100,500"
                    fill="none"
                    stroke="url(#grad1)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 1, 0.5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                    d="M-100,600 Q300,400 600,600 T1100,600"
                    fill="none"
                    stroke="url(#grad2)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                />

                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                        <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
                        <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Floating Biological Particles - Only render on client to avoid hydration mismatch */}
            {mounted && [...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-500/20 rounded-full"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        scale: Math.random() * 2
                    }}
                    animate={{
                        y: ["-10%", "110%"],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 20 + Math.random() * 20,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 20
                    }}
                />
            ))}
        </div>
    );
}
