import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Trophy, RotateCcw, Lightbulb, Crown, Plane, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../../utils/SoundManager';
import { useSubscription } from '../../context/SubscriptionContext';

// Travel Destinations Database
const DESTINATIONS = [
    { name: 'PARIS', hint: 'City of Light', country: '🇫🇷', difficulty: 'easy' },
    { name: 'TOKYO', hint: 'Land of the Rising Sun', country: '🇯🇵', difficulty: 'easy' },
    { name: 'NEW YORK', hint: 'The Big Apple', country: '🇺🇸', difficulty: 'easy' },
    { name: 'LONDON', hint: 'Home of Big Ben', country: '🇬🇧', difficulty: 'easy' },
    { name: 'BARCELONA', hint: 'Gaudí\'s Masterpiece City', country: '🇪🇸', difficulty: 'medium' },
    { name: 'AMSTERDAM', hint: 'City of Canals', country: '🇳🇱', difficulty: 'medium' },
    { name: 'SANTORINI', hint: 'White & Blue Paradise', country: '🇬🇷', difficulty: 'medium' },
    { name: 'REYKJAVIK', hint: 'Northern Lights Capital', country: '🇮🇸', difficulty: 'hard' },
    { name: 'MARRAKECH', hint: 'Red City of Morocco', country: '🇲🇦', difficulty: 'hard' },
    { name: 'KATHMANDU', hint: 'Gateway to Himalayas', country: '🇳🇵', difficulty: 'hard' },
    { name: 'BALI', hint: 'Island of Gods', country: '🇮🇩', difficulty: 'easy' },
    { name: 'DUBAI', hint: 'City of Gold', country: '🇦🇪', difficulty: 'easy' },
    { name: 'SYDNEY', hint: 'Opera House City', country: '🇦🇺', difficulty: 'easy' },
    { name: 'ROME', hint: 'Eternal City', country: '🇮🇹', difficulty: 'easy' },
    { name: 'SINGAPORE', hint: 'Lion City', country: '🇸🇬', difficulty: 'medium' },
];

const MAX_WRONG_GUESSES = 6;

