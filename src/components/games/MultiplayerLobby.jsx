import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Wifi, X, Loader2, Play } from 'lucide-react';

const MultiplayerLobby = ({ gameName, onCancel, onGameStart }) => {
    const [status, setStatus] = useState('searching'); // searching, found, connecting, ready
    const [playersFound, setPlayersFound] = useState(1);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        // Simulate matchmaking process
        const timers = [];

        // Find player after 2-4 seconds
        timers.push(setTimeout(() => {
            setStatus('found');
            setPlayersFound(2);
        }, Math.random() * 2000 + 2000));

        // Connect after another 1.5 seconds
        timers.push(setTimeout(() => {
            setStatus('connecting');
        }, 4500));

        // Ready after another 1 second
        timers.push(setTimeout(() => {
            setStatus('ready');
        }, 6000));

        return () => timers.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (status === 'ready') {
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        onGameStart();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [status, onGameStart]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center">
                    {/* Status Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                        {status === 'searching' && (
                            <>
                                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping" />
                                <div className="absolute inset-0 border-4 border-cyan-500/50 rounded-full animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 rounded-full border-4 border-cyan-500">
                                    <Globe className="w-10 h-10 text-cyan-400 animate-spin-slow" />
                                </div>
                            </>
                        )}
                        {status === 'found' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 rounded-full border-4 border-green-500">
                                <Users className="w-10 h-10 text-green-400" />
                            </div>
                        )}
                        {status === 'ready' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 rounded-full border-4 border-amber-500">
                                <span className="text-4xl font-bold text-amber-500">{countdown}</span>
                            </div>
                        )}
                    </div>

                    {/* Status Text */}
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {status === 'searching' && "Searching for Opponent..."}
                        {status === 'found' && "Opponent Found!"}
                        {status === 'connecting' && "Connecting..."}
                        {status === 'ready' && "Starting Match"}
                    </h2>

                    <p className="text-slate-400 mb-8">
                        {status === 'searching' && "Scanning global servers"}
                        {status === 'found' && "Player: Traveler_123 (Level 12)"}
                        {status === 'connecting' && "Establishing secure connection"}
                        {status === 'ready' && "Get ready!"}
                    </p>

                    {/* Player Slots */}
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-cyan-500/20">
                                <span className="text-2xl">😎</span>
                            </div>
                            <span className="text-sm font-bold text-white">You</span>
                        </div>

                        <div className="flex items-center">
                            <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'searching' ? 'bg-slate-700' : 'bg-green-500'}`}>
                                <Wifi className="w-4 h-4 text-white" />
                            </div>
                            <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 transition-all ${playersFound > 1
                                    ? 'bg-purple-600 shadow-lg shadow-purple-500/20'
                                    : 'bg-slate-800 border-2 border-dashed border-slate-600'
                                }`}>
                                {playersFound > 1 ? <span className="text-2xl">🤠</span> : <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />}
                            </div>
                            <span className="text-sm font-bold text-slate-400">
                                {playersFound > 1 ? "Opponent" : "Waiting..."}
                            </span>
                        </div>
                    </div>

                    {status === 'searching' && (
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 rounded-full border border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
                        >
                            Cancel Search
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MultiplayerLobby;
