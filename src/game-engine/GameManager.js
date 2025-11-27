import Matter from 'matter-js';
import { Marble } from './Marble';
import { TrackGenerator } from './TrackGenerator';
import { CameraController } from './CameraController';

export class GameManager {
    constructor(config) {
        this.config = config;
        this.onGameStateChange = config.onGameStateChange || (() => { });
        this.onLeaderboardUpdate = config.onLeaderboardUpdate || (() => { });

        // Initialize Matter.js Engine
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;

        // Configure Gravity
        this.engine.gravity.y = 1.2; // Slightly stronger gravity
        this.engine.gravity.x = 0;
        this.engine.gravity.scale = 0.001;

        // Enable better collision detection
        this.engine.enableSleeping = false;
        this.engine.positionIterations = 12; // Increased for better accuracy
        this.engine.velocityIterations = 10; // Increased for better accuracy

        this.trackGenerator = new TrackGenerator(400); // 400px width
        this.camera = new CameraController(20000, 800);

        this.marbles = [];
        this.state = 'IDLE'; // IDLE, COUNTDOWN, RACING, FINISHED
        this.finishLineY = 0;
        this.marbleStuckTracking = new Map(); // Track stuck marbles

        this.initTrack();
    }

    initTrack() {
        // Clear existing world
        Matter.World.clear(this.world);
        this.engine.events = {}; // Clear events

        const chunkHeight = 600;
        const numChunks = 20;
        let currentY = 0;

        // Starting Platform
        const startPlatform = this.trackGenerator.createChunk('straight', currentY, 200);
        Matter.Composite.add(this.world, startPlatform);
        currentY += 200;

        // Generate Random Chunks with visual variety
        const chunkTypes = ['zigzag', 'split', 'funnel', 'straight', 'donut', 'wavyPlatform', 'spinner'];

        for (let i = 0; i < numChunks; i++) {
            const type = chunkTypes[Math.floor(Math.random() * chunkTypes.length)];
            const chunk = this.trackGenerator.createChunk(type, currentY, chunkHeight);
            Matter.Composite.add(this.world, chunk);
            currentY += chunkHeight;
        }

        // Finish Line Area
        const finishChunk = this.trackGenerator.createChunk('straight', currentY, 800);
        Matter.Composite.add(this.world, finishChunk);

        this.finishLineY = currentY + 400;

        // Add Finish Sensor
        const sensor = Matter.Bodies.rectangle(200, this.finishLineY, 400, 20, {
            isStatic: true,
            isSensor: true,
            label: 'finishLine',
            render: { fillStyle: '#10b981' }
        });
        Matter.Composite.add(this.world, sensor);

        // Stronger walls to prevent marble penetration
        const wallThickness = 60; // Increased from 40 for better collision
        const leftWall = Matter.Bodies.rectangle(-30, currentY / 2, wallThickness, currentY + 2000, {
            isStatic: true,
            friction: 0.1, // Lower friction for better deflection
            restitution: 0.5, // Higher restitution for bouncing off walls
            label: 'boundary',
            render: { fillStyle: '#1e293b' }
        });
        const rightWall = Matter.Bodies.rectangle(430, currentY / 2, wallThickness, currentY + 2000, {
            isStatic: true,
            friction: 0.1,
            restitution: 0.5,
            label: 'boundary',
            render: { fillStyle: '#1e293b' }
        });
        Matter.Composite.add(this.world, [leftWall, rightWall]);

        // Add collision sound events for marbles
        Matter.Events.on(this.engine, 'collisionStart', (event) => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;

                // Check if a marble is involved in collision
                const marbleBody = bodyA.label === 'marble' ? bodyA : (bodyB.label === 'marble' ? bodyB : null);

                if (marbleBody && this.state === 'RACING') {
                    // Calculate collision intensity based on velocity
                    const velocity = marbleBody.velocity;
                    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

                    // Only play sound for significant collisions
                    if (speed > 2 && Math.random() > 0.5) { // 50% chance to avoid spam
                        // Import SoundManager dynamically to avoid circular dependencies
                        import('../utils/SoundManager').then(({ SoundManager }) => {
                            SoundManager.playBounce();
                        });
                    }
                }
            });
        });

        // Update Camera Track Height
        this.camera.trackHeight = currentY + 800;
    }

    startRace(countries) {
        // Clear existing marbles
        this.marbles.forEach(m => Matter.Composite.remove(this.world, m.body));
        this.marbles = [];
        this.marbleStuckTracking.clear();

        // Spawn Marbles
        const cols = 4;
        const colWidth = 40;
        const startX = 200 - (cols * colWidth) / 2;

        this.marbles = countries.map((country, i) => {
            const x = startX + (i % cols) * colWidth + 20;
            const y = -50 - Math.floor(i / cols) * 40;

            const marble = new Marble({
                id: i,
                country: country,
                countryId: country.id,
                color: country.color,
                position: { x, y }
            });

            // Initialize stuck tracking
            this.marbleStuckTracking.set(marble.id, {
                lastPosition: { x, y },
                stuckTime: 0,
                lastCheckTime: Date.now()
            });

            return marble;
        });

        this.marbles.forEach(m => Matter.Composite.add(this.world, m.body));

        this.state = 'COUNTDOWN';
        this.onGameStateChange('COUNTDOWN');

        // Freeze physics during countdown
        this.marbles.forEach(m => Matter.Body.setStatic(m.body, true));

        setTimeout(() => {
            this.state = 'RACING';
            this.onGameStateChange('RACING');
            // Unfreeze
            this.marbles.forEach(m => {
                Matter.Body.setStatic(m.body, false);
                // Give a small random push to prevent clustering
                const randomX = (Math.random() - 0.5) * 0.0005;
                Matter.Body.applyForce(m.body, m.body.position, { x: randomX, y: 0.002 });
            });
        }, 3000);
    }

    checkStuckMarbles() {
        if (this.state !== 'RACING') return;

        const currentTime = Date.now();
        const NUDGE_THRESHOLD = 500; // 0.5 seconds - faster detection
        const RESPAWN_THRESHOLD = 2000; // 2 seconds - faster respawn
        const POSITION_TOLERANCE = 3; // pixels - tighter tolerance

        this.marbles.forEach(m => {
            if (m.isFinished) return;

            const tracking = this.marbleStuckTracking.get(m.id);
            if (!tracking) return;

            const currentPos = m.position;
            const lastPos = tracking.lastPosition;

            // Calculate distance moved
            const distance = Math.sqrt(
                Math.pow(currentPos.x - lastPos.x, 2) +
                Math.pow(currentPos.y - lastPos.y, 2)
            );

            // Check if marble is stuck
            if (distance < POSITION_TOLERANCE) {
                tracking.stuckTime += (currentTime - tracking.lastCheckTime);

                // Nudge if stuck for a bit - more aggressive
                if (tracking.stuckTime >= NUDGE_THRESHOLD && tracking.stuckTime < RESPAWN_THRESHOLD) {
                    // Apply stronger random force to unstuck
                    const angle = Math.random() * Math.PI * 2;
                    Matter.Body.applyForce(m.body, m.body.position, {
                        x: Math.cos(angle) * 0.008,
                        y: Math.sin(angle) * 0.008 - 0.003 // Slight upward bias
                    });

                    // Also give it a spin to help escape
                    Matter.Body.setAngularVelocity(m.body, (Math.random() - 0.5) * 0.2);
                }

                // Respawn if stuck for too long
                if (tracking.stuckTime >= RESPAWN_THRESHOLD) {
                    this.respawnMarble(m);
                    tracking.stuckTime = 0;
                }
            } else {
                // Marble is moving, reset stuck time
                tracking.stuckTime = 0;
                tracking.lastPosition = { x: currentPos.x, y: currentPos.y };
            }

            tracking.lastCheckTime = currentTime;
        });
    }

    respawnMarble(marble) {
        // Respawn marble slightly ahead of its current position
        const currentY = marble.position.y;
        const newY = currentY + 50; // Drop 50px ahead (reduced from 100 to avoid skipping too much)
        const newX = 200 + (Math.random() - 0.5) * 100; // Random X near center

        // Set new position
        Matter.Body.setPosition(marble.body, { x: newX, y: newY });

        // Reset velocity
        Matter.Body.setVelocity(marble.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(marble.body, 0);

        // Wake up the body
        Matter.Sleeping.set(marble.body, false);

        // Give a small push
        Matter.Body.applyForce(marble.body, marble.body.position, {
            x: (Math.random() - 0.5) * 0.001,
            y: 0.005 // Stronger downward push
        });

        // Update tracking
        const tracking = this.marbleStuckTracking.get(marble.id);
        if (tracking) {
            tracking.lastPosition = { x: newX, y: newY };
            tracking.stuckTime = 0;
        }
    }

    update(dt) {
        if (this.state === 'IDLE') return;

        // Clamp dt to avoid huge jumps
        const safeDt = Math.min(dt, 0.1);

        // Update Physics with fixed timestep for stability
        const fixedTimeStep = 1000 / 60; // 60 FPS
        Matter.Engine.update(this.engine, fixedTimeStep);

        // Enforce boundaries - prevent marbles from going through walls
        this.marbles.forEach(m => {
            const pos = m.position;
            const radius = m.radius;
            const minX = radius + 5; // 5px padding from left wall
            const maxX = 400 - radius - 5; // 5px padding from right wall

            // If marble is outside bounds, push it back and reverse velocity
            if (pos.x < minX) {
                Matter.Body.setPosition(m.body, { x: minX, y: pos.y });
                Matter.Body.setVelocity(m.body, { x: Math.abs(m.body.velocity.x) * 0.5, y: m.body.velocity.y });
            } else if (pos.x > maxX) {
                Matter.Body.setPosition(m.body, { x: maxX, y: pos.y });
                Matter.Body.setVelocity(m.body, { x: -Math.abs(m.body.velocity.x) * 0.5, y: m.body.velocity.y });
            }
        });

        // Check for stuck marbles every frame
        this.checkStuckMarbles();

        // Check Finish Line
        this.marbles.forEach(m => {
            if (!m.isFinished && m.position.y >= this.finishLineY) {
                m.isFinished = true;
                m.finishTime = Date.now();

                // Calculate Rank
                const finishedCount = this.marbles.filter(mar => mar.isFinished).length;
                m.rank = finishedCount;
            }
        });

        // Update Leaderboard
        // Update live rank for non-finished marbles based on Y position
        const activeMarbles = this.marbles.filter(m => !m.isFinished);
        activeMarbles.sort((a, b) => b.position.y - a.position.y);

        const finishedCount = this.marbles.filter(m => m.isFinished).length;
        activeMarbles.forEach((m, i) => {
            m.rank = finishedCount + i + 1;
        });

        this.onLeaderboardUpdate(this.marbles);

        // Check All Finished
        if (this.state === 'RACING' && this.marbles.every(m => m.isFinished)) {
            this.state = 'FINISHED';
            const winner = this.marbles.find(m => m.rank === 1);
            this.onGameStateChange('FINISHED', winner ? { country: winner.country } : null);
        }

        // Update Camera
        this.camera.update(this.marbles, safeDt);
    }

    destroy() {
        Matter.World.clear(this.world);
        Matter.Engine.clear(this.engine);
        this.marbles = [];
        this.marbleStuckTracking.clear();
    }
}
