import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

const ResultsModal = ({ winner, onReset }) => {
    React.useEffect(() => {
        if (winner) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [winner]);

    if (!winner) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-md pointer-events-auto p-4"
        >
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-yellow-400 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 animate-pulse" />

                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6 animate-bounce">
                    <Trophy className="w-10 h-10 text-yellow-600" />
                </div>

                <h2 className="text-4xl font-black text-slate-900 mb-2">
                    {winner.name} Wins!
                </h2>
                <div className="text-6xl mb-6">{winner.flag}</div>

                <p className="text-slate-500 mb-8">
                    The odds were in their favor! Ready to explore this destination?
                </p>

                <div className="space-y-3">
                    <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Explore {winner.name}
                    </button>

                    <button
                        onClick={onReset}
                        className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Race Again
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ResultsModal;
