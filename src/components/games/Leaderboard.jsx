import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, User, Crown, X } from 'lucide-react';

const MOCK_DATA = {
    'flag-dash': [
        { rank: 1, name: "SpeedDemon99", score: "00:45.23", avatar: "🏎️" },
        { rank: 2, name: "TravelBug", score: "00:46.12", avatar: "✈️" },
        { rank: 3, name: "GlobeTrotter", score: "00:47.89", avatar: "🌍" },
        { rank: 4, name: "Wanderlust", score: "00:48.50", avatar: "🎒" },
        { rank: 5, name: "JetSetter", score: "00:49.10", avatar: "🛫" },
    ],
    'bingo': [
        { rank: 1, name: "LuckyStar", score: "12 Wins", avatar: "⭐" },
        { rank: 2, name: "BingoKing", score: "10 Wins", avatar: "👑" },
        { rank: 3, name: "PatternMaster", score: "8 Wins", avatar: "🧩" },
        { rank: 4, name: "DauberPro", score: "7 Wins", avatar: "🖊️" },
        { rank: 5, name: "GridLock", score: "5 Wins", avatar: "🔢" },
    ],
    'who-pays': [
        { rank: 1, name: "FreeLoader", score: "20 Wins", avatar: "💸" },
        { rank: 2, name: "Tactician", score: "18 Wins", avatar: "🧠" },
        { rank: 3, name: "X_Marks_Spot", score: "15 Wins", avatar: "❌" },
        { rank: 4, name: "CircleOfLife", score: "14 Wins", avatar: "⭕" },
        { rank: 5, name: "BillDodger", score: "10 Wins", avatar: "🏃" },
    ]
};

const Leaderboard = ({ gameId, onClose }) => {
    const [timeframe, setTimeframe] = useState('weekly');
    const data = MOCK_DATA[gameId] || [];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <Trophy className="w-12 h-12 text-white mx-auto mb-2 drop-shadow-lg" />
                    <h2 className="text-2xl font-bold text-white">Global Leaderboard</h2>
                    <p className="text-amber-100 text-sm">Top players this week</p>
                </div>

                {/* Filters */}
                <div className="flex p-2 bg-slate-800 gap-2">
                    {['daily', 'weekly', 'all-time'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all ${timeframe === t
                                    ? 'bg-slate-700 text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {t.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                    {data.map((player, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-4 p-3 rounded-2xl border ${index === 0 ? 'bg-amber-500/10 border-amber-500/30' :
                                    index === 1 ? 'bg-slate-700/30 border-slate-600' :
                                        index === 2 ? 'bg-orange-900/20 border-orange-800/30' :
                                            'bg-slate-800/30 border-slate-700'
                                }`}
                        >
                            <div className="w-8 font-bold text-slate-400 text-center">
                                {index === 0 ? <Crown className="w-6 h-6 text-amber-400 mx-auto" /> : `#${player.rank}`}
                            </div>
                            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl">
                                {player.avatar}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold ${index === 0 ? 'text-amber-400' : 'text-white'}`}>
                                    {player.name}
                                </h3>
                                <p className="text-xs text-slate-400">Level {Math.floor(Math.random() * 50) + 1}</p>
                            </div>
                            <div className="font-mono font-bold text-cyan-400">
                                {player.score}
                            </div>
                        </div>
                    ))}

                    {/* User's Rank (Mock) */}
                    <div className="mt-6 pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800 border border-slate-600">
                            <div className="w-8 font-bold text-slate-400 text-center">#42</div>
                            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white">You</h3>
                                <p className="text-xs text-slate-400">Level 5</p>
                            </div>
                            <div className="font-mono font-bold text-slate-400">
                                --
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Leaderboard;
