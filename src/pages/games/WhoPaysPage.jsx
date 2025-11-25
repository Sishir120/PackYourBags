import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import WhoPays from '../../components/games/WhoPays/WhoPays';

const WhoPaysPage = () => {
    return (
        <>
            <Helmet>
                <title>Who Pays? - PackYourBags Arcade</title>
                <meta name="description" content="Settle the bill with a quick game of chance and skill." />
            </Helmet>

            <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[100px]" />
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
                                <Users className="w-8 h-8 text-purple-400" />
                                Who Pays?
                            </h1>
                            <p className="text-slate-400">Don't get stuck with the bill!</p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700 shadow-2xl"
                    >
                        <WhoPays />
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default WhoPaysPage;
