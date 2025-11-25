import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import { OrbitControls, Sky, Stars, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import CountrySelector from './CountrySelector';
import ResultsModal from './ResultsModal';
import Track from './Track';
import Ball from './Ball';

// Game States: 'selection' | 'racing' | 'finished'

const FlagDash = () => {
    const [gameState, setGameState] = useState('selection');
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [winner, setWinner] = useState(null);
    const [raceData, setRaceData] = useState([]); // Track positions of all balls

    const handleStartRace = (countries) => {
        setSelectedCountries(countries);
        setGameState('racing');
    };

    const handleRaceFinish = (winnerCountry) => {
        setWinner(winnerCountry);
        setTimeout(() => {
            setGameState('finished');
        }, 2000); // Delay to show celebration
    };

    const resetGame = () => {
        setGameState('selection');
        setWinner(null);
        setSelectedCountries([]);
    };

    return (
        <div className="w-full h-[600px] relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <AnimatePresence>
                    {gameState === 'selection' && (
                        <CountrySelector onStart={handleStartRace} />
                    )}
                    {gameState === 'finished' && (
                        <ResultsModal winner={winner} onReset={resetGame} />
                    )}
                </AnimatePresence>
            </div>

            {/* 3D Scene */}
            <div className="w-full h-full">
                <Canvas shadows camera={{ position: [0, 10, 20], fov: 50 }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                        <Environment preset="sunset" />
                        <Sky sunPosition={[100, 10, 100]} />
                        <Stars />

                        <Physics gravity={[0, -9.8, 0]}>
                            {/* The Track */}
                            <Track />

                            {/* The Racers */}
                            {gameState === 'racing' && selectedCountries.map((country, index) => (
                                <Ball
                                    key={country.id}
                                    country={country}
                                    position={[-5 + (index * 2), 5, 0]}
                                    onFinish={handleRaceFinish}
                                />
                            ))}
                        </Physics>

                        <OrbitControls enabled={gameState !== 'selection'} />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
};

export default FlagDash;
