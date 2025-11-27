import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star, Play, Pause, RotateCcw, Zap, Shield, Clock, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../../utils/SoundManager';
import { useSubscription } from '../../context/SubscriptionContext';

// --- Constants ---
const MODES = {
    CLASSIC: 'classic',
    SPEED: 'speed',
    QUEST: 'quest'
};

const POWERUPS = [
    { id: 'instant', name: 'Instant Daub', icon: Zap, color: 'text-yellow-400', desc: 'Mark any one number' },
    { id: 'freeze', name: 'Time Freeze', icon: Clock, color: 'text-cyan-400', desc: 'Pause caller for 10s' },
    { id: 'shield', name: 'Miss Shield', icon: Shield, color: 'text-green-400', desc: 'Prevent one miss' },
];

// --- Helper Functions ---
const generateBingoCard = () => {
    const card = [];
    const ranges = [[1, 15], [16, 30], [31, 45], [46, 60], [61, 75]];

    for (let col = 0; col < 5; col++) {
        const [min, max] = ranges[col];
        const nums = new Set();
        while (nums.size < 5) {
            nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        card.push([...nums]);
    }

    // Transpose to rows for rendering and set Free Space
    const grid = Array(5).fill(null).map(() => Array(5).fill(null));
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            grid[r][c] = card[c][r];
        }
    }
    grid[2][2] = 'FREE';
    return grid;
};

