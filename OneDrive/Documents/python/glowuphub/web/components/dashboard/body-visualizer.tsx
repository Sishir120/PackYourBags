'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface BodyVisualizerProps {
    bmi: number;
    gender?: 'female' | 'male';
}

export function BodyVisualizer({ bmi, gender = 'female' }: BodyVisualizerProps) {

    // High-Fidelity Human Silhouette Paths (Female Template)
    // Topology: Head -> R Shoulder -> R Arm Outer -> R Hand -> R Arm Inner -> R Waist -> R Leg Outer -> R Foot -> Crotch -> L Foot -> L Leg Outer -> L Waist -> L Arm Inner -> L Hand -> L Arm Outer -> L Shoulder -> Head

    // Path 1: Underweight (BMI ~16)
    // Detailed: Thinner limbs, significant gap between arms and torso (thigh gap implied by thinner legs)
    const pathUnderweight = `
        M 100 30 
        C 108 30, 112 35, 112 45 
        C 112 52, 110 58, 105 60 
        L 125 65 
        L 135 150 
        L 138 210 
        L 132 215 
        L 130 155 
        C 128 140, 125 100, 122 100 
        L 122 150 
        C 122 170, 125 250, 120 300 
        L 115 390 
        L 105 390 
        L 108 280 
        L 100 220 
        L 92 280 
        L 95 390 
        L 85 390 
        L 80 300 
        C 75 250, 78 170, 78 150 
        L 78 100 
        C 75 100, 72 140, 70 155 
        L 68 215 
        L 62 210 
        L 65 150 
        L 75 65 
        L 95 60 
        C 90 58, 88 52, 88 45 
        C 88 35, 92 30, 100 30 Z
    `;

    // Path 2: Healthy (BMI ~22)
    // Detailed: Balanced curves, defined waist, arms slightly fuller
    const pathHealthy = `
        M 100 30 
        C 109 30, 114 35, 114 45 
        C 114 52, 111 58, 106 60 
        L 130 68 
        L 142 150 
        L 145 210 
        L 138 215 
        L 135 155 
        C 134 140, 130 100, 128 100 
        L 132 150 
        C 135 170, 138 250, 130 300 
        L 122 390 
        L 110 390 
        L 112 280 
        L 100 225 
        L 88 280 
        L 90 390 
        L 78 390 
        L 70 300 
        C 62 250, 65 170, 68 150 
        L 72 100 
        C 70 100, 66 140, 65 155 
        L 62 215 
        L 55 210 
        L 58 150 
        L 70 68 
        L 94 60 
        C 89 58, 86 52, 86 45 
        C 86 35, 91 30, 100 30 Z
    `;

    // Path 3: Overweight (BMI ~30)
    // Detailed: Fuller figure, arms closer to body, wider hips/thighs
    const pathOverweight = `
        M 100 30 
        C 110 30, 116 35, 116 45 
        C 116 52, 113 58, 108 60 
        L 135 72 
        L 150 150 
        L 155 210 
        L 145 215 
        L 142 155 
        C 140 140, 138 100, 138 100 
        L 148 155 
        C 152 180, 155 260, 145 300 
        L 130 390 
        L 115 390 
        L 118 280 
        L 100 230 
        L 82 280 
        L 85 390 
        L 70 390 
        L 55 300 
        C 45 260, 48 180, 52 155 
        L 62 100 
        C 62 100, 60 140, 58 155 
        L 55 215 
        L 45 210 
        L 50 150 
        L 65 72 
        L 92 60 
        C 87 58, 84 52, 84 45 
        C 84 35, 90 30, 100 30 Z
    `;

    // Path 4: Obese (BMI ~40)
    // Detailed: Significant width, merged gaps in some areas visual style, but keeping topology for morph
    const pathObese = `
        M 100 30 
        C 112 30, 118 35, 118 45 
        C 118 52, 115 58, 110 60 
        L 145 75 
        L 165 150 
        L 170 210 
        L 155 215 
        L 152 155 
        C 150 140, 148 110, 160 130 
        L 165 170 
        C 170 200, 175 270, 155 300 
        L 135 390 
        L 115 390 
        L 120 280 
        L 100 240 
        L 80 280 
        L 85 390 
        L 65 390 
        L 45 300 
        C 25 270, 30 200, 35 170 
        L 40 130 
        C 52 110, 50 140, 48 155 
        L 45 215 
        L 30 210 
        L 35 150 
        L 55 75 
        L 90 60 
        C 85 58, 82 52, 82 45 
        C 82 35, 88 30, 100 30 Z
    `;

    const targetPath = useMemo(() => {
        if (bmi < 18.5) return pathUnderweight;
        if (bmi < 25) return pathHealthy;
        if (bmi < 30) return pathOverweight;
        return pathObese;
    }, [bmi]);

    // Dynamic Gradient IDs to prevent conflicts
    const gradientId = `bodyGradient-${bmi}`;

    return (
        <div className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [0.95, 1.05, 0.95]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full"
            />

            {/* Grid Line Scanner */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    initial={{ top: -10 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_15px_var(--primary)]"
                />
            </div>

            <motion.svg
                height="320"
                viewBox="0 0 200 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="z-10 relative drop-shadow-2xl"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id={gradientId} x1="100" y1="35" x2="100" y2="390" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="50%" stopColor="#F472B6" />
                        <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                    <linearGradient id="blueGradient" x1="100" y1="0" x2="100" y2="400" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="100" y1="0" x2="100" y2="400" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                    <linearGradient id="orangeGradient" x1="100" y1="0" x2="100" y2="400" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#fb923c" />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="100" y1="0" x2="100" y2="400" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                </defs>

                <motion.path
                    d={targetPath}
                    initial={pathHealthy}
                    animate={{
                        d: targetPath,
                        fill: bmi < 18.5 ? "url(#blueGradient)" : bmi < 25 ? "url(#greenGradient)" : bmi < 30 ? "url(#orangeGradient)" : "url(#redGradient)"
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 30,
                        damping: 15,
                    }}
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1.5"
                    fillOpacity="0.9"
                    style={{
                        filter: "drop-shadow(0px 0px 10px rgba(0,0,0,0.5))"
                    }}
                />

                {/* Structural/Detail Lines (Collarbone, Knees, etc for extra realism) */}
                {/* Center line hint */}
                <motion.path
                    d="M100 60 L100 130  M100 390 L100 240"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    strokeLinecap="round"
                />

            </motion.svg>

            {/* Indicators */}
            <div className="absolute right-12 top-32 bottom-32 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent flex flex-col justify-between py-10 opacity-30">
                <div className="w-2 h-px bg-white/50" />
                <div className="w-2 h-px bg-white/50" />
            </div>

        </div>
    );
}
