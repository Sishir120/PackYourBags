import Matter from 'matter-js';

export class Marble {
    constructor(config) {
        this.id = config.id;
        this.country = config.country;
        this.countryId = config.countryId;
        this.color = config.color;
        this.radius = config.radius || 27; // Decreased from 31 to 27 as requested

        // Create Matter.js Body with improved physics
        this.body = Matter.Bodies.circle(config.position.x, config.position.y, this.radius, {
            restitution: 0.3, // Moderate bounciness for wall deflection
            friction: 0.003,  // Lower friction for smoother rolling
            frictionAir: 0.0005, // Minimal air resistance
            frictionStatic: 0.003,
            density: 0.008,   // Higher density to prevent penetration
            slop: 0.02, // Tighter collision tolerance
            label: 'marble',
            render: {
                fillStyle: this.color
            },
            // Improve collision detection
            collisionFilter: {
                group: 0,
                category: 0x0001,
                mask: 0xFFFF
            },
            // Additional physics constraints
            inertia: Infinity // Prevent excessive spinning that can cause penetration
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