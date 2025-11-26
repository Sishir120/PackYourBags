import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Trophy,
    Map,
    CreditCard,
    Grid,
    HelpCircle,
    Disc,
    ArrowRight,
    Sparkles,
    Skull
} from 'lucide-react';
import SEO from '../components/SEO';

const GAMES = [
    {
        id: 'marble-race',
        title: 'Marble Race',
        description: 'Watch marbles race on procedural tracks. Bet on the winner!',
        link: '/arcade/marble-race',
        icon: Trophy,
        bg: 'bg-yellow-500/20',
        color: 'text-yellow-500',
        border: 'border-yellow-500/20',
        isNew: true
    },
    {
        id: 'plinko',
        title: 'Dare Plinko',
        description: 'Drop the ball and face the consequences! A game of chance and courage.',
        link: '/arcade/plinko',
        icon: Skull,
        bg: 'bg-pink-500/20',
        color: 'text-pink-500',
        border: 'border-pink-500/20',
        isNew: true
    },
    {
        id: 'geo-master',
        title: 'GeoMaster',
        description: 'Test your geography knowledge with our interactive map quiz.',
        link: '/arcade/geo-master',
        icon: Map,
        bg: 'bg-green-500/20',
        color: 'text-green-500',
        border: 'border-green-500/20',
        isNew: false
    },
    {
        id: 'travel-bingo',
        title: 'Travel Bingo',
        description: 'Spot items on your trip and complete the bingo card.',
        link: '/arcade/bingo',
        icon: Grid,
        bg: 'bg-blue-500/20',
        color: 'text-blue-500',
        border: 'border-blue-500/20',
        isNew: false
    },
    {
        id: 'who-pays',
        title: 'Who Pays?',
        description: 'Spin the wheel to decide who pays for the next meal or drink.',
        link: '/arcade/who-pays',
        icon: CreditCard,
        bg: 'bg-purple-500/20',
        color: 'text-purple-500',
        border: 'border-purple-500/20',
        isNew: false
    },
    {
        id: 'hangman',
        title: 'Travel Hangman',
        description: 'Guess the travel-related word before it\'s too late.',
        link: '/arcade/hangman',
        icon: HelpCircle,
        bg: 'bg-red-500/20',
        color: 'text-red-500',
        border: 'border-red-500/20',
        isNew: false
    },
    {
        id: 'roulette',
        title: 'To-Do Roulette',
        description: 'Can\'t decide where to go? Let fate decide your next trip.',
        link: '/arcade/roulette',
        icon: Disc,
        bg: 'bg-orange-500/20',
        color: 'text-orange-500',
        border: 'border-orange-500/20',
        isNew: false
    }
];

const Arcade = () => {
    return (
        <>
            <SEO
                title="Travel Arcade - Play & Win"
                description="Play travel-themed games like Marble Race, Geography Quiz, and more. Win rewards and challenge friends in the PackYourBags Arcade."
                keywords={["travel games", "geography quiz", "marble race", "play to earn travel rewards", "travel trivia"]}
            />

            <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                        >
                            ARCADE
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-2xl mx-auto"
                        >
                            Play, compete, and win. The ultimate travel gaming destination.
                        </motion.p>
                    </div>

                    {/* Games Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {GAMES.map((game, index) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={game.link}
                                    className={`group block h-full bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border ${game.border} hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden`}
                                >
                                    {/* Hover Gradient */}
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-white to-transparent`} />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-4 rounded-2xl ${game.bg} ${game.color}`}>
                                                <game.icon className="w-8 h-8" />
                                            </div>
                                            {game.isNew && (
                                                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                            {game.title}
                                        </h3>
                                        <p className="text-slate-400 mb-8 leading-relaxed">
                                            {game.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                                            Play Now <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Arcade;
