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
        const bodies = [];
        const rows = 8;
        const cols = 7;
        const rowHeight = height / rows;
        const colWidth = (this.width - 100) / cols;

        for (let r = 0; r < rows; r++) {
            const y = startY + r * rowHeight + rowHeight / 2;
            const offset = (r % 2 === 0) ? 0 : colWidth / 2;

            for (let c = 0; c < cols; c++) {
                const x = 50 + c * colWidth + offset;
                if (x < this.width - 50) {
                    const peg = Matter.Bodies.circle(x, y, 8, {
                        isStatic: true,
                        friction: 0.01,
                        restitution: 0.6, // Bouncy pegs
                        render: { fillStyle: '#64748b' }
                    });
                    bodies.push(peg);
                }
            }
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
}
