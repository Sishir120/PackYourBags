import Matter from 'matter-js';

export class TrackGenerator {
    constructor(width) {
        this.width = width;
        this.wallThickness = 20;
    }

    createChunk(type, startY, height) {
        switch (type) {
            case 'zigzag':
                return this.createZigZagChunk(startY, height);
            case 'pegField':
                return this.createPegFieldChunk(startY, height);
            case 'split':
                return this.createSplitPathChunk(startY, height);
            case 'funnel':
                return this.createFunnelChunk(startY, height);
            case 'donut':
                return this.createDonutChunk(startY, height);
            case 'wavyPlatform':
                return this.createWavyPlatformChunk(startY, height);
            case 'spinner':
                return this.createSpinnerChunk(startY, height);
            default:
                return this.createStraightChunk(startY, height);
        }
    }

    createStraightChunk(startY, height) {
        const walls = [
            // Left Wall
            Matter.Bodies.rectangle(this.wallThickness / 2, startY + height / 2, this.wallThickness, height, {
                isStatic: true,
                friction: 0.1,
                restitution: 0.3,
                render: { fillStyle: '#1e293b' }
            }),
            // Right Wall
            Matter.Bodies.rectangle(this.width - this.wallThickness / 2, startY + height / 2, this.wallThickness, height, {
                isStatic: true,
                friction: 0.1,
                restitution: 0.3,
                render: { fillStyle: '#1e293b' }
            })
        ];
        return walls;
    }

    createZigZagChunk(startY, height) {
        const bodies = [];
        const numZigs = 4;
        const zigHeight = height / numZigs;

        for (let i = 0; i < numZigs; i++) {
            const y = startY + i * zigHeight + zigHeight / 2;
            const isLeft = i % 2 === 0;

            // Angled platform
            const angle = isLeft ? Math.PI / 6 : -Math.PI / 6;
            const x = isLeft ? this.width / 4 : this.width * 0.75;
            const w = this.width * 0.6;

            const platform = Matter.Bodies.rectangle(x, y, w, 20, {
                isStatic: true,
                angle: angle,
                friction: 0.05,
                restitution: 0.4,
                render: { fillStyle: '#334155' }
            });
            bodies.push(platform);
        }

        // Side walls
        bodies.push(...this.createStraightChunk(startY, height));
        return bodies;
    }

    createPegFieldChunk(startY, height) {
        // Replaced static pegs with gentle platforms to prevent sticking
        const bodies = [];
        const numPlatforms = 5;
        const platformHeight = height / numPlatforms;

        for (let i = 0; i < numPlatforms; i++) {
            const y = startY + i * platformHeight + platformHeight / 2;
            const xOffset = (i % 2) * 100;

            // Left platform
            const leftPlatform = Matter.Bodies.rectangle(80 + xOffset, y, 120, 15, {
                isStatic: true,
                angle: Math.PI / 12,
                friction: 0.05,
                restitution: 0.4,
                render: { fillStyle: '#475569' }
            });

            // Right platform
            const rightPlatform = Matter.Bodies.rectangle(320 - xOffset, y, 120, 15, {
                isStatic: true,
                angle: -Math.PI / 12,
                friction: 0.05,
                restitution: 0.4,
                render: { fillStyle: '#475569' }
            });

            bodies.push(leftPlatform, rightPlatform);
        }

        bodies.push(...this.createStraightChunk(startY, height));
        return bodies;
    }

    createSplitPathChunk(startY, height) {
        const bodies = [];

        // Center Divider
        const divider = Matter.Bodies.rectangle(this.width / 2, startY + height / 2, 20, height * 0.8, {
            isStatic: true,
            friction: 0.1,
            restitution: 0.3,
            render: { fillStyle: '#475569' }
        });

        // Diamond obstacle at start of split
        const diamond = Matter.Bodies.polygon(this.width / 2, startY + height * 0.1, 4, 40, {
            isStatic: true,
            angle: Math.PI / 4,
            friction: 0.05,
            restitution: 0.5,
            render: { fillStyle: '#ef4444' }
        });

        bodies.push(divider, diamond);
        bodies.push(...this.createStraightChunk(startY, height));
        return bodies;
    }

