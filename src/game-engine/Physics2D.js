import { Vec2 } from './Utils';

export class Physics2D {
    constructor(config = {}) {
        this.gravity = config.gravity || { x: 0, y: 500 };
        this.friction = config.friction || 0.99;
        this.restitution = config.restitution || 0.5;
        this.fixedDt = 1 / 120; // Higher precision (120Hz)
        this.accumulator = 0;
        this.bodies = [];
        this.staticLines = [];
        this.kinematicLines = [];
        this.kinematicBodies = []; // { position: Vec2, width: number, height: number, velocity: Vec2, restitution: number }
        this.triggerZones = []; // { x, y, width, height, onEnter: (body) => void }
    }

    addBody(body) {
        this.bodies.push(body);
    }

    addStaticLine(start, end, restitution = 0.5) {
        this.staticLines.push({ start, end, restitution });
    }

    addKinematicLine(config) {
        this.kinematicLines.push({
            center: config.center,
            length: config.length,
            angle: config.angle || 0,
            angularVelocity: config.angularVelocity || 0,
            restitution: config.restitution || 0.5
        });
    }

    addKinematicBody(config) {
        this.kinematicBodies.push({
            position: config.position, // Top-left
            width: config.width,
            height: config.height,
            velocity: config.velocity || { x: 0, y: 0 },
            restitution: config.restitution || 0.5
        });
    }

    addTriggerZone(config) {
        this.triggerZones.push({
            x: config.x,
            y: config.y,
            width: config.width,
            height: config.height,
            onEnter: config.onEnter
        });
    }

    clear() {
        this.bodies = [];
        this.staticLines = [];
        this.kinematicLines = [];
        this.kinematicBodies = [];
        this.triggerZones = [];
        this.accumulator = 0;
    }

    step(dt) {
        this.accumulator += dt;
        if (this.accumulator > 0.2) this.accumulator = 0.2;

        while (this.accumulator >= this.fixedDt) {
            this.integrate(this.fixedDt);
            this.resolveCollisions();
            this.checkTriggers();
            this.accumulator -= this.fixedDt;
        }
    }

    integrate(dt) {
        // Update Kinematic Lines
        for (const line of this.kinematicLines) {
            line.angle += line.angularVelocity * dt;
        }

        // Update Kinematic Bodies (Elevators)
        for (const body of this.kinematicBodies) {
            body.position = Vec2.add(body.position, Vec2.mult(body.velocity, dt));
        }

        for (const body of this.bodies) {
            if (body.isStatic) continue;

            body.acceleration = Vec2.add(body.acceleration, this.gravity);
            body.velocity = Vec2.add(body.velocity, Vec2.mult(body.acceleration, dt));
            body.velocity = Vec2.mult(body.velocity, this.friction);

            const speed = Vec2.mag(body.velocity);
            const maxSpeed = 600;
            if (speed > maxSpeed) {
                body.velocity = Vec2.mult(Vec2.norm(body.velocity), maxSpeed);
            }

            body.position = Vec2.add(body.position, Vec2.mult(body.velocity, dt));
            body.acceleration = { x: 0, y: 0 };
        }
    }

    checkTriggers() {
        for (const body of this.bodies) {
            for (const zone of this.triggerZones) {
                if (body.position.x >= zone.x && body.position.x <= zone.x + zone.width &&
                    body.position.y >= zone.y && body.position.y <= zone.y + zone.height) {
                    zone.onEnter(body);
                }
            }
        }
    }

    resolveCollisions() {
        const iterations = 4; // Multiple passes for stability
        for (let iter = 0; iter < iterations; iter++) {
            for (const body of this.bodies) {
                if (body.isStatic) continue;

                for (const line of this.staticLines) {
                    this.resolveCircleLine(body, line);
                }

                for (const kLine of this.kinematicLines) {
                    this.resolveCircleKinematicLine(body, kLine);
                }

                for (const kBody of this.kinematicBodies) {
                    this.resolveCircleRect(body, kBody);
                }
            }

            for (let i = 0; i < this.bodies.length; i++) {
                for (let j = i + 1; j < this.bodies.length; j++) {
                    this.resolveCircleCircle(this.bodies[i], this.bodies[j]);
                }
            }
        }
    }

    resolveCircleLine(circle, line) {
        const closest = Vec2.projectPointOnSegment(circle.position, line.start, line.end);
        const distVec = Vec2.sub(circle.position, closest);
        const dist = Vec2.mag(distVec);

        if (dist < circle.radius) {
            const normal = dist === 0 ? { x: 0, y: -1 } : Vec2.div(distVec, dist);
            const penetration = circle.radius - dist;

            circle.position = Vec2.add(circle.position, Vec2.mult(normal, penetration));

            const velNormal = Vec2.dot(circle.velocity, normal);
            if (velNormal < 0) {
                const restitution = Math.min(circle.restitution, line.restitution);
                const j = -(1 + restitution) * velNormal;
                const impulse = Vec2.mult(normal, j);
                circle.velocity = Vec2.add(circle.velocity, impulse);
            }
        }
    }

