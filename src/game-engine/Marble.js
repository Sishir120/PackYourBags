import Matter from 'matter-js';

export class Marble {
    constructor(config) {
        this.id = config.id;
        this.country = config.country;
        this.countryId = config.countryId;
        this.color = config.color;
        this.radius = config.radius || 8; // Reduced from 10 for better flow

        // Create Matter.js Body with improved physics
        this.body = Matter.Bodies.circle(config.position.x, config.position.y, this.radius, {
            restitution: 0.3, // Reduced bounciness (from 0.4)
            friction: 0.005,  // Reduced friction for smoother rolling
            frictionAir: 0.001, // Reduced air resistance
            frictionStatic: 0.005,
            density: 0.005,   // Slightly higher density for better momentum
            slop: 0.1, // Increased collision tolerance (from 0.05)
            label: 'marble',
            render: {
                fillStyle: this.color
            },
            // Improve collision detection
            collisionFilter: {
                group: 0,
                category: 0x0001,
                mask: 0xFFFF
            }
        });

        // Attach reference to this instance on the body for easy access
        this.body.marble = this;

        this.isFinished = false;
        this.finishTime = 0;
        this.rank = 0;
    }

    get position() {
        return this.body.position;
    }

    get velocity() {
        return this.body.velocity;
    }
}
