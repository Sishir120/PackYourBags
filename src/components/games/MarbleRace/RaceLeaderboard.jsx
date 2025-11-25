import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Medal } from 'lucide-react';

const RaceLeaderboard = ({ data, focusedIndex }) => {
    return (
        <div className="w-80 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-white">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-200">
                <Medal className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-800">Live Rankings</h3>
            </div>

            <div className="space-y-2">
                {data.map((entry, index) => {
                    const isFocused = index === focusedIndex;
                    const medalColors = {
                        0: 'text-yellow-500',
                        1: 'text-slate-400',
                        2: 'text-amber-700'
                    };

                    return (
                        <motion.div
                            key={entry.country.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isFocused
                                    ? 'bg-blue-100 border-2 border-blue-400 scale-105'
                                    : 'bg-slate-50 border-2 border-transparent'
                                }`}
                        >
                            {/* Rank */}
                            <div className={`w-8 h-8 flex items-center justify-center font-bold text-lg ${index < 3 ? medalColors[index] : 'text-slate-600'
                                }`}>
                                {index < 3 ? '★' : entry.rank}
                            </div>

                            {/* Flag */}
                            <div className="text-3xl">{entry.country.flag}</div>

                            {/* Country Name */}
                            <div className="flex-1">
                                <div className="font-bold text-slate-800 text-sm truncate">
                                    {entry.country.name}
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${entry.progress}%` }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>

                            {/* Arrow indicator for focused */}
                            {isFocused && (
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {data.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                    Race starting...
                </div>
            )}
        </div>
    );
};

export default RaceLeaderboard;