    resolveCircleKinematicLine(circle, kLine) {
        const halfLen = kLine.length / 2;
        const dir = { x: Math.cos(kLine.angle), y: Math.sin(kLine.angle) };
        const start = Vec2.sub(kLine.center, Vec2.mult(dir, halfLen));
        const end = Vec2.add(kLine.center, Vec2.mult(dir, halfLen));

        const closest = Vec2.projectPointOnSegment(circle.position, start, end);
        const distVec = Vec2.sub(circle.position, closest);
        const dist = Vec2.mag(distVec);

        if (dist < circle.radius) {
            const normal = dist === 0 ? { x: -dir.y, y: dir.x } : Vec2.div(distVec, dist);
            const penetration = circle.radius - dist;

            circle.position = Vec2.add(circle.position, Vec2.mult(normal, penetration));

            const rVec = Vec2.sub(closest, kLine.center);
            const contactVel = {
                x: -kLine.angularVelocity * rVec.y,
                y: kLine.angularVelocity * rVec.x
            };

            const relVel = Vec2.sub(circle.velocity, contactVel);
            const velNormal = Vec2.dot(relVel, normal);

            if (velNormal < 0) {
                const restitution = Math.min(circle.restitution, kLine.restitution);
                const j = -(1 + restitution) * velNormal;
                const impulse = Vec2.mult(normal, j);
                circle.velocity = Vec2.add(circle.velocity, impulse);
            }
        }
    }

    resolveCircleRect(circle, rect) {
        // Find closest point on rect to circle center
        const closestX = Math.max(rect.position.x, Math.min(circle.position.x, rect.position.x + rect.width));
        const closestY = Math.max(rect.position.y, Math.min(circle.position.y, rect.position.y + rect.height));

        const distVec = { x: circle.position.x - closestX, y: circle.position.y - closestY };
        const distSq = distVec.x * distVec.x + distVec.y * distVec.y;

        if (distSq < circle.radius * circle.radius && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const normal = { x: distVec.x / dist, y: distVec.y / dist };
            const penetration = circle.radius - dist;

            // Position Correction
            circle.position = Vec2.add(circle.position, Vec2.mult(normal, penetration));

            // Velocity Resolution
            // Relative velocity includes rect velocity
            const relVel = Vec2.sub(circle.velocity, rect.velocity);
            const velNormal = Vec2.dot(relVel, normal);

            if (velNormal < 0) {
                const restitution = Math.min(circle.restitution, rect.restitution);
                const j = -(1 + restitution) * velNormal;
                const impulse = Vec2.mult(normal, j);
                circle.velocity = Vec2.add(circle.velocity, impulse);
            }
        }
    }

    resolveCircleCircle(c1, c2) {
        const distVec = Vec2.sub(c2.position, c1.position);
        const distSq = Vec2.magSq(distVec);
        const radiusSum = c1.radius + c2.radius;

        if (distSq < radiusSum * radiusSum && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const normal = Vec2.div(distVec, dist);
            const penetration = radiusSum - dist;

            const m1 = c1.isStatic ? 0 : c1.mass;
            const m2 = c2.isStatic ? 0 : c2.mass;
            const invM1 = m1 === 0 ? 0 : 1 / m1;
            const invM2 = m2 === 0 ? 0 : 1 / m2;
            const invMassSum = invM1 + invM2;

            if (invMassSum === 0) return;

            const correction = Vec2.mult(normal, penetration / invMassSum);
            if (!c1.isStatic) c1.position = Vec2.sub(c1.position, Vec2.mult(correction, invM1));
            if (!c2.isStatic) c2.position = Vec2.add(c2.position, Vec2.mult(correction, invM2));

            const relVel = Vec2.sub(c2.velocity, c1.velocity);
            const velAlongNormal = Vec2.dot(relVel, normal);

            if (velAlongNormal < 0) {
                const restitution = Math.min(c1.restitution, c2.restitution);
                const j = -(1 + restitution) * velAlongNormal;
                const impulseMag = j / invMassSum;
                const impulse = Vec2.mult(normal, impulseMag);

                if (!c1.isStatic) c1.velocity = Vec2.sub(c1.velocity, Vec2.mult(impulse, invM1));
                if (!c2.isStatic) c2.velocity = Vec2.add(c2.velocity, Vec2.mult(impulse, invM2));
            }
        }
    }
}
