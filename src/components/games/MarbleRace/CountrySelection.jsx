import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Shuffle } from 'lucide-react';

// Top 50 countries with flags
const COUNTRIES = [
    { id: 1, name: 'United States', flag: '🇺🇸', color: '#B22234' },
    { id: 2, name: 'China', flag: '🇨🇳', color: '#DE2910' },
    { id: 3, name: 'Japan', flag: '🇯🇵', color: '#BC002D' },
    { id: 4, name: 'Germany', flag: '🇩🇪', color: '#000000' },
    { id: 5, name: 'United Kingdom', flag: '🇬🇧', color: '#012169' },
    { id: 6, name: 'France', flag: '🇫🇷', color: '#0055A4' },
    { id: 7, name: 'India', flag: '🇮🇳', color: '#FF9933' },
    { id: 8, name: 'Italy', flag: '🇮🇹', color: '#009246' },
    { id: 9, name: 'Brazil', flag: '🇧🇷', color: '#009C3B' },
    { id: 10, name: 'Canada', flag: '🇨🇦', color: '#FF0000' },
    { id: 11, name: 'South Korea', flag: '🇰🇷', color: '#003478' },
    { id: 12, name: 'Russia', flag: '🇷🇺', color: '#0039A6' },
    { id: 13, name: 'Spain', flag: '🇪🇸', color: '#AA151B' },
    { id: 14, name: 'Australia', flag: '🇦🇺', color: '#00008B' },
    { id: 15, name: 'Mexico', flag: '🇲🇽', color: '#006847' },
    { id: 16, name: 'Indonesia', flag: '🇮🇩', color: '#FF0000' },
    { id: 17, name: 'Netherlands', flag: '🇳🇱', color: '#21468B' },
    { id: 18, name: 'Saudi Arabia', flag: '🇸🇦', color: '#006C35' },
    { id: 19, name: 'Turkey', flag: '🇹🇷', color: '#E30A17' },
    { id: 20, name: 'Switzerland', flag: '🇨🇭', color: '#FF0000' },
    // Add more countries as needed
];

const CountrySelection = ({ isPremium, onStart, onUpgrade }) => {
    const [selected, setSelected] = useState([]);
    const maxSelection = isPremium ? 10 : 2;

    const toggleCountry = (country) => {
        if (selected.find(c => c.id === country.id)) {
            setSelected(selected.filter(c => c.id !== country.id));
        } else if (selected.length < maxSelection) {
            setSelected([...selected, country]);
        }
    };

    const randomSelect = () => {
        const shuffled = [...COUNTRIES].sort(() => 0.5 - Math.random());
        setSelected(shuffled.slice(0, maxSelection));
    };

    const availableCountries = isPremium ? COUNTRIES : COUNTRIES.slice(0, 20);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-purple-600"
        >
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl">
                <h2 className="text-4xl font-bold text-center mb-2 text-slate-800">
                    Select Countries
                </h2>
                <p className="text-center text-slate-600 mb-6">
                    Choose {maxSelection} countries to race
                    {!isPremium && (
                        <button
                            onClick={onUpgrade}
                            className="ml-2 text-amber-600 font-bold hover:text-amber-700 inline-flex items-center gap-1"
                        >
                            <Lock className="w-4 h-4" /> Unlock All
                        </button>
                    )}
                </p>

                {/* Selected Countries */}
                <div className="mb-6 p-4 bg-slate-100 rounded-2xl min-h-[80px]">
                    <div className="flex flex-wrap gap-2">
                        {selected.map(country => (
                            <div
                                key={country.id}
                                className="px-4 py-2 bg-white rounded-full shadow-md flex items-center gap-2 cursor-pointer hover:bg-slate-50"
                                onClick={() => toggleCountry(country)}
                            >
                                <span className="text-2xl">{country.flag}</span>
                                <span className="font-medium text-slate-700">{country.name}</span>
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                        ))}
                        {selected.length === 0 && (
                            <p className="text-slate-400 text-center w-full py-4">
                                No countries selected yet
                            </p>
                        )}
                    </div>
                </div>

                {/* Country Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto mb-6 p-2">
                    {availableCountries.map(country => {
                        const isSelected = selected.find(c => c.id === country.id);
                        const isDisabled = !isSelected && selected.length >= maxSelection;

                        return (
                            <button
                                key={country.id}
                                onClick={() => !isDisabled && toggleCountry(country)}
                                disabled={isDisabled}
                                className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                        ? 'border-green-500 bg-green-50 scale-105'
                                        : isDisabled
                                            ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                                            : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-md'
                                    }`}
                            >
                                <div className="text-4xl mb-2">{country.flag}</div>
                                <div className="text-sm font-medium text-slate-700 truncate">
                                    {country.name}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={randomSelect}
                        className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                    >
                        <Shuffle className="w-5 h-5" /> Random
                    </button>
                    <button
                        onClick={() => selected.length >= 2 && onStart(selected)}
                        disabled={selected.length < 2}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${selected.length >= 2
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        Start Race ({selected.length}/{maxSelection})
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CountrySelection;
