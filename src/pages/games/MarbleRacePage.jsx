import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarbleRace from '../../components/games/MarbleRace/MarbleRace';
import GameLimitGuard from '../../components/GameLimitGuard';

const MarbleRacePage = () => {
    return (
        <GameLimitGuard gameId="marble-race" gameName="Marble Race">
            <>
                <Helmet>
                    <title>Country Marble Race - PackYourBags Arcade</title>
                    <meta name="description" content="Watch your favorite countries race to the finish line in this physics-based marble run!" />
                </Helmet>

                <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <Link
                                to="/arcade"
                                className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                    <Trophy className="w-8 h-8 text-yellow-400" />
                                    Country Marble Race
                                </h1>
                                <p className="text-slate-400">Physics-based racing mayhem!</p>
                            </div>
                        </div>

                        {/* Game Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-1 border border-slate-800 shadow-2xl overflow-hidden"
                        >
                            <div className="bg-slate-950 rounded-[22px] overflow-hidden">
                                <MarbleRace />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </>
        </GameLimitGuard>
    );
};

export default MarbleRacePage;