const TravelHangman = () => {
    const { isPremium, setShowUpgradeModal } = useSubscription();
    const [currentDestination, setCurrentDestination] = useState(null);
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const randomDest = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
        setCurrentDestination(randomDest);
        setGuessedLetters([]);
        setWrongGuesses(0);
        setGameStatus('playing');
        setShowHint(false);
    };

    const handleGuess = (letter) => {
        if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;

        const newGuessed = [...guessedLetters, letter];
        setGuessedLetters(newGuessed);

        if (!currentDestination.name.includes(letter)) {
            SoundManager.playWrong();
            const newWrong = wrongGuesses + 1;
            setWrongGuesses(newWrong);

            if (newWrong >= MAX_WRONG_GUESSES) {
                setGameStatus('lost');
                SoundManager.playLose();
            }
        } else {
            SoundManager.playCorrect();
            // Check if won
            const allLetters = currentDestination.name.replace(/\s/g, '').split('');
            const won = allLetters.every(l => newGuessed.includes(l));

            if (won) {
                setGameStatus('won');
                SoundManager.playWin();
                const bonusPoints = (MAX_WRONG_GUESSES - wrongGuesses) * 10;
                const hintPenalty = hintsUsed * 5;
                const finalScore = 100 + bonusPoints - hintPenalty;
                setScore(score + finalScore);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    const handleRevealLetter = () => {
        if (gameStatus !== 'playing') return;

        // Check limits
        if (!isPremium && hintsUsed >= 1) {
            setShowUpgradeModal(true);
            return;
        }

        // Find unrevealed letters
        const unrevealed = currentDestination.name
            .split('')
            .filter(l => l !== ' ' && !guessedLetters.includes(l));

        if (unrevealed.length === 0) return;

        // Pick random letter
        const randomLetter = unrevealed[Math.floor(Math.random() * unrevealed.length)];

        // Reveal it
        handleGuess(randomLetter);
        setHintsUsed(hintsUsed + 1);
        SoundManager.playPop();
    };

    const renderWord = () => {
        return currentDestination.name.split('').map((letter, index) => {
            if (letter === ' ') {
                return <div key={index} className="w-4" />;
            }

            const isGuessed = guessedLetters.includes(letter);

            return (
                <motion.div
                    key={index}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: isGuessed ? 360 : 0 }}
                    transition={{ duration: 0.6 }}
                    className={`w-12 h-16 sm:w-14 sm:h-18 flex items-center justify-center text-2xl sm:text-3xl font-bold border-b-4 mx-1 ${isGuessed
                        ? 'border-cyan-500 text-white'
                        : 'border-slate-600 text-transparent'
                        }`}
                >
                    {isGuessed ? letter : '_'}
                </motion.div>
            );
        });
    };

    const renderKeyboard = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        return (
            <div className="grid grid-cols-7 sm:grid-cols-9 gap-2 max-w-2xl mx-auto">
                {alphabet.map(letter => {
                    const isGuessed = guessedLetters.includes(letter);
                    const isCorrect = isGuessed && currentDestination.name.includes(letter);
                    const isWrong = isGuessed && !currentDestination.name.includes(letter);

                    return (
                        <motion.button
                            key={letter}
                            whileHover={{ scale: isGuessed ? 1 : 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleGuess(letter)}
                            disabled={isGuessed || gameStatus !== 'playing'}
                            className={`p-3 rounded-lg font-bold text-sm sm:text-base transition-all ${isCorrect
                                ? 'bg-green-600 text-white cursor-not-allowed'
                                : isWrong
                                    ? 'bg-red-600/50 text-slate-400 cursor-not-allowed'
                                    : gameStatus === 'playing'
                                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                }`}
                        >
                            {letter}
                        </motion.button>
                    );
                })}
            </div>
        );
    };

    const renderHangman = () => {
        const parts = [
            // Head
            <circle key="head" cx="140" cy="60" r="20" stroke="white" strokeWidth="3" fill="none" />,
            // Body
            <line key="body" x1="140" y1="80" x2="140" y2="130" stroke="white" strokeWidth="3" />,
            // Left arm
            <line key="leftarm" x1="140" y1="95" x2="120" y2="110" stroke="white" strokeWidth="3" />,
            // Right arm
            <line key="rightarm" x1="140" y1="95" x2="160" y2="110" stroke="white" strokeWidth="3" />,
            // Left leg
            <line key="leftleg" x1="140" y1="130" x2="125" y2="155" stroke="white" strokeWidth="3" />,
            // Right leg
            <line key="rightleg" x1="140" y1="130" x2="155" y2="155" stroke="white" strokeWidth="3" />
        ];

        return (
            <svg width="200" height="200" className="mx-auto">
                {/* Gallows */}
                <line x1="20" y1="180" x2="180" y2="180" stroke="#475569" strokeWidth="4" />
                <line x1="50" y1="180" x2="50" y2="20" stroke="#475569" strokeWidth="4" />
                <line x1="50" y1="20" x2="140" y2="20" stroke="#475569" strokeWidth="4" />
                <line x1="140" y1="20" x2="140" y2="40" stroke="#475569" strokeWidth="4" />

                {/* Body parts based on wrong guesses */}
                {parts.slice(0, wrongGuesses)}
            </svg>
        );
    };

    if (!currentDestination) return null;

    return (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Travel Hangman</h2>
                        <p className="text-sm text-slate-400">Guess the destination!</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Score</p>
                        <p className="text-2xl font-bold text-yellow-400">{score}</p>
                    </div>
                    <button
                        onClick={startNewGame}
                        className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        <RotateCcw className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Game Area */}
            <div className="space-y-8">
                {/* Hangman Drawing */}
                <div className="bg-slate-900/50 rounded-2xl p-6">
                    {renderHangman()}
                    <div className="text-center mt-4">
                        <p className="text-slate-400 text-sm">
                            Wrong Guesses: <span className="text-red-400 font-bold">{wrongGuesses}/{MAX_WRONG_GUESSES}</span>
                        </p>
                    </div>
                </div>

                {/* Country Flag & Hint */}
                <div className="text-center space-y-3">
                    <div className="text-6xl">{currentDestination.country}</div>
                    {showHint && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full"
                        >
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-300 text-sm font-medium">{currentDestination.hint}</span>
                        </motion.div>
                    )}

                    <div className="flex justify-center gap-3">
                        {!showHint && (
                            <button
                                onClick={() => setShowHint(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors text-white text-sm font-medium"
                            >
                                <Lightbulb className="w-4 h-4 text-amber-400" />
                                Show Clue
                            </button>
                        )}

                        <button
                            onClick={handleRevealLetter}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors text-white text-sm font-medium"
                        >
                            {!isPremium && hintsUsed >= 1 && <Crown className="w-4 h-4 text-yellow-400" />}
                            <Sparkles className="w-4 h-4" />
                            {isPremium ? 'Reveal Letter' : hintsUsed < 1 ? 'Reveal Letter (1 Free)' : 'Reveal Letter (Premium)'}
                        </button>
                    </div>
                </div>

                {/* Word Display */}
                <div className="flex justify-center flex-wrap gap-1">
                    {renderWord()}
                </div>

                {/* Keyboard */}
                {renderKeyboard()}

                {/* Game Over Modal */}
                <AnimatePresence>
                    {gameStatus !== 'playing' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        >
                            <div className="bg-slate-900 rounded-3xl p-8 max-w-md text-center border-2 border-slate-700">
                                {gameStatus === 'won' ? (
                                    <>
                                        <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                                        <h3 className="text-3xl font-bold text-white mb-2">You Won!</h3>
                                        <p className="text-6xl mb-4">{currentDestination.country}</p>
                                        <p className="text-2xl font-bold text-cyan-400 mb-2">{currentDestination.name}</p>
                                        <p className="text-slate-400 mb-6">{currentDestination.hint}</p>
                                        <div className="bg-slate-800 rounded-xl p-4 mb-6">
                                            <p className="text-sm text-slate-400 mb-1">Points Earned</p>
                                            <p className="text-3xl font-bold text-yellow-400">
                                                +{100 + (MAX_WRONG_GUESSES - wrongGuesses) * 10 - hintsUsed * 5}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MapPin className="w-10 h-10 text-red-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-2">Game Over</h3>
                                        <p className="text-slate-400 mb-4">The destination was:</p>
                                        <p className="text-6xl mb-4">{currentDestination.country}</p>
                                        <p className="text-2xl font-bold text-cyan-400 mb-2">{currentDestination.name}</p>
                                        <p className="text-slate-400 mb-6">{currentDestination.hint}</p>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        startNewGame();
                                        setHintsUsed(0);
                                    }}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all"
                                >
                                    Play Again
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TravelHangman;
