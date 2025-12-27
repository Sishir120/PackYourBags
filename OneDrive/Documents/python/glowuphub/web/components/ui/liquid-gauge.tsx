'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiquidGaugeProps {
    percent: number;
    color?: string;
    icon?: any;
    className?: string;
    label?: string;
}

export function LiquidGauge({ percent, color = 'bg-primary', icon: Icon, className, label }: LiquidGaugeProps) {
    const normalizedPercent = Math.min(Math.max(percent, 0), 100);

    return (
        <div className={cn("flex flex-col items-center gap-3", className)}>
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/10 overflow-hidden bg-black/20 shadow-inner">
                {/* Wave Container */}
                <motion.div
                    className={cn("absolute inset-x-0 bottom-0 transition-all duration-1000 ease-out", color)}
                    initial={{ height: 0 }}
                    animate={{ height: `${normalizedPercent}%` }}
                    style={{ opacity: 0.6 }}
                >
                    {/* Animated Wave 1 */}
                    <motion.div
                        className="absolute top-0 left-0 w-[200%] h-4 bg-inherit opacity-40 rounded-[40%]"
                        animate={{
                            x: ['0%', '-50%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{ transform: 'translateY(-50%)' }}
                    />
                    {/* Animated Wave 2 */}
                    <motion.div
                        className="absolute top-0 left-0 w-[200%] h-4 bg-inherit opacity-30 rounded-[35%]"
                        animate={{
                            x: ['-50%', '0%'],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{ transform: 'translateY(-60%)' }}
                    />
                </motion.div>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    {Icon && <Icon size={24} className="text-white drop-shadow-md" />}
                    {!Icon && <span className="text-lg font-black text-white">{Math.round(normalizedPercent)}%</span>}
                </div>

                {/* Reflection Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>

            {label && (
                <div className="text-center">
                    <p className="text-[10px] font-black tracking-wider uppercase text-foreground-muted">{label}</p>
                    <p className="text-xs font-bold text-white">{Math.round(normalizedPercent)}%</p>
                </div>
            )}
        </div>
    );
}
