import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, XCircle, Lock, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../../utils/SoundManager';
import { getDestinationImage } from '../../data/destinationImages.js';

const LOCATIONS = [
    {
        id: 1,
        name: "Santorini, Greece",
        image: getDestinationImage('santorini-greece'),
        options: ["Santorini, Greece", "Amalfi Coast, Italy", "Dubrovnik, Croatia", "Ibiza, Spain"]
    },
    {
        id: 2,
        name: "Kyoto, Japan",
        image: getDestinationImage('kyoto-japan'),
        options: ["Seoul, South Korea", "Kyoto, Japan", "Beijing, China", "Taipei, Taiwan"]
    },
    {
        id: 3,
        name: "Machu Picchu, Peru",
        image: getDestinationImage('machu-picchu-peru'),
        options: ["Petra, Jordan", "Chichen Itza, Mexico", "Machu Picchu, Peru", "Great Wall, China"]
    },
    {
        id: 4,
        name: "Banff, Canada",
        image: getDestinationImage('banff-canada'),
        options: ["Swiss Alps", "Banff, Canada", "Aspen, USA", "Patagonia, Chile"]
    },
    {
        id: 5,
        name: "Petra, Jordan",
        image: getDestinationImage('petra-jordan'),
        options: ["Cairo, Egypt", "Petra, Jordan", "Doha, Qatar", "Muscat, Oman"]
    },
    {
        id: 6,
        name: "Great Barrier Reef, Australia",
        image: getDestinationImage('great-barrier-reef-australia'),
        options: ["Maldives", "Fiji", "Great Barrier Reef, Australia", "Bora Bora"]
    },
    {
        id: 7,
        name: "Taj Mahal, India",
        image: getDestinationImage('taj-mahal-india'),
        options: ["Taj Mahal, India", "Angkor Wat, Cambodia", "Grand Palace, Thailand", "Hagia Sophia, Turkey"]
    },
    {
        id: 8,
        name: "Eiffel Tower, France",
        image: getDestinationImage('eiffel-tower-france'),
        options: ["Blackpool Tower, UK", "Tokyo Tower, Japan", "Eiffel Tower, France", "Las Vegas, USA"]
    }
];

const GeoMaster = () => {
    const [started, setStarted] = useState(false);
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showPremium, setShowPremium] = useState(false);

    const currentLoc = LOCATIONS[currentRound];
    const isLastRound = currentRound === LOCATIONS.length - 1;

    const handleStart = () => {
        setStarted(true);
        setScore(0);
        setCurrentRound(0);
        setShowPremium(false);
        SoundManager.playClick();
    };

    const handleGuess = (option) => {
        if (selectedOption) return; // Prevent double guessing

        setSelectedOption(option);
        const correct = option === currentLoc.name;
        setIsCorrect(correct);

        if (correct) {
            setScore(s => s + 100);
            SoundManager.playWin();
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#22d3ee', '#3b82f6']
            });
        } else {
            SoundManager.playLose();
        }
    };

    const handleNext = () => {
        SoundManager.playClick();
        if (isLastRound) {
            // End game / Show premium upsell
            setShowPremium(true);
        } else {
            setSelectedOption(null);
            setIsCorrect(null);
            setCurrentRound(r => r + 1);
        }
    };

    // Start Screen
    if (!started) {
        return (
            <div className="h-full flex flex-col relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 group">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800"
                        alt="Background"
                        className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">GeoMaster</h3>
                    <p className="text-slate-300 mb-6">Test your geography knowledge. Identify famous landmarks and hidden gems.</p>
                    <button
                        onClick={handleStart}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        Start Challenge <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    // Premium Upsell Screen (End of Game)
    if (showPremium) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-2">Score: {score}</h3>
                    <p className="text-slate-300 mb-8">You're a natural explorer!</p>

                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
                        <div className="flex items-center gap-3 mb-2 text-left">
                            <Lock className="w-5 h-5 text-amber-400" />
                            <span className="font-bold text-white">Unlock Global Mode</span>
                        </div>
                        <p className="text-sm text-slate-400 text-left">Access 500+ locations, multiplayer duels, and detailed travel guides for every location.</p>
                    </div>

                    <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform mb-3">
                        Unlock for $4.99
                    </button>
                    <button
                        onClick={handleStart}
                        className="text-slate-400 hover:text-white text-sm"
                    >
                        Play Again (Free Mode)
                    </button>
                </div>
            </div>
        );
    }

    // Game Screen
    return (
        <div className="h-full flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            {/* Image Area */}
            <div className="relative h-48 sm:h-56 bg-slate-800">
                <img
                    src={currentLoc.image}
                    alt="Where is this?"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold border border-white/10">
                    Score: {score}
                </div>
            </div>

            {/* Options Area */}
            <div className="flex-1 p-6 flex flex-col">
                <h4 className="text-lg font-bold text-white mb-4">Where is this location?</h4>

                <div className="grid grid-cols-1 gap-3 mb-4">
                    {currentLoc.options.map((option, idx) => {
                        let btnClass = "p-3 rounded-lg text-left text-sm font-medium transition-all border ";

                        if (selectedOption) {
                            if (option === currentLoc.name) {
                                btnClass += "bg-green-500/20 border-green-500 text-green-200";
                            } else if (option === selectedOption) {
                                btnClass += "bg-red-500/20 border-red-500 text-red-200";
                            } else {
                                btnClass += "bg-slate-800 border-slate-700 text-slate-400 opacity-50";
                            }
                        } else {
                            btnClass += "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-blue-500";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleGuess(option)}
                                disabled={!!selectedOption}
                                className={btnClass}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {selectedOption && option === currentLoc.name && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    {selectedOption && option === selectedOption && option !== currentLoc.name && <XCircle className="w-4 h-4 text-red-500" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Next Button */}
                {selectedOption && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleNext}
                        className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
                    >
                        {isLastRound ? "Finish Game" : "Next Location"}
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default GeoMaster;
