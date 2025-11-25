import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Circle, RotateCcw, Wallet, Coffee, Beer, Car, ShoppingBag, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../../../utils/SoundManager';
import { useSubscription } from '../../../context/SubscriptionContext';

const CHALLENGES = [
    { text: "Buy the next round of drinks", icon: Beer },
    { text: "Pay for the taxi/Uber", icon: Car },
    { text: "Treat the winner to coffee", icon: Coffee },
    { text: "Buy a souvenir for the winner", icon: ShoppingBag },
    { text: "Pay for the next meal", icon: Wallet },
];

const WhoPays = () => {
    const { isPremium, setShowUpgradeModal } = useSubscription();
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null); // 'X', 'O', or 'Draw'
    const [challenge, setChallenge] = useState(null);
    const [scores, setScores] = useState({ X: 0, O: 0 });

    const checkWinner = useCallback((squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return squares.every(Boolean) ? 'Draw' : null;
    }, []);

    const handleClick = (index) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
        SoundManager.playClick();
        if (navigator.vibrate) navigator.vibrate(20);

        const result = checkWinner(newBoard);
        if (result) {
            handleGameEnd(result);
        }
    };

    const handleGameEnd = (result) => {
        setWinner(result);
        if (result !== 'Draw') {
            SoundManager.playWin();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: result === 'X' ? ['#22d3ee', '#0ea5e9'] : ['#f472b6', '#db2777']
            });
            setScores(prev => ({ ...prev, [result]: prev[result] + 1 }));

            // Select random challenge for the loser
            const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
            setChallenge(randomChallenge);
        } else {
            SoundManager.playLose(); // Draw sound
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setChallenge(null);
        setIsXNext(true);
    };

    const renderSquare = (i) => (
        <motion.button
            whileHover={{ scale: !board[i] && !winner ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
            className={`h-24 w-24 sm:h-32 sm:w-32 bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 flex items-center justify-center text-4xl sm:text-6xl shadow-lg transition-colors ${board[i] === 'X' ? 'border-cyan-500/30 text-cyan-400' :
                board[i] === 'O' ? 'border-pink-500/30 text-pink-400' :
                    'border-slate-700 hover:border-slate-600'
                }`}
            onClick={() => handleClick(i)}
        >
            <AnimatePresence>
                {board[i] && (
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {board[i] === 'X' ? <X className="w-16 h-16 sm:w-20 sm:h-20" /> : <Circle className="w-14 h-14 sm:w-16 sm:h-16" />}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto p-4">

            {/* Header & Score */}
            <div className="flex justify-between items-center w-full max-w-md mb-8 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-xl">
                <div className={`flex flex-col items-center ${isXNext && !winner ? 'opacity-100 scale-110' : 'opacity-50'} transition-all`}>
                    <span className="text-cyan-400 font-bold text-xl flex items-center gap-2"><X className="w-5 h-5" /> Player 1</span>
                    <span className="text-white text-2xl font-display">{scores.X}</span>
                </div>
                <div className="h-10 w-px bg-slate-600"></div>
                <div className={`flex flex-col items-center ${!isXNext && !winner ? 'opacity-100 scale-110' : 'opacity-50'} transition-all`}>
                    <span className="text-pink-400 font-bold text-xl flex items-center gap-2"><Circle className="w-4 h-4" /> Player 2</span>
                    <span className="text-white text-2xl font-display">{scores.O}</span>
                </div>
            </div>

            {/* Game Board */}
            <div className="relative">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                    {Array(9).fill(null).map((_, i) => (
                        <React.Fragment key={i}>
                            {renderSquare(i)}
                        </React.Fragment>
                    ))}
                </div>

                {/* Winner Overlay */}
                <AnimatePresence>
                    {winner && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                        >
                            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-600 p-8 rounded-2xl shadow-2xl text-center min-w-[300px] pointer-events-auto">
                                <h3 className="text-3xl font-bold text-white mb-2">
                                    {winner === 'Draw' ? "It's a Draw!" : `${winner === 'X' ? 'Player 1' : 'Player 2'} Wins!`}
                                </h3>

                                {winner !== 'Draw' && challenge && (
                                    <div className="my-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                        <p className="text-red-300 text-sm uppercase font-bold mb-2">Loser Must:</p>
                                        <div className="flex flex-col items-center gap-2 text-white font-bold text-lg">
                                            <challenge.icon className="w-8 h-8 text-red-400" />
                                            {challenge.text}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={resetGame}
                                    className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2 mx-auto"
                                >
                                    <RotateCcw className="w-5 h-5" /> Play Again
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Premium Teaser */}
            {!isPremium && (
                <div className="mt-8 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl max-w-md text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-400 font-bold mb-2">
                        <Crown className="w-5 h-5" />
                        <span>Premium Features Locked</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">Unlock custom themes, avatars, and "Extreme Mode" with PackYourBags Pro.</p>
                    <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="text-xs font-bold text-white bg-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-500 transition-colors"
                    >
                        Upgrade Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default WhoPays;
