import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import TravelHangman from '../../components/games/TravelHangman';

const HangmanPage = () => {
    return (
        <>
            <Helmet>
                <title>Travel Hangman - PackYourBags Arcade</title>
                <meta name="description" content="Guess the destination before time runs out!" />
            </Helmet>

            <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            to="/arcade"
                            className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Plane className="w-8 h-8 text-orange-400" />
                                Travel Hangman
                            </h1>
                            <p className="text-slate-400">Guess the destination!</p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <TravelHangman />
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default HangmanPage;
