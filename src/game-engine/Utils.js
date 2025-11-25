/**
 * Vector Math and Utility Functions
 * Strictly 2D.
 */

export const Vec2 = {
    create: (x = 0, y = 0) => ({ x, y }),

    add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),
    sub: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),
    mult: (v, s) => ({ x: v.x * s, y: v.y * s }),
    div: (v, s) => ({ x: v.x / s, y: v.y / s }),

    mag: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
    magSq: (v) => v.x * v.x + v.y * v.y,

    norm: (v) => {
        const m = Math.sqrt(v.x * v.x + v.y * v.y);
        return m === 0 ? { x: 0, y: 0 } : { x: v.x / m, y: v.y / m };
    },

    dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y,
    cross: (v1, v2) => v1.x * v2.y - v1.y * v2.x, // 2D cross product returns scalar (z-component)

    dist: (v1, v2) => Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2)),
    distSq: (v1, v2) => Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2),

    lerp: (v1, v2, t) => ({
        x: v1.x + (v2.x - v1.x) * t,
        y: v1.y + (v2.y - v1.y) * t
    }),

    // Project point p onto line segment ab
    projectPointOnSegment: (p, a, b) => {
        const ab = Vec2.sub(b, a);
        const ap = Vec2.sub(p, a);
        const lenSq = Vec2.magSq(ab);
        if (lenSq === 0) return a; // a and b are same
        const t = Math.max(0, Math.min(1, Vec2.dot(ap, ab) / lenSq));
        return Vec2.add(a, Vec2.mult(ab, t));
    }
};

export const MathUtils = {
    clamp: (val, min, max) => Math.max(min, Math.min(max, val)),
    lerp: (a, b, t) => a + (b - a) * t,

    // Deterministic Pseudo-Random Number Generator (Linear Congruential Generator)
    // Allows for replayable races given a seed.
    createSeededRandom: (seed) => {
        let currentSeed = seed;
        return () => {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            return currentSeed / 233280;
        };
    }
};
