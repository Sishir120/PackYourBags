import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lock, Zap, Crown, X } from 'lucide-react';
import { useGameLimit } from '../context/GameLimitContext';
import { useSubscription } from '../context/SubscriptionContext';

/**
 * Game Limit Guard Component
 * Wraps game components and enforces play limits for free users
 */
const GameLimitGuard = ({ gameId, gameName, children, onLimitReached }) => {
    const { canPlayGame, recordGamePlay, getTotalPlaysRemaining, getFormattedCooldown, isPremium } = useGameLimit();
    const { setShowUpgradeModal } = useSubscription();
    const [gameStatus, setGameStatus] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(null);

    useEffect(() => {
        const status = canPlayGame(gameId);
        setGameStatus(status);

        // Show warning when only 1 play remaining
        if (!isPremium && status.playsRemaining === 1 && status.canPlay) {
            setShowWarning(true);
        }

        // Update cooldown display
        if (status.cooldownEnd) {
            const interval = setInterval(() => {
                setCooldownTime(getFormattedCooldown());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameId, isPremium]);

    // Record play when game starts
    const handleGameStart = () => {
        if (!isPremium) {
            recordGamePlay(gameId);
            setGameStatus(canPlayGame(gameId));
        }
    };

    // If in cooldown, show cooldown screen
    if (gameStatus && !gameStatus.canPlay && gameStatus.cooldownEnd) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-3">Cooldown Active</h2>
                    <p className="text-slate-300 mb-6">
                        You've used all your free plays! Come back in:
                    </p>

                    <div className="bg-slate-900/50 rounded-2xl p-6 mb-6">
                        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            {cooldownTime || getFormattedCooldown()}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <Crown className="w-5 h-5" />
                            Upgrade to Premium - Play Unlimited
                        </button>

                        <a
                            href="/arcade"
                            className="block w-full px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
                        >
                            Back to Arcade
                        </a>
                    </div>

                    <p className="text-xs text-slate-400 mt-6">
                        Premium members get unlimited plays with no cooldowns!
                    </p>
                </motion.div>
            </div>
        );
    }

    // If no plays remaining but not in cooldown yet, show limit reached
    if (gameStatus && !gameStatus.canPlay && !gameStatus.cooldownEnd) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-3">Limit Reached</h2>
                    <p className="text-slate-300 mb-6">
                        You've used all {getTotalPlaysRemaining() + 3} free plays for {gameName}!
                    </p>

                    <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mb-3"
                    >
                        <Crown className="w-5 h-5" />
                        Upgrade for Unlimited Access
                    </button>

                    <a
                        href="/arcade"
                        className="block w-full px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
                    >
                        Try Other Games
                    </a>
                </motion.div>
            </div>
        );
    }

    // Show warning banner if last play
    return (
        <div className="relative">
            <AnimatePresence>
                {showWarning && !isPremium && gameStatus?.playsRemaining === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                            <Zap className="w-6 h-6 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-bold text-sm">Last Free Play!</p>
                                <p className="text-xs opacity-90">Upgrade to Premium for unlimited access</p>
                            </div>
                            <button
                                onClick={() => setShowWarning(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Render the game with play tracking */}
            {React.cloneElement(children, {
                onGameStart: handleGameStart,
                playsRemaining: gameStatus?.playsRemaining,
                isPremium: gameStatus?.isPremium
            })}
        </div>
    );
};

export default GameLimitGuard;
