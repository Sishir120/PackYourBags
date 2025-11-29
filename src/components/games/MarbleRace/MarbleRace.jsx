import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, RotateCcw, Trophy, Play, Lock, Shuffle, Check, Camera, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import Matter from 'matter-js';
import { SoundManager } from '../../../utils/SoundManager';
import { useSubscription } from '../../../context/SubscriptionContext';
import { GameManager } from '../../../game-engine/GameManager';

// --- Assets & Constants ---
const FLAGS_API = "https://flagcdn.com/w80/";
const COUNTRIES = [
    { id: 'us', name: 'USA', code: 'us', color: '#3C3B6E' },
    { id: 'cn', name: 'China', code: 'cn', color: '#DE2910' },
    { id: 'jp', name: 'Japan', code: 'jp', color: '#BC002D' },
    { id: 'de', name: 'Germany', code: 'de', color: '#000000' },
    { id: 'gb', name: 'UK', code: 'gb', color: '#012169' },
    { id: 'fr', name: 'France', code: 'fr', color: '#0055A4' },
    { id: 'in', name: 'India', code: 'in', color: '#FF9933' },
    { id: 'it', name: 'Italy', code: 'it', color: '#009246' },
    { id: 'br', name: 'Brazil', code: 'br', color: '#009C3B' },
    { id: 'ca', name: 'Canada', code: 'ca', color: '#FF0000' },
    { id: 'kr', name: 'S. Korea', code: 'kr', color: '#003478' },
    { id: 'ru', name: 'Russia', code: 'ru', color: '#0039A6' },
    { id: 'es', name: 'Spain', code: 'es', color: '#AA151B' },
    { id: 'au', name: 'Australia', code: 'au', color: '#00008B' },
    { id: 'mx', name: 'Mexico', code: 'mx', color: '#006847' },
    { id: 'id', name: 'Indonesia', code: 'id', color: '#FF0000' },
    { id: 'nl', name: 'Netherlands', code: 'nl', color: '#21468B' },
    { id: 'sa', name: 'Saudi Arabia', code: 'sa', color: '#006C35' },
    { id: 'tr', name: 'Turkey', code: 'tr', color: '#E30A17' },
    { id: 'ch', name: 'Switzerland', code: 'ch', color: '#FF0000' },
    { id: 'ar', name: 'Argentina', code: 'ar', color: '#75AADB' },
    { id: 'se', name: 'Sweden', code: 'se', color: '#006AA7' },
    { id: 'no', name: 'Norway', code: 'no', color: '#BA0C2F' },
    { id: 'fi', name: 'Finland', code: 'fi', color: '#003580' },
];

// --- Components ---