const TravelBingo = () => {
    const { isPremium, setShowUpgradeModal } = useSubscription();
    const [mode, setMode] = useState(MODES.CLASSIC);
    const [grid, setGrid] = useState([]);
    const [marked, setMarked] = useState(new Set(['2-2'])); // Center is always marked
    const [calledNumbers, setCalledNumbers] = useState(new Set());
    const [currentCall, setCurrentCall] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [bingo, setBingo] = useState(false);
    const [callSpeed, setCallSpeed] = useState(3000);
    const timerRef = useRef(null);

    // --- Game Logic ---

    const startGame = (selectedMode) => {
        setMode(selectedMode);
        setGrid(generateBingoCard());
        setMarked(new Set(['2-2']));
        setCalledNumbers(new Set());
        setCurrentCall(null);
        setBingo(false);
        setIsPlaying(true);
        setCallSpeed(selectedMode === MODES.SPEED ? 1500 : 3500);
    };

    const stopGame = () => {
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // Number Caller
    useEffect(() => {
        if (isPlaying && !bingo) {
            timerRef.current = setInterval(() => {
                let nextNum;
                do {
                    nextNum = Math.floor(Math.random() * 75) + 1;
                } while (calledNumbers.has(nextNum) && calledNumbers.size < 75);

                if (calledNumbers.size >= 75) {
                    stopGame();
                    return;
                }

                setCalledNumbers(prev => {
                    const newSet = new Set(prev);
                    newSet.add(nextNum);
                    return newSet;
                });
                setCurrentCall(nextNum);
                SoundManager.playClick();

            }, callSpeed);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, bingo, callSpeed, calledNumbers]);

    // Handle Cell Click
    const handleCellClick = (row, col, value) => {
        if (!isPlaying || value === 'FREE') return;

        if (!calledNumbers.has(value)) {
            return;
        }

        const key = `${row}-${col}`;
        if (marked.has(key)) return;

        const newMarked = new Set(marked);
        newMarked.add(key);
        setMarked(newMarked);
        SoundManager.playMark();

        checkForWin(newMarked);
    };

    const checkForWin = (currentMarked) => {
        // Check Rows, Cols, Diagonals
        let win = false;

        // Rows & Cols
        for (let i = 0; i < 5; i++) {
            if ([0, 1, 2, 3, 4].every(c => currentMarked.has(`${i}-${c}`))) win = true;
            if ([0, 1, 2, 3, 4].every(r => currentMarked.has(`${r}-${i}`))) win = true;
        }
        // Diagonals
        if ([0, 1, 2, 3, 4].every(i => currentMarked.has(`${i}-${i}`))) win = true;
        if ([0, 1, 2, 3, 4].every(i => currentMarked.has(`${i}-${4 - i}`))) win = true;

        if (win) {
            setBingo(true);
            stopGame();
            SoundManager.playBingo();
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FCD34D', '#F59E0B', '#EF4444']
            });
        }
    };

    // --- Render ---

    if (!isPlaying && !bingo) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
                    <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Travel Bingo</h2>
                <p className="text-slate-400 mb-8">Choose your game mode to start playing!</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                    <button
                        onClick={() => startGame(MODES.CLASSIC)}
                        className="group p-6 bg-slate-700/50 hover:bg-slate-700 rounded-2xl border border-slate-600 hover:border-cyan-500 transition-all"
                    >
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-cyan-400 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Classic</h3>
                        <p className="text-sm text-slate-400">Relaxed pace. Standard rules.</p>
                    </button>

                    <button
                        onClick={() => startGame(MODES.SPEED)}
                        className="group p-6 bg-slate-700/50 hover:bg-slate-700 rounded-2xl border border-slate-600 hover:border-pink-500 transition-all"
                    >
                        <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-pink-400 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Speed Bingo</h3>
                        <p className="text-sm text-slate-400">Fast calls. Quick reactions.</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-4 sm:p-8 border border-slate-700 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors">
                        {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                    </button>
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {mode === MODES.SPEED ? 'Speed Bingo' : 'Classic Bingo'}
                        </h3>
                        <p className="text-xs text-slate-400">Match the pattern to win</p>
                    </div>
                </div>

                {/* Current Call Display */}
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Current Call</p>
                        <p className="text-3xl font-bold text-white font-mono">{currentCall || '--'}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 border-4 border-slate-800 animate-pulse">
                        <span className="text-3xl font-bold text-white">{currentCall || '?'}</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-8 max-w-md mx-auto aspect-square">
                {/* Headers */}
                {['B', 'I', 'N', 'G', 'O'].map(letter => (
                    <div key={letter} className="text-center font-bold text-slate-500 text-lg sm:text-xl">{letter}</div>
                ))}

                {/* Cells */}
                {grid.map((row, rIndex) => (
                    row.map((cell, cIndex) => {
                        const isFree = cell === 'FREE';
                        const isMarked = marked.has(`${rIndex}-${cIndex}`);
                        const isCalled = typeof cell === 'number' && calledNumbers.has(cell);

                        return (
                            <motion.button
                                key={`${rIndex}-${cIndex}`}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCellClick(rIndex, cIndex, cell)}
                                className={`
                                    aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-xl font-bold transition-all relative overflow-hidden
                                    ${isFree ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : ''}
                                    ${isMarked
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105 z-10'
                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                    }
                                    ${!isMarked && isCalled && !isFree ? 'ring-2 ring-cyan-500/30 ring-inset' : ''}
                                `}
                            >
                                {isFree ? <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> : cell}
                                {isMarked && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute inset-0 bg-cyan-500 mix-blend-overlay"
                                    />
                                )}
                            </motion.button>
                        );
                    })
                ))}
            </div>

            {/* Power-ups (Premium) */}
            <div className="flex justify-center gap-4 mb-6">
                {POWERUPS.map(p => (
                    <button
                        key={p.id}
                        onClick={() => !isPremium && setShowUpgradeModal(true)}
                        className={`relative group p-3 rounded-xl border transition-all ${isPremium
                            ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                            : 'bg-slate-800/30 border-slate-700 opacity-70'
                            }`}
                    >
                        <p.icon className={`w-6 h-6 ${p.color}`} />
                        {!isPremium && (
                            <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1">
                                <Lock className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Bingo / Reset Button */}
            {bingo ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
                        BINGO!
                    </h2>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => {
                                const text = `I just got BINGO in ${mode} mode! Can you beat my luck? Play now at PackYourBags!`;
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Travel Bingo Winner!',
                                        text: text,
                                        url: window.location.href
                                    }).catch(console.error);
                                } else {
                                    navigator.clipboard.writeText(`${text} ${window.location.href}`);
                                    alert('Result copied to clipboard!');
                                }
                            }}
                            className="px-8 py-3 bg-purple-600 text-white rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Share2 className="w-5 h-5" />
                            Share Victory
                        </button>
                        <button
                            onClick={() => { setBingo(false); setIsPlaying(false); }}
                            className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform"
                        >
                            Play Again
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center">
                    <button
                        onClick={() => { stopGame(); setIsPlaying(false); }}
                        className="text-slate-500 text-sm hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <RotateCcw className="w-4 h-4" /> Quit Game
                    </button>
                </div>
            )}
        </div>
    );
};

export default TravelBingo;
