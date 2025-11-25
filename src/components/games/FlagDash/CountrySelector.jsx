import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, Play, Shuffle } from 'lucide-react';

const MOCK_COUNTRIES = [
    { id: 'jp', name: 'Japan', color: '#ef4444', flag: '🇯🇵' },
    { id: 'fr', name: 'France', color: '#3b82f6', flag: '🇫🇷' },
    { id: 'br', name: 'Brazil', color: '#22c55e', flag: '🇧🇷' },
    { id: 'us', name: 'USA', color: '#ef4444', flag: '🇺🇸' },
    { id: 'it', name: 'Italy', color: '#22c55e', flag: '🇮🇹' },
    { id: 'au', name: 'Australia', color: '#3b82f6', flag: '🇦🇺' },
];

const CountrySelector = ({ onStart }) => {
    const [selected, setSelected] = useState([]);

    const toggleCountry = (country) => {
        if (selected.find(c => c.id === country.id)) {
            setSelected(selected.filter(c => c.id !== country.id));
        } else {
            if (selected.length < 5) {
                setSelected([...selected, country]);
            }
        }
    };

    const handleStart = () => {
        if (selected.length >= 2) {
            onStart(selected);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-md pointer-events-auto p-4"
        >
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Flag Dash 🏁</h2>
                    <p className="text-slate-500">Select 2-5 countries to race!</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {MOCK_COUNTRIES.map((country) => {
                        const isSelected = selected.find(c => c.id === country.id);
                        return (
                            <button
                                key={country.id}
                                onClick={() => toggleCountry(country)}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${isSelected
                                        ? 'border-teal-500 bg-teal-50 text-teal-700 scale-105 shadow-md'
                                        : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="text-4xl">{country.flag}</span>
                                <span className="font-bold">{country.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            const shuffled = [...MOCK_COUNTRIES].sort(() => 0.5 - Math.random()).slice(0, 3);
                            setSelected(shuffled);
                        }}
                        className="px-6 py-3 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Shuffle className="w-5 h-5" />
                        Random
                    </button>

                    <button
                        onClick={handleStart}
                        disabled={selected.length < 2}
                        className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all ${selected.length >= 2
                                ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:scale-105'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <Play className="w-5 h-5 fill-current" />
                        Start Race
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CountrySelector;
