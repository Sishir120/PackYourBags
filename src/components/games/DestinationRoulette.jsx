import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../../utils/SoundManager';

const DESTINATIONS = [
    { name: 'Paris', country: 'France', flag: '🇫🇷', color: '#3B82F6' },
    { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', color: '#EF4444' },
    { name: 'New York', country: 'USA', flag: '🇺🇸', color: '#10B981' },
    { name: 'London', country: 'UK', flag: '🇬🇧', color: '#F59E0B' },
    { name: 'Barcelona', country: 'Spain', flag: '🇪🇸', color: '#8B5CF6' },
    { name: 'Dubai', country: 'UAE', flag: '🇦🇪', color: '#EC4899' },
    { name: 'Bali', country: 'Indonesia', flag: '🇮🇩', color: '#14B8A6' },
    { name: 'Rome', country: 'Italy', flag: '🇮🇹', color: '#F97316' },
    { name: 'Sydney', country: 'Australia', flag: '🇦🇺', color: '#06B6D4' },
    { name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', color: '#A855F7' },
    { name: 'Singapore', country: 'Singapore', flag: '🇸🇬', color: '#EF4444' },
    { name: 'Santorini', country: 'Greece', flag: '🇬🇷', color: '#3B82F6' },
];

const DestinationRoulette = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef(null);

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setSelectedDestination(null);

        // Random destination
        const randomIndex = Math.floor(Math.random() * DESTINATIONS.length);
        const destination = DESTINATIONS[randomIndex];

        // Calculate rotation
        const segmentAngle = 360 / DESTINATIONS.length;
        const targetAngle = randomIndex * segmentAngle;
        const spins = 5; // Number of full rotations
        const finalRotation = rotation + (360 * spins) + targetAngle;

        setRotation(finalRotation);

        // Show result after animation
        setTimeout(() => {
            setSelectedDestination(destination);
            setIsSpinning(false);
            SoundManager.playWin();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: [destination.color]
            });
        }, 4000);
    };

    const resetWheel = () => {
        setRotation(0);
        setSelectedDestination(null);
    };

    // Play tick sounds while spinning
    useEffect(() => {
        if (isSpinning) {
            const interval = setInterval(() => {
                SoundManager.playSpin();
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isSpinning]);

    const segmentAngle = 360 / DESTINATIONS.length;

    return (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">To-Do Roulette</h2>
                        <p className="text-sm text-slate-400">Spin to discover your next trip!</p>
                    </div>
                </div>
                <button
                    onClick={resetWheel}
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                    <RotateCcw className="w-5 h-5 text-white" />
                </button>
            </div>

            <div className="relative flex flex-col items-center">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-yellow-400 drop-shadow-lg" />
                </div>

                {/* Wheel */}
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 my-8">
                    <motion.div
                        ref={wheelRef}
                        animate={{ rotate: rotation }}
                        transition={{ duration: 4, ease: "easeOut" }}
                        className="w-full h-full rounded-full relative shadow-2xl"
                        style={{
                            background: `conic-gradient(${DESTINATIONS.map((dest, i) =>
                                `${dest.color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
                            ).join(', ')})`
                        }}
                    >
                        {/* Center circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                                <MapPin className="w-8 h-8 text-slate-800" />
                            </div>
                        </div>

                        {/* Destination labels */}
                        {DESTINATIONS.map((dest, index) => {
                            const angle = (index * segmentAngle) + (segmentAngle / 2);
                            const radian = (angle - 90) * (Math.PI / 180);
                            const radius = 120;
                            const x = Math.cos(radian) * radius;
                            const y = Math.sin(radian) * radius;

                            return (
                                <div
                                    key={index}
                                    className="absolute top-1/2 left-1/2 text-white font-bold text-xs sm:text-sm whitespace-nowrap"
                                    style={{
                                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
                                    }}
                                >
                                    <span className="text-2xl">{dest.flag}</span>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Spin Button */}
                <button
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 ${isSpinning
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl hover:scale-105'
                        }`}
                >
                    <Play className="w-6 h-6" />
                    {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                </button>

                {/* Result */}
                <AnimatePresence>
                    {selectedDestination && !isSpinning && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                            className="mt-8 p-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl border-2 border-slate-600 text-center w-full max-w-sm"
                        >
                            <p className="text-slate-400 text-sm mb-2">Your Next Destination</p>
                            <div className="text-6xl mb-3">{selectedDestination.flag}</div>
                            <h3 className="text-3xl font-bold text-white mb-1">{selectedDestination.name}</h3>
                            <p className="text-cyan-400 font-medium">{selectedDestination.country}</p>
                            <button
                                onClick={() => window.open(`/destinations?search=${selectedDestination.name}`, '_blank')}
                                className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Explore Destination
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DestinationRoulette;