const CountrySelector = ({ isPremium, onStart, onUpgrade }) => {
    const [selected, setSelected] = useState([]);
    const maxSelection = isPremium ? COUNTRIES.length : 2;

    const playClick = () => SoundManager.playClick();

    const toggleCountry = (country) => {
        playClick();
        if (selected.find(c => c.id === country.id)) {
            setSelected(selected.filter(c => c.id !== country.id));
        } else if (selected.length < maxSelection) {
            setSelected([...selected, country]);
        }
    };

    const selectRandom = () => {
        playClick();
        const count = isPremium ? 8 : 2; // Limit to 8 for better performance/visibility
        const shuffled = [...COUNTRIES].sort(() => 0.5 - Math.random());
        setSelected(shuffled.slice(0, count));
    };

    return (
        <div className="absolute inset-0 z-30 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Race Setup</h2>
                        <p className="text-slate-400 text-sm">
                            {selected.length} / {isPremium ? 'ALL' : '2'} Racers
                            {!isPremium && <span className="text-amber-400 font-bold ml-2">(Premium unlocks more)</span>}
                        </p>
                    </div>
                    <button
                        onClick={selectRandom}
                        className="p-2.5 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors text-white border border-slate-600"
                        title="Random Selection"
                    >
                        <Shuffle className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 bg-slate-900/50">
                    {COUNTRIES.map(country => {
                        const isSelected = selected.find(c => c.id === country.id);
                        const isDisabled = !isSelected && !isPremium && selected.length >= 2;

                        return (
                            <button
                                key={country.id}
                                onClick={() => toggleCountry(country)}
                                disabled={isDisabled}
                                className={`relative p-3 rounded-xl border flex flex-col items-center gap-2 transition-all group ${isSelected
                                    ? 'border-green-500 bg-green-500/10'
                                    : isDisabled
                                        ? 'border-slate-800 bg-slate-800/50 opacity-40 cursor-not-allowed'
                                        : 'border-slate-700 bg-slate-800 hover:border-blue-500 hover:bg-slate-700'
                                    }`}
                            >
                                <div className="relative">
                                    <img
                                        src={`${FLAGS_API}${country.code}.png`}
                                        alt={country.name}
                                        className={`w-12 h-8 object-cover rounded shadow-lg transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                                    />
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <span className={`text-xs font-bold ${isSelected ? 'text-green-400' : 'text-slate-400'}`}>
                                    {country.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-slate-700 bg-slate-800 flex gap-4">
                    {!isPremium && (
                        <button
                            onClick={onUpgrade}
                            className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
                        >
                            <Lock className="w-5 h-5" /> Unlock Full Roster
                        </button>
                    )}
                    <button
                        onClick={() => { playClick(); onStart(selected); }}
                        disabled={selected.length < 2}
                        className={`flex-1 py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${selected.length < 2
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                            }`}
                    >
                        <Play className="w-5 h-5 fill-current" /> Start Race
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const MarbleRace = () => {
    const { isPremium, setShowUpgradeModal } = useSubscription();
    const [gameState, setGameState] = useState('menu'); // menu, countdown, racing, finished
    const [countdown, setCountdown] = useState(3);
    const [leaderboard, setLeaderboard] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [debugMode, setDebugMode] = useState(false);
    const [followLeader, setFollowLeader] = useState(true);

    const canvasRef = useRef(null);
    const gameManagerRef = useRef(null);
    const requestRef = useRef(null);
    const flagsCache = useRef({});
    const trailsRef = useRef({}); // Store trail positions for each marble

    // Preload assets
    useEffect(() => {
        COUNTRIES.forEach(c => {
            const img = new Image();
            img.src = `${FLAGS_API}${c.code}.png`;
            flagsCache.current[c.id] = img;
        });

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (gameManagerRef.current) gameManagerRef.current.destroy();
        };
    }, []);

    const startGame = (countries) => {
        if (gameManagerRef.current) {
            gameManagerRef.current.destroy();
        }

        gameManagerRef.current = new GameManager({
            seed: Date.now(),
            onGameStateChange: (state, winnerData) => {
                if (state === 'COUNTDOWN') {
                    setGameState('countdown');
                    setCountdown(3);
                    let count = 3;
                    SoundManager.playCountdown();
                    const timer = setInterval(() => {
                        count--;
                        setCountdown(count);
                        if (count > 0) SoundManager.playCountdown();
                        else {
                            clearInterval(timer);
                            SoundManager.playGo();
                        }
                    }, 1000);
                } else if (state === 'RACING') {
                    setGameState('racing');
                } else if (state === 'FINISHED') {
                    setGameState('finished');
                    setWinner(winnerData.country);
                    if (!isMuted) SoundManager.playWin();
                    confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
                }
            },
            onLeaderboardUpdate: (marbles) => {
                const sorted = [...marbles].sort((a, b) => a.rank - b.rank);
                setLeaderboard(sorted.map(m => ({
                    rank: m.rank,
                    country: m.country,
                    finished: m.isFinished,
                    id: m.id,
                    countryId: m.countryId
                })));
            }
        });

        gameManagerRef.current.startRace(countries);
        startRenderLoop();
    };

    const startRenderLoop = () => {
        let lastTime = performance.now();

        const loop = (time) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            if (gameManagerRef.current) {
                // Update Camera Mode
                if (gameManagerRef.current.camera) {
                    gameManagerRef.current.camera.mode = followLeader ? 'leader' : 'pack';
                }

                gameManagerRef.current.update(dt);

                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    renderGame(ctx, gameManagerRef.current);
                }
            }

            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);
    };

    const renderGame = (ctx, gm) => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Draw Background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0f172a'); // Slate 900
        gradient.addColorStop(1, '#1e293b'); // Slate 800
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Grid Pattern Overlay
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        const offset = (Date.now() / 50) % gridSize; // Animated grid

        ctx.beginPath();
        for (let x = 0; x <= width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = offset - gridSize; y <= height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();
        ctx.restore();

        ctx.save();

        // Apply Camera Transform
        const zoom = gm.camera.zoom;
        const translateX = (width / 2) - (200 * zoom);
        const translateY = -gm.camera.y * zoom + (height / 3); // Offset to keep action in middle-top

        ctx.translate(translateX, translateY);
        ctx.scale(zoom, zoom);

        // Render All Matter.js Bodies (Track, Walls, Obstacles)
        const bodies = Matter.Composite.allBodies(gm.world);

        // 1. Draw Track/Walls first
        bodies.forEach(body => {
            if (body.label === 'marble') return;

            ctx.beginPath();
            if (body.circleRadius) {
                ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
            } else {
                const vertices = body.vertices;
                ctx.moveTo(vertices[0].x, vertices[0].y);
                for (let i = 1; i < vertices.length; i++) {
                    ctx.lineTo(vertices[i].x, vertices[i].y);
                }
                ctx.lineTo(vertices[0].x, vertices[0].y);
            }

            if (body.label === 'finishLine') {
                // Finish Line - Checkerboard pattern
                ctx.save();
                ctx.clip();
                const checkSize = 20;
                ctx.fillStyle = '#10b981';
                ctx.fillRect(body.bounds.min.x, body.bounds.min.y, body.bounds.max.x - body.bounds.min.x, body.bounds.max.y - body.bounds.min.y);

                ctx.fillStyle = '#ffffff';
                for (let i = 0; i < (body.bounds.max.x - body.bounds.min.x) / checkSize; i++) {
                    if (i % 2 === 0) ctx.fillRect(body.bounds.min.x + i * checkSize, body.bounds.min.y, checkSize, 20);
                }
                ctx.restore();
            } else if (body.label === 'boundary') {
                // Walls - Neon Glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#3b82f6'; // Blue glow
                ctx.fillStyle = '#1e293b';
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                // Obstacles
                ctx.fillStyle = body.render.fillStyle || '#475569';
                ctx.fill();

                // 3D effect for obstacles
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });

        // 2. Draw Trails
        gm.marbles.forEach(m => {
            if (!trailsRef.current[m.id]) trailsRef.current[m.id] = [];
            const trail = trailsRef.current[m.id];

            // Add current position
            trail.push({ x: m.position.x, y: m.position.y });
            if (trail.length > 20) trail.shift(); // Longer trails

            if (trail.length > 1) {
                // Draw glowy trail
                ctx.save();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Outer glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = m.color;

                // Draw segments with fading opacity
                for (let i = 0; i < trail.length - 1; i++) {
                    const opacity = (i / trail.length);
                    ctx.beginPath();
                    ctx.moveTo(trail[i].x, trail[i].y);
                    ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
                    ctx.strokeStyle = `rgba(${hexToRgb(m.color)}, ${opacity})`;
                    ctx.lineWidth = m.radius * 0.8 * opacity; // Tapering width
                    ctx.stroke();
                }
                ctx.restore();
            }
        });

        // 3. Draw Marbles
        gm.marbles.forEach(m => {
            const { x, y } = m.position;
            const r = m.radius;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(m.body.angle);

            // Marble Shadow/Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = m.color;

            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.clip();

            // Flag Texture
            const img = flagsCache.current[m.countryId];
            if (img && img.complete) {
                ctx.drawImage(img, -r * 1.5, -r * 1.5, r * 3, r * 3);
            } else {
                ctx.fillStyle = m.color;
                ctx.fill();
            }

            // Glass/Sphere Effect overlay
            const grad = ctx.createRadialGradient(-r / 3, -r / 3, r / 10, 0, 0, r);
            grad.addColorStop(0, 'rgba(255,255,255,0.9)'); // Highlight
            grad.addColorStop(0.4, 'rgba(255,255,255,0.1)');
            grad.addColorStop(1, 'rgba(0,0,0,0.4)'); // Shadow edge
            ctx.fillStyle = grad;
            ctx.fill();

            // Rim light
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();

            // Name Label (if leader or close)
            if (m.rank <= 3) {
                ctx.fillStyle = 'white';
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 4;
                ctx.fillText(m.country.code.toUpperCase(), x, y - r - 8);
                ctx.shadowBlur = 0;
            }
        });

        ctx.restore();
    };

    // Helper for hex to rgb
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '255, 255, 255';
    };

    const resetGame = () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        if (gameManagerRef.current) {
            gameManagerRef.current.destroy();
            gameManagerRef.current = null;
        }
        setGameState('menu');
        setWinner(null);
        setLeaderboard([]);
        trailsRef.current = {};
    };

    return (
        <div className="relative w-full h-[800px] bg-slate-900 overflow-hidden rounded-3xl border-[6px] border-slate-800 shadow-2xl select-none ring-4 ring-blue-500/30">
            {/* Premium Animated Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse" />
            </div>

            <canvas
                ref={canvasRef}
                width={400}
                height={800}
                className="w-full h-full object-contain relative z-10"
            />

            {/* UI Layer */}
            <AnimatePresence>
                {gameState === 'menu' && (
                    <CountrySelector
                        isPremium={isPremium}
                        onStart={startGame}
                        onUpgrade={() => setShowUpgradeModal(true)}
                    />
                )}

                {gameState === 'countdown' && (
                    <motion.div
                        key={countdown}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center z-40 bg-black/40 backdrop-blur-sm"
                    >
                        <span className="text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] stroke-black">
                            {countdown}
                        </span>
                    </motion.div>
                )}

                {(gameState === 'racing' || gameState === 'finished') && (
                    <>
                        {/* Live Leaderboard */}
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="absolute top-4 right-4 w-52 z-20"
                        >
                            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-xl overflow-hidden">
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 px-1">Live Standings</h3>
                                <div className="space-y-1 max-h-[400px] overflow-hidden">
                                    {leaderboard.slice(0, 8).map((entry) => (
                                        <div
                                            key={entry.countryId || entry.rank}
                                            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors relative group ${entry.rank === 1 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <span className={`text-xs font-bold w-4 text-right ${entry.rank === 1 ? 'text-yellow-400' :
                                                entry.rank === 2 ? 'text-slate-300' :
                                                    entry.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                                                }`}>{entry.rank}</span>

                                            <img src={`${FLAGS_API}${entry.country.code}.png`} className="w-6 h-4 object-cover rounded shadow-sm" alt={entry.country.code} />

                                            <span className={`text-xs font-bold truncate flex-1 text-left ${entry.rank === 1 ? 'text-yellow-100' : 'text-slate-200'
                                                }`}>
                                                {entry.country.name}
                                            </span>

                                            {entry.finished && <Check className="w-3 h-3 text-green-400" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Controls */}
                        <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                            <button
                                onClick={resetGame}
                                className="w-10 h-10 bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-slate-800 transition-colors border border-white/20 shadow-lg"
                                title="Menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="w-10 h-10 bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-slate-800 transition-colors border border-white/20 shadow-lg"
                                title="Toggle Sound"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setFollowLeader(!followLeader)}
                                className={`w-10 h-10 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors border border-white/20 shadow-lg ${followLeader ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-900/80 hover:bg-slate-800'}`}
                                title="Follow Leader"
                            >
                                {followLeader ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => {
                                    if (gameManagerRef.current) {
                                        gameManagerRef.current.debug = !gameManagerRef.current.debug;
                                        setDebugMode(!debugMode);
                                    }
                                }}
                                className={`w-10 h-10 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors border border-white/20 shadow-lg ${debugMode ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-900/80 hover:bg-slate-800'}`}
                                title="Debug Mode"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                )}

                {gameState === 'finished' && winner && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-md"
                    >
                        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl border border-slate-700 relative overflow-hidden">
                            {/* Shine effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                                <Trophy className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">WINNER!</h2>
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-6">
                                {winner.name}
                            </div>

                            <div className="relative inline-block mb-8">
                                <img
                                    src={`${FLAGS_API}${winner.code}.png`}
                                    className="w-40 h-24 object-cover rounded-xl shadow-2xl border-4 border-slate-700"
                                    alt={winner.name}
                                />
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-slate-800 text-slate-900 font-bold">
                                    1
                                </div>
                            </div>

                            <button
                                onClick={resetGame}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group"
                            >
                                <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                                Race Again
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MarbleRace;
