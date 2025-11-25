import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Grid3X3, Users, Globe, Plane, Sparkles, ArrowRight, Gamepad2, Play } from 'lucide-react';

const GAMES = [
    {
        title: 'Marble Race',
        icon: Trophy,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        desc: 'Physics Chaos'
    },
    {
        title: 'To-Do Roulette',
        icon: Sparkles,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        desc: 'AI Itineraries'
    },
    {
        title: 'Travel Bingo',
        icon: Grid3X3,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        desc: 'Spot & Win'
    },
    {
        title: 'GeoMaster',
        icon: Globe,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        desc: 'World Quiz'
    },
    {
        title: 'Hangman',
        icon: Plane,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        desc: 'Guess the City'
    },
    {
        title: 'Who Pays?',
        icon: Users,
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        desc: 'Settle Bills'
    }
];

const ArcadeTeaser = () => {
    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden border-y border-slate-800">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Content */}
                    <div className="lg:w-2/5 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-sm font-bold text-blue-300 uppercase tracking-wider">New Arcade Zone</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight"
                        >
                            Play. Win. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                Travel Better.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 mb-10 leading-relaxed"
                        >
                            Challenge friends, generate AI itineraries, and race marbles in our new interactive game zone. Earn rewards for your next trip.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link to="/arcade">
                                <button className="group relative px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <span className="flex items-center gap-3">
                                        <Gamepad2 className="w-6 h-6" />
                                        Play Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Visuals - Game Grid */}
                    <div className="lg:w-3/5 w-full">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {GAMES.map((game, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link to="/arcade" className="block group">
                                        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:bg-slate-800 hover:border-slate-600 transition-all hover:-translate-y-2 hover:shadow-xl h-full flex flex-col items-center text-center relative overflow-hidden">
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${game.bg} to-transparent pointer-events-none`} />

                                            <div className={`w-14 h-14 rounded-2xl ${game.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <game.icon className={`w-7 h-7 ${game.color}`} />
                                            </div>

                                            <h3 className="text-white font-bold mb-1 group-hover:text-blue-300 transition-colors">{game.title}</h3>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{game.desc}</p>

                                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                <span className="text-xs font-bold text-white bg-slate-700 px-3 py-1 rounded-full flex items-center gap-1">
                                                    <Play className="w-3 h-3 fill-current" /> Play
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ArcadeTeaser;
