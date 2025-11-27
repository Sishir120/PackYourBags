import { Vec2 } from './Utils';
import { Marble } from './Marble';

export const Track = {
    create: () => {
        const width = 400;
        const height = 12000; // Extended for 2 mins
        const walls = [];
        const obstacles = [];
        const kinematicLines = [];
        const checkpoints = [];
        const path = [];
        const kinematicBodies = [];
        const triggerZones = [];

        // Helper to add wall strip
        const addWallStrip = (points, restitution = 0.5) => {
            for (let i = 0; i < points.length - 1; i++) {
                walls.push({ start: points[i], end: points[i + 1], restitution });
            }
        };

        // 1. Start Funnel (0 - 500)
        walls.push({ start: { x: 0, y: 0 }, end: { x: 0, y: 500 }, restitution: 0.2 });
        walls.push({ start: { x: width, y: 0 }, end: { x: width, y: 500 }, restitution: 0.2 });
        walls.push({ start: { x: 0, y: 100 }, end: { x: 150, y: 300 }, restitution: 0.5 });
        walls.push({ start: { x: width, y: 100 }, end: { x: 250, y: 300 }, restitution: 0.5 });
        walls.push({ start: { x: 150, y: 300 }, end: { x: 150, y: 500 }, restitution: 0 });
        walls.push({ start: { x: 250, y: 300 }, end: { x: 250, y: 500 }, restitution: 0 });

        // 2. Wavy Snake (500 - 3000)
        const waveStart = 500;
        const waveEnd = 3000;
        const waveAmp = 100;
        const waveFreq = 0.005;
        const leftPoints = [];
        const rightPoints = [];

        for (let y = waveStart; y <= waveEnd; y += 50) {
            const xOffset = Math.sin((y - waveStart) * waveFreq) * waveAmp;
            // Wider track to prevent sticking (Gap ~150px)
            leftPoints.push({ x: 125 + xOffset, y });
            rightPoints.push({ x: 275 + xOffset, y });
        }
        addWallStrip(leftPoints);
        addWallStrip(rightPoints);

        // 3. The Spinners (3000 - 5000)
        walls.push({ start: { x: 0, y: 3000 }, end: { x: 0, y: 5000 }, restitution: 0.2 });
        walls.push({ start: { x: width, y: 3000 }, end: { x: width, y: 5000 }, restitution: 0.2 });

        for (let y = 3200; y < 4800; y += 250) {
            kinematicLines.push({
                center: { x: 130, y },
                length: 140,
                angle: 0,
                angularVelocity: 1.5,
                restitution: 0.8
            });
            kinematicLines.push({
                center: { x: 270, y },
                length: 140,
                angle: Math.PI / 2,
                angularVelocity: -1.5,
                restitution: 0.8
            });
        }

        // 4. The Elevator (5000 - 6000)
        // A pit where marbles fall onto a moving platform
        walls.push({ start: { x: 0, y: 5000 }, end: { x: 0, y: 6000 }, restitution: 0.2 });
        walls.push({ start: { x: width, y: 5000 }, end: { x: width, y: 6000 }, restitution: 0.2 });

        // Elevator Platform
        kinematicBodies.push({
            position: { x: 100, y: 5800 },
            width: 200,
            height: 20,
            velocity: { x: 0, y: -50 }, // Moves up slowly
            restitution: 0.2,
            type: 'elevator',
            minY: 5200,
            maxY: 5800
        });

        // 5. Split Path (6000 - 7000) - Widened to prevent bottlenecks
        walls.push({ start: { x: 0, y: 6000 }, end: { x: 0, y: 7000 }, restitution: 0.2 });
        walls.push({ start: { x: width, y: 6000 }, end: { x: width, y: 7000 }, restitution: 0.2 });
        // Island (wider gaps on sides)
        walls.push({ start: { x: 200, y: 6100 }, end: { x: 130, y: 6300 }, restitution: 0.5 });
        walls.push({ start: { x: 200, y: 6100 }, end: { x: 270, y: 6300 }, restitution: 0.5 });
        walls.push({ start: { x: 130, y: 6300 }, end: { x: 130, y: 6900 }, restitution: 0.5 });
        walls.push({ start: { x: 270, y: 6300 }, end: { x: 270, y: 6900 }, restitution: 0.5 });

        // 6. Zig-Zag Drop (7000 - 9000)
        walls.push({ start: { x: 0, y: 7000 }, end: { x: 0, y: 9000 }, restitution: 0.2 });
        walls.push({ start: { x: width, y: 7000 }, end: { x: width, y: 9000 }, restitution: 0.2 });

        for (let i = 0; i < 8; i++) {
            const y = 7100 + i * 200;
            if (i % 2 === 0) {
                walls.push({ start: { x: 0, y }, end: { x: 300, y: y + 100 }, restitution: 0.2 });
            } else {
                walls.push({ start: { x: width, y }, end: { x: 100, y: y + 100 }, restitution: 0.2 });
            }
        }

        // 7. Simplified Drop Zone (9000 - 11000) - Removed Plinko obstacles to prevent sticking
        walls.push({ start: { x: 0, y: 9000 }, end: { x: 0, y: 11000 }, restitution: 0.2 });
        walls.push({ start: { x: width, y: 9000 }, end: { x: width, y: 11000 }, restitution: 0.2 });

        // Add gentle zigzag platforms instead of static marbles
        for (let i = 0; i < 5; i++) {
            const y = 9200 + i * 350;
            const xOffset = (i % 2) * 150;
            // Left platform
            walls.push({
                start: { x: 50 + xOffset, y },
                end: { x: 150 + xOffset, y: y + 80 },
                restitution: 0.4
            });
            // Right platform
            walls.push({
                start: { x: 250 + xOffset, y },
                end: { x: 350 + xOffset, y: y + 80 },
                restitution: 0.4
            });
        }

        // 8. Teleporter Zone (11000)
        triggerZones.push({
            x: 0, y: 11000,
            width: 400, height: 200,
            target: { x: 200, y: 500 }, // Back to start! (Evil loop)
            type: 'teleporter'
        });

        // 9. Final Dash (11200 - 12000)
        walls.push({ start: { x: 0, y: 11200 }, end: { x: 150, y: 11800 }, restitution: 0.5 });
        walls.push({ start: { x: width, y: 11200 }, end: { x: 250, y: 11800 }, restitution: 0.5 });
        walls.push({ start: { x: 0, y: height + 100 }, end: { x: width, y: height + 100 }, restitution: 0.2 });

        // Checkpoints
        for (let y = 500; y < height; y += 500) {
            checkpoints.push({ y, index: checkpoints.length });
        }
        checkpoints.push({ y: height, index: checkpoints.length, isFinish: true });

        // AI Path
        path.push({ x: 200, y: 100 });
        path.push({ x: 200, y: 12000 });

        return { walls, obstacles, kinematicLines, checkpoints, path, kinematicBodies, triggerZones };
    }
};