    createFunnelChunk(startY, height) {
        const bodies = [];
        const midY = startY + height / 2;

        // Left Funnel Wall
        const leftWall = Matter.Bodies.rectangle(this.width * 0.2, midY, 20, height * 0.8, {
            isStatic: true,
            angle: Math.PI / 12,
            friction: 0.05,
            restitution: 0.4,
            render: { fillStyle: '#334155' }
        });

        // Right Funnel Wall
        const rightWall = Matter.Bodies.rectangle(this.width * 0.8, midY, 20, height * 0.8, {
            isStatic: true,
            angle: -Math.PI / 12,
            friction: 0.05,
            restitution: 0.4,
            render: { fillStyle: '#334155' }
        });

        bodies.push(leftWall, rightWall);
        bodies.push(...this.createStraightChunk(startY, height));
        return bodies;
    }

    createDonutChunk(startY, height) {
        // Safe donut-themed obstacles (hollow circles)
        const bodies = [];
        const numDonuts = 4;
        const spacing = height / (numDonuts + 1);

        for (let i = 0; i < numDonuts; i++) {
            const y = startY + (i + 1) * spacing;
            const x = (i % 2 === 0) ? this.width * 0.3 : this.width * 0.7;

            // Create donut as a compound body (outer circle with inner hole)
            const outerRadius = 35;
            const innerRadius = 15;

            // Use a polygon to simulate donut shape
            const donut = Matter.Bodies.circle(x, y, outerRadius, {
                isStatic: true,
                friction: 0.05,
                restitution: 0.5,
                render: {
                    fillStyle: '#f59e0b', // Donut color
                    strokeStyle: '#92400e',
                    lineWidth: 3
                }
            });

            bodies.push(donut);
        }

        bodies.push(...this.createStraightChunk(startY, height));
        return bodies;
    }

    createWavyPlatformChunk(startY, height) {
        // Curved/wavy platforms
        const bodies = [];
        const numWaves = 3;
        const waveHeight = height / numWaves;

        for (let i = 0; i < numWaves; i++) {
            const y = startY + i * waveHeight + waveHeight / 2;
            const isLeft = i % 2 === 0;

            // Create curved platform using angled rectangles
            const segments = 5;
            for (let s = 0; s < segments; s++) {
                const segmentWidth = this.width * 0.5 / segments;
                const xStart = isLeft ? 50 : this.width / 2;
                const x = xStart + s * segmentWidth + segmentWidth / 2;
                const curveOffset = Math.sin((s / segments) * Math.PI) * 30;

                const segment = Matter.Bodies.rectangle(x, y + curveOffset, segmentWidth + 5, 15, {
                    isStatic: true,
                    angle: Math.sin((s / segments) * Math.PI) * 0.3,
                    friction: 0.05,
                    restitution: 0.4,
                    render: { fillStyle: '#3b82f6' } // Blue wavy platforms
                });

                bodies.push(segment);
            }
        }

        bodies.push(...this.createStraightChunk(startY, height));
        return bodies;
    }

    createSpinnerChunk(startY, height) {
        // Rotating spinner obstacles (visual only, static for safety)
        const bodies = [];
        const numSpinners = 3;
        const spacing = height / (numSpinners + 1);

        for (let i = 0; i < numSpinners; i++) {
            const y = startY + (i + 1) * spacing;
            const x = this.width / 2;

            // Create spinner arms (cross shape)
            const armLength = 80;
            const armWidth = 15;

            // Horizontal arm
            const hArm = Matter.Bodies.rectangle(x, y, armLength, armWidth, {
                isStatic: true,
                angle: (i * Math.PI / 4), // Varied angles for visual interest
                friction: 0.05,
                restitution: 0.5,
                render: { fillStyle: '#eab308' } // Gold spinner
            });

            // Vertical arm
            const vArm = Matter.Bodies.rectangle(x, y, armWidth, armLength, {
                isStatic: true,
                angle: (i * Math.PI / 4),
                friction: 0.05,
                restitution: 0.5,
                render: { fillStyle: '#eab308' }
            });

            bodies.push(hArm, vArm);
        }

        bodies.push(...this.createStraightChunk(startY, height));
        return bodies;
    }
}
