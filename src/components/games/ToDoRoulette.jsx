import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Sparkles, RotateCw, MapPin, Check, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../../utils/SoundManager';

// --- Mock AI Generator Data ---
const DESTINATION_ACTIVITIES = {
    'Paris': ['Climb Eiffel Tower', 'Visit Louvre', 'Seine River Cruise', 'Eat a Macaron', 'Walk Montmartre'],
    'Tokyo': ['Shibuya Crossing', 'Eat Sushi', 'Visit Senso-ji', 'Akihabara Shopping', 'Meiji Shrine'],
    'New York': ['Central Park Walk', 'Times Square', 'Statue of Liberty', 'Broadway Show', 'Brooklyn Bridge'],
    'London': ['Big Ben', 'London Eye', 'British Museum', 'Buckingham Palace', 'Camden Market'],
    'Rome': ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Eat Gelato', 'Pantheon'],
    'Bali': ['Uluwatu Temple', 'Monkey Forest', 'Rice Terraces', 'Surf Lesson', 'Beach Sunset'],
    'Dubai': ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Palm Jumeirah', 'Gold Souk'],
    'Sydney': ['Opera House', 'Bondi Beach', 'Harbour Bridge', 'Taronga Zoo', 'Darling Harbour'],
};

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];

const ToDoRoulette = () => {
    const [items, setItems] = useState(['Morning Coffee', 'Read a Book', 'Go for a Walk', 'Call a Friend']);
    const [newItem, setNewItem] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [destinationInput, setDestinationInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const wheelRef = useRef(null);

    const addItem = () => {
        if (newItem.trim()) {
            SoundManager.playClick();
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const generateForDestination = () => {
        if (!destinationInput.trim()) return;

        setIsGenerating(true);
        // Simulate AI delay
        setTimeout(() => {
            const city = Object.keys(DESTINATION_ACTIVITIES).find(k =>
                k.toLowerCase() === destinationInput.toLowerCase()
            );

            if (city) {
                setItems(DESTINATION_ACTIVITIES[city]);
                SoundManager.playWin(); // Success sound
            } else {
                // Fallback "AI" generation
                setItems([
                    `Explore ${destinationInput} Center`,
                    `Try Local Food in ${destinationInput}`,
                    `Visit ${destinationInput} Museum`,
                    `Take Photos in ${destinationInput}`,
                    `Buy Souvenirs in ${destinationInput}`
                ]);
                SoundManager.playClick();
            }
            setIsGenerating(false);
        }, 800);
    };

    const spinWheel = () => {
        if (isSpinning || items.length < 2) return;

        setIsSpinning(true);
        setWinner(null);
        SoundManager.playSpin();

        // Random rotation between 5 and 10 full spins (1800 - 3600 degrees) + random segment
        const spinAngle = 1800 + Math.random() * 1800;
        const newRotation = rotation + spinAngle;
        setRotation(newRotation);

        // Calculate winner
        const finalAngle = newRotation % 360;
        const segmentSize = 360 / items.length;
        const winningIndex = Math.floor(((360 - finalAngle) % 360) / segmentSize);

        setTimeout(() => {
            setIsSpinning(false);
            SoundManager.playWin();
            setWinner(items[winningIndex]);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: [COLORS[winningIndex % COLORS.length]]
            });
        }, 4000); // 4s spin duration matches CSS transition
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto p-4">
            {/* Left Panel: Controls & List */}
            <div className="flex-1 space-y-6">

                {/* Generator Section */}
                <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h2 className="text-xl font-bold text-white">AI Itinerary Generator</h2>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={destinationInput}
                                onChange={(e) => setDestinationInput(e.target.value)}
                                placeholder="Enter destination (e.g., Paris)"
                                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && generateForDestination()}
                            />
                        </div>
                        <button
                            onClick={generateForDestination}
                            disabled={isGenerating || !destinationInput}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isGenerating ? <RotateCw className="w-5 h-5 animate-spin" /> : 'Generate'}
                        </button>
                    </div>
                </div>

                {/* Manual List Section */}
                <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-xl flex-1 flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Your To-Do List</h2>
                        <span className="text-sm text-slate-400">{items.length} items</span>
                    </div>

                    {/* Add Item Input */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Add a custom activity..."
                            className="flex-1 bg-slate-900/50 border border-slate-600 rounded-xl py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && addItem()}
                        />
                        <button
                            onClick={addItem}
                            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>

                    {/* List Items */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        <AnimatePresence>
                            {items.map((item, index) => (
                                <motion.div
                                    key={`${item}-${index}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="group flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-slate-200 font-medium">{item}</span>
                                    </div>
                                    <button
                                        onClick={() => removeItem(index)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {items.length === 0 && (
                            <div className="text-center py-10 text-slate-500">
                                <p>No items yet.</p>
                                <p className="text-sm">Add some or generate a list!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel: Wheel */}
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[500px]">
                {/* Pointer */}
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-20">
                    <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-yellow-400 drop-shadow-lg filter" />
                </div>

                {/* Wheel Container */}
                <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
                    <div
                        className="w-full h-full rounded-full border-8 border-slate-800 shadow-2xl overflow-hidden relative transition-transform duration-[4000ms] cubic-bezier(0.1, 0, 0.18, 1)"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {items.map((item, index) => {
                            const rotate = (360 / items.length) * index;
                            const skew = 90 - (360 / items.length);
                            const color = COLORS[index % COLORS.length];

                            return (
                                <div
                                    key={index}
                                    className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left border-l border-slate-900/10"
                                    style={{
                                        transform: `rotate(${rotate}deg) skewY(-${skew}deg)`,
                                        background: color,
                                    }}
                                >
                                    <div
                                        className="absolute left-0 bottom-0 w-full h-full flex items-center justify-center"
                                        style={{
                                            transform: `skewY(${skew}deg) rotate(${360 / items.length / 2}deg)`,
                                        }}
                                    >
                                        <span className="text-white font-bold text-sm md:text-base truncate max-w-[120px] rotate-90 drop-shadow-md">
                                            {item}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Center Cap */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-700 shadow-xl flex items-center justify-center z-10">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
                            <Shuffle className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Spin Button */}
                <button
                    onClick={spinWheel}
                    disabled={isSpinning || items.length < 2}
                    className={`mt-12 px-12 py-4 text-xl font-black text-white rounded-2xl shadow-xl transform transition-all ${isSpinning || items.length < 2
                            ? 'bg-slate-700 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-blue-500/25 active:scale-95'
                        }`}
                >
                    {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL!'}
                </button>

                {/* Winner Modal Overlay */}
                <AnimatePresence>
                    {winner && !isSpinning && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-sm rounded-3xl"
                        >
                            <div className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-sm mx-4 transform rotate-0">
                                <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-2">Fate Decided</h3>
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                                    {winner}
                                </div>
                                <button
                                    onClick={() => setWinner(null)}
                                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Awesome!
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ToDoRoulette;
