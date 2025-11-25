import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, Skull, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SoundManager } from '../../../utils/SoundManager';

const DARES = [
    "Do 10 pushups immediately.",
    "Text your crush 'I like pineapples'.",
    "Let the winner post a status on your social media.",
    "Speak in an accent for the next 10 minutes.",
    "Eat a spoonful of hot sauce (or something spicy).",
    "Do a silly dance for 30 seconds.",
    "Let the winner choose your profile picture for a day.",
    "Sing a song chosen by the winner.",
    "Walk backwards for the next 5 minutes.",
    "Hold a plank for 60 seconds."
];

const BALL_COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const Plinko = () => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const [gameState, setGameState] = useState('menu'); // menu, playing, result
    const [dare, setDare] = useState(null);
    const [winner, setWinner] = useState(null); // 'safe' or 'dare'
    const [ballCount, setBallCount] = useState(0);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Runner = Matter.Runner,
            Composite = Matter.Composite;

        const engine = Engine.create();
        engineRef.current = engine;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 800, // Increased height for more rows
                wireframes: false,
                background: '#0f172a', // Dark slate background
                pixelRatio: window.devicePixelRatio
            }
        });
        renderRef.current = render;

        // Boundaries
        const ground = Bodies.rectangle(400, 810, 810, 60, {
            isStatic: true,
            render: { fillStyle: '#1e293b' }
        });
        const leftWall = Bodies.rectangle(0, 400, 40, 800, {
            isStatic: true,
            render: { fillStyle: '#1e293b' }
        });
        const rightWall = Bodies.rectangle(800, 400, 40, 800, {
            isStatic: true,
            render: { fillStyle: '#1e293b' }
        });

        // Pegs
        const pegs = [];
        const rows = 16; // Increased from 12 to 16
        const startY = 100;
        const spacing = 45; // Slightly tighter spacing

        for (let row = 0; row < rows; row++) {
            const cols = row % 2 === 0 ? 15 : 14; // More columns
            const xOffset = row % 2 === 0 ? 0 : spacing / 2;
            const startX = (800 - ((cols - 1) * spacing)) / 2;

            for (let col = 0; col < cols; col++) {
                const x = startX + col * spacing;
                const y = startY + row * 40;

                pegs.push(Bodies.circle(x, y, 4, {
                    isStatic: true,
                    render: {
                        fillStyle: '#cbd5e1',
                        shadowBlur: 5,
                        shadowColor: '#fff'
                    },
                    restitution: 0.8,
                    friction: 0
                }));
            }
        }

        // Obstacles (Blockers)
        const obstacles = [];
        // Add a few random rectangular blockers to disrupt paths
        const blockerConfigs = [
            { x: 200, y: 300, w: 60, h: 10, angle: Math.PI / 4 },
            { x: 600, y: 300, w: 60, h: 10, angle: -Math.PI / 4 },
            { x: 400, y: 500, w: 80, h: 10, angle: 0 },
            { x: 150, y: 600, w: 40, h: 10, angle: Math.PI / 6 },
            { x: 650, y: 600, w: 40, h: 10, angle: -Math.PI / 6 }
        ];

        blockerConfigs.forEach(config => {
            obstacles.push(Bodies.rectangle(config.x, config.y, config.w, config.h, {
                isStatic: true,
                angle: config.angle,
                render: {
                    fillStyle: '#ef4444', // Red blockers
                    strokeStyle: '#f87171',
                    lineWidth: 2
                },
                restitution: 1.0 // Bouncy
            }));
        });


        // Dividers at the bottom
        const dividers = [];
        const slotCount = 9; // 9 slots
        const slotWidth = 700 / slotCount;
        const startX = 50;

        for (let i = 0; i <= slotCount; i++) {
            const x = startX + i * slotWidth;
            dividers.push(Bodies.rectangle(x, 750, 4, 100, {
                isStatic: true,
                render: { fillStyle: '#475569' }
            }));
        }

        World.add(engine.world, [ground, leftWall, rightWall, ...pegs, ...dividers, ...obstacles]);

        // Add collision sound events
        Matter.Events.on(engine, 'collisionStart', (event) => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;

                // Check if ball is colliding with peg or obstacle
                if ((bodyA.label === 'ball' && bodyB.label === 'peg') ||
                    (bodyB.label === 'ball' && bodyA.label === 'peg') ||
                    (bodyA.label === 'ball' && bodyB.label === 'obstacle') ||
                    (bodyB.label === 'ball' && bodyA.label === 'obstacle')) {

                    // Play bounce sound with slight randomization
                    if (Math.random() > 0.3) { // Only play 70% of collisions to avoid sound spam
                        SoundManager.playBounce();
                    }
                }
            });
        });

        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        // Collision detection for results
        const checkWin = setInterval(() => {
            const balls = Composite.allBodies(engine.world).filter(b => b.label === 'ball');
            balls.forEach(ball => {
                if (ball.position.y > 750 && !ball.isProcessed) {
                    ball.isProcessed = true; // Prevent double counting

                    // Determine slot based on X position
                    // Center is roughly 400. 
                    // Dare zone: 300 - 500 (approx middle 3 slots)
                    const x = ball.position.x;
                    let result = 'safe';

                    if (x > 320 && x < 480) {
                        result = 'dare';
                    }

                    // Delay result slightly to let ball settle visually
                    setTimeout(() => {
                        if (result === 'dare') {
                            SoundManager.playLose();
                            const randomDare = DARES[Math.floor(Math.random() * DARES.length)];
                            setDare(randomDare);
                            setWinner('dare');
                            setGameState('result');
                        } else {
                            SoundManager.playSuccess();
                            // Safe
                        }
                    }, 500);
                }
            });
        }, 100);

        return () => {
            clearInterval(checkWin);
            Render.stop(render);
            Runner.stop(runner);
            World.clear(engine.world);
            Engine.clear(engine);
            render.canvas.remove();
            render.canvas = null;
            render.context = null;
            render.textures = {};
        };
    }, [gameState]);

    const dropBall = (e) => {
        if (!engineRef.current || gameState !== 'playing') return;

        // Get click position relative to canvas
        const rect = sceneRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // Constrain drop zone to top area
        const dropX = Math.max(50, Math.min(750, x));
        const dropY = 50;

        const randomColor = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];

        SoundManager.playDrop();

        const ball = Matter.Bodies.circle(dropX, dropY, 8, {
            restitution: 0.6,
            friction: 0.001,
            frictionAir: 0.02, // Add air resistance for more floaty/realistic feel
            render: {
                fillStyle: randomColor,
                strokeStyle: '#fff',
                lineWidth: 1
            },
            label: 'ball'
        });

        Matter.World.add(engineRef.current.world, ball);
        setBallCount(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 pt-24">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link to="/arcade" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Back to Arcade
                    </Link>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-lg">
                        NEON PLINKO EXTREME
                    </h1>
                    <div className="w-24"></div> {/* Spacer */}
                </div>

                {gameState === 'menu' && (
                    <div className="text-center py-20 relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative z-10 max-w-lg mx-auto p-8"
                        >
                            <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                                <Skull className="w-12 h-12 text-rose-500" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 text-white">Dare to Drop?</h2>
                            <p className="text-slate-400 mb-8 text-lg">
                                Click to drop balls. <br />
                                <span className="text-rose-400 font-bold">Middle Red Zone</span> = DARE (You Lose)<br />
                                <span className="text-emerald-400 font-bold">Outer Green Zones</span> = SAFE
                            </p>
                            <button
                                onClick={() => setGameState('playing')}
                                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-rose-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600 hover:bg-rose-500"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Start Game
                                <div className="absolute -inset-3 rounded-xl bg-rose-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
                            </button>
                        </motion.div>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="flex flex-col items-center">
                        <div className="relative bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-800 shadow-[0_0_50px_-12px_rgba(244,63,94,0.3)]">
                            <div
                                ref={sceneRef}
                                className="cursor-pointer active:cursor-grabbing"
                                onClick={dropBall}
                            />

                            {/* Overlay Instructions */}
                            <div className="absolute top-6 left-0 w-full text-center pointer-events-none">
                                <p className="text-white/50 text-sm font-medium tracking-widest uppercase">Tap top area to drop</p>
                            </div>

                            {/* Zone Indicators */}
                            <div className="absolute bottom-0 left-0 w-full h-16 pointer-events-none flex">
                                <div className="w-[40%] bg-gradient-to-t from-emerald-500/30 to-transparent flex items-end justify-center pb-2">
                                    <span className="text-emerald-400 font-bold text-sm tracking-wider">SAFE</span>
                                </div>
                                <div className="w-[20%] bg-gradient-to-t from-rose-500/30 to-transparent flex items-end justify-center pb-2 border-x border-white/10">
                                    <span className="text-rose-500 font-black text-sm tracking-wider animate-pulse">DARE</span>
                                </div>
                                <div className="w-[40%] bg-gradient-to-t from-emerald-500/30 to-transparent flex items-end justify-center pb-2">
                                    <span className="text-emerald-400 font-bold text-sm tracking-wider">SAFE</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => setGameState('menu')}
                                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors text-sm font-medium"
                            >
                                Exit Game
                            </button>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {gameState === 'result' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                className={`bg-slate-900 p-10 rounded-3xl border-2 ${winner === 'dare' ? 'border-rose-500 shadow-[0_0_100px_-20px_rgba(244,63,94,0.5)]' : 'border-emerald-500'} max-w-md w-full text-center relative overflow-hidden`}
                            >
                                {winner === 'dare' ? (
                                    <>
                                        <div className="absolute inset-0 bg-rose-500/5 animate-pulse"></div>
                                        <Skull className="w-24 h-24 text-rose-500 mx-auto mb-6 animate-bounce relative z-10" />
                                        <h2 className="text-4xl font-black text-white mb-2 relative z-10">DARE!</h2>
                                        <p className="text-rose-400 font-bold mb-8 uppercase tracking-widest relative z-10">Fate has spoken</p>
                                        <div className="bg-black/40 p-6 rounded-2xl mb-8 border border-rose-500/30 relative z-10 backdrop-blur-md">
                                            <p className="text-xl text-white font-medium leading-relaxed">
                                                "{dare}"
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Trophy className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
                                        <h2 className="text-4xl font-black text-white mb-2">SAFE!</h2>
                                        <p className="text-emerald-400 font-bold mb-8">You survived... for now.</p>
                                    </>
                                )}

                                <div className="flex gap-4 justify-center relative z-10">
                                    <button
                                        onClick={() => {
                                            setGameState('playing');
                                            setWinner(null);
                                        }}
                                        className="bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Play Again
                                    </button>
                                    <Link
                                        to="/arcade"
                                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                                    >
                                        Exit
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Plinko;
