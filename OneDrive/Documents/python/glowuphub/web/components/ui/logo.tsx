"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: number; // Size in pixels
}

export function Logo({ className, size = 40 }: LogoProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#DFFF00" />
                        <stop offset="100%" stopColor="#00FF94" />
                    </linearGradient>

                    <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Abstract "G" Monogram - Interlocking Geometry */}
                {/* Main Path: Stylized Hexagonal G */}
                <motion.path
                    d="M60 20 L80 30 L80 70 L50 85 L20 70 L20 30 L50 15"
                    stroke="url(#logoGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Inner Tech Accent */}
                <motion.path
                    d="M50 85 L50 50 L75 50"
                    stroke="url(#logoGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                />

                {/* Shimmer Effect Overlay */}
                <motion.path
                    d="M60 20 L80 30 L80 70 L50 85 L20 70 L20 30 L50 15"
                    stroke="url(#shimmerGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0.3, pathOffset: 0, opacity: 0 }}
                    animate={{ pathOffset: [0, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }}
                />

            </svg>
        </div>
    );
}
