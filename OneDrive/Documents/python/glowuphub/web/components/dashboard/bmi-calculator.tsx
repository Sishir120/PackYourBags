'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Ruler, Weight, RefreshCw, Info } from 'lucide-react';
import { BodyVisualizer } from './body-visualizer';

type UnitSystem = 'metric' | 'imperial';

interface BmiCalculatorProps {
    onWeightChange?: (weightKg: number) => void;
    onSave?: (data: { weight: number, height: number }) => Promise<void>;
    initialHeight?: number;
    initialWeight?: number;
    isLoading?: boolean;
}

export function BmiCalculator({ onWeightChange, onSave, isLoading, initialHeight = 165, initialWeight = 60 }: BmiCalculatorProps) {
    const [units, setUnits] = useState<UnitSystem>('metric');

    // Metric state
    const [heightCm, setHeightCm] = useState<number>(initialHeight ?? 165);
    const [weightKg, setWeightKg] = useState<number>(initialWeight ?? 60);

    // Imperial state
    const [heightFt, setHeightFt] = useState<number>(Math.floor((initialHeight ?? 165) / 30.48));
    const [heightIn, setHeightIn] = useState<number>(Math.round(((initialHeight ?? 165) % 30.48) / 2.54));
    const [weightLbs, setWeightLbs] = useState<number>(Math.round((initialWeight ?? 60) * 2.20462));

    const [bmi, setBmi] = useState<number>(22);
    const [category, setCategory] = useState<string>('Healthy Weight');

    // Calculate BMI whenever inputs change
    useEffect(() => {
        let calculatedBmi = 0;
        let currentWeightKg = weightKg;

        if (units === 'metric') {
            const heightM = heightCm / 100;
            if (heightM > 0) {
                calculatedBmi = weightKg / (heightM * heightM);
            }
            currentWeightKg = weightKg;
        } else {
            const totalInches = (heightFt * 12) + heightIn;
            // Convert lbs to kg for parent update (1 lb = 0.453592 kg)
            currentWeightKg = weightLbs * 0.453592;

            if (totalInches > 0) {
                // BMI Formula: 703 x weight (lbs) / [height (in)]^2
                calculatedBmi = 703 * weightLbs / (totalInches * totalInches);
            }
        }

        setBmi(parseFloat(calculatedBmi.toFixed(1)));

        // Notify parent of accurate weight update
        if (onWeightChange) {
            onWeightChange(currentWeightKg);
        }
    }, [units, heightCm, weightKg, heightFt, heightIn, weightLbs, onWeightChange]);

    // Update Category
    useEffect(() => {
        if (bmi < 18.5) setCategory('Underweight');
        else if (bmi < 25) setCategory('Healthy Weight');
        else if (bmi < 30) setCategory('Overweight');
        else setCategory('Obese');
    }, [bmi]);

    const getCategoryColor = () => {
        if (bmi < 18.5) return 'text-blue-400';
        if (bmi < 25) return 'text-green-400';
        if (bmi < 30) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <section className="glass-premium rounded-2xl p-6 relative overflow-hidden h-full border border-white/5" aria-labelledby="bmi-calc-heading">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20" aria-hidden="true">
                        <Calculator size={20} />
                    </div>
                    <div>
                        <h2 id="bmi-calc-heading" className="text-xl font-black text-white tracking-tight">Body Composition</h2>
                        <p className="text-[10px] font-medium text-foreground-muted">Visualize metabolic health</p>
                    </div>
                </div>

                {/* Unit Toggle */}
                <nav className="bg-white/5 p-1 rounded-xl flex items-center border border-white/5" role="tablist" aria-label="Measurement Units">
                    <button
                        role="tab"
                        onClick={() => setUnits('metric')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${units === 'metric'
                            ? 'bg-primary text-black shadow-[0_0_15px_rgba(223,255,0,0.3)]'
                            : 'text-foreground-muted hover:text-white'
                            }`}
                        aria-selected={units === 'metric'}
                        aria-controls="bmi-inputs-panel"
                    >
                        Metric
                    </button>
                    <button
                        role="tab"
                        onClick={() => setUnits('imperial')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${units === 'imperial'
                            ? 'bg-primary text-black shadow-[0_0_15px_rgba(223,255,0,0.3)]'
                            : 'text-foreground-muted hover:text-white'
                            }`}
                        aria-selected={units === 'imperial'}
                        aria-controls="bmi-inputs-panel"
                    >
                        Imperial
                    </button>
                </nav>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 relative z-10 h-full" id="bmi-inputs-panel">
                {/* Inputs & Stats */}
                <div className="space-y-5 flex flex-col justify-center">
                    {/* Inputs */}
                    <div className="space-y-6 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                        {/* Height Input */}
                        <div className="space-y-2">
                            <label htmlFor="height-range" className="flex items-center gap-1.5 text-[8px] font-black tracking-[0.2em] text-primary/60 cursor-pointer">
                                <Ruler size={10} aria-hidden="true" /> HEIGHT SCAN
                            </label>
                            {units === 'metric' ? (
                                <div className="flex items-center gap-4">
                                    <input
                                        id="height-range"
                                        type="range"
                                        min="100"
                                        max="220"
                                        value={heightCm}
                                        onChange={(e) => setHeightCm(Number(e.target.value))}
                                        className="flex-1 accent-primary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                                        aria-valuetext={`${heightCm} centimeters`}
                                    />
                                    <div className="w-24 bg-black/40 px-4 py-2.5 rounded-xl text-center font-mono font-black border border-white/10 shadow-inner text-white">
                                        {heightCm} <span className="text-[9px] text-foreground-muted">CM</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-1.5">
                                        <label htmlFor="height-ft" className="text-[9px] text-foreground-muted font-bold text-center block uppercase tracking-tighter">FT</label>
                                        <input
                                            id="height-ft"
                                            type="number"
                                            value={heightFt}
                                            onChange={(e) => setHeightFt(Number(e.target.value))}
                                            className="w-full bg-black/40 px-4 py-3 rounded-xl font-mono font-black border border-white/10 text-white focus:border-primary/50 outline-none"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <label htmlFor="height-in" className="text-[9px] text-foreground-muted font-bold text-center block uppercase tracking-tighter">IN</label>
                                        <input
                                            id="height-in"
                                            type="number"
                                            value={heightIn}
                                            onChange={(e) => setHeightIn(Number(e.target.value))}
                                            className="w-full bg-black/40 px-4 py-3 rounded-xl font-mono font-black border border-white/10 text-white focus:border-primary/50 outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Weight Input */}
                        <div className="space-y-3">
                            <label htmlFor="weight-range" className="flex items-center gap-2 text-[9px] font-black tracking-[0.3em] text-primary/60 cursor-pointer">
                                <Weight size={12} aria-hidden="true" /> WEIGHT SENSOR
                            </label>
                            {units === 'metric' ? (
                                <div className="flex items-center gap-4">
                                    <input
                                        id="weight-range"
                                        type="range"
                                        min="30"
                                        max="150"
                                        value={weightKg}
                                        onChange={(e) => setWeightKg(Number(e.target.value))}
                                        className="flex-1 accent-primary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                                        aria-valuetext={`${weightKg} kilograms`}
                                    />
                                    <div className="w-24 bg-black/40 px-4 py-2.5 rounded-xl text-center font-mono font-black border border-white/10 shadow-inner text-white">
                                        {weightKg} <span className="text-[9px] text-foreground-muted">KG</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <input
                                        id="weight-range"
                                        type="range"
                                        min="66"
                                        max="400"
                                        value={weightLbs}
                                        onChange={(e) => setWeightLbs(Number(e.target.value))}
                                        className="flex-1 accent-primary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                                        aria-valuetext={`${weightLbs} pounds`}
                                    />
                                    <div className="w-24 bg-black/40 px-4 py-2.5 rounded-xl text-center font-mono font-black border border-white/10 shadow-inner text-white">
                                        {weightLbs} <span className="text-[9px] text-foreground-muted">LBS</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Result Card */}
                    <div className="text-center p-5 rounded-2xl bg-black/40 border border-white/5 shadow-inner" role="region" aria-live="polite">
                        <p className="text-[8px] font-black text-primary/40 mb-1.5 uppercase tracking-[0.4em]">Calculated BMI Index</p>
                        <div className="flex flex-col items-center">
                            <div className="text-4xl font-mono font-black text-white mb-1 tracking-tighter" aria-label={`BMI is ${bmi}`}>
                                {isNaN(bmi) ? '--' : bmi}
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 ${getCategoryColor()} font-black text-[10px] uppercase tracking-widest mb-5 border border-white/5`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden="true" />
                                {category}
                            </div>

                            {/* BMI Scale Bar */}
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative mt-1.5" role="progressbar" aria-valuenow={Math.min(100, Math.max(0, ((bmi - 15) / 30) * 100))} aria-valuemin={0} aria-valuemax={100} aria-label="BMI categorization scale">
                                {/* Indicator */}
                                <motion.div
                                    className="absolute top-0 bottom-0 w-1.5 bg-primary shadow-[0_0_10px_rgba(223,255,0,0.8)] z-10"
                                    animate={{
                                        left: `${Math.min(98, Math.max(0, ((bmi - 15) / 30) * 100))}%`
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-green-500/20 via-orange-500/20 to-red-500/20" />
                            </div>
                            <div className="flex justify-between w-full text-[8px] text-white/20 font-mono mt-2 px-0.5 uppercase tracking-tighter" aria-hidden="true">
                                <span>15</span>
                                <span>18.5</span>
                                <span>25</span>
                                <span>30</span>
                                <span>45</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visualization Column */}
                <div className="relative flex items-center justify-center bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden group/viz shadow-inner min-h-[420px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    <BodyVisualizer bmi={bmi} />

                    <div className="absolute bottom-6 left-8 right-8 text-center opacity-40 group-hover:opacity-80 transition-opacity">
                        <p className="text-[8px] text-white font-mono leading-relaxed uppercase tracking-widest">
                            Metabolic Simulation: Predictive alignment based on biometric telemetry.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
