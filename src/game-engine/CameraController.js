import { MathUtils } from './Utils';

export class CameraController {
    constructor(trackHeight, viewportHeight) {
        this.y = 0;
        this.zoom = 1;
        this.trackHeight = trackHeight;
        this.viewportHeight = viewportHeight;

        // Configuration
        this.minZoom = 0.5; // Zoom out to see more
        this.maxZoom = 1.2; // Zoom in when close
        this.zoomSpeed = 2.0;
        this.followSpeed = 3.0;
        this.padding = 200; // Padding around marbles

        this.mode = 'pack'; // 'pack' or 'leader'
    }

    update(marbles, dt) {
        if (!marbles || marbles.length === 0) return;

        let activeMarbles = marbles.filter(m => !m.isFinished);
        if (activeMarbles.length === 0) activeMarbles = marbles;

        if (activeMarbles.length === 0) return;

        let targetY, targetZoom;

        if (this.mode === 'leader') {
            // Find leader (highest Y)
            const leader = activeMarbles.reduce((prev, current) =>
                (prev.position.y > current.position.y) ? prev : current
            );

            // Focus on leader
            targetZoom = 1.0; // Fixed zoom for leader mode? Or slightly dynamic?
            // Let's keep it close

            // Center leader vertically
            const viewHeightWorld = this.viewportHeight / targetZoom;
            targetY = leader.position.y - (viewHeightWorld / 2);

        } else {
            // PACK MODE (Default)
            // Calculate Bounding Box
            let minY = Infinity;
            let maxY = -Infinity;

            activeMarbles.forEach(m => {
                if (m.position.y < minY) minY = m.position.y;
                if (m.position.y > maxY) maxY = m.position.y;
            });

            // Determine Target Zoom based on spread
            const spread = maxY - minY;
            const targetHeight = spread + this.padding * 2;

            // Calculate zoom to fit targetHeight into viewportHeight
            targetZoom = this.viewportHeight / Math.max(targetHeight, 600); // Min height 600
            targetZoom = MathUtils.clamp(targetZoom, this.minZoom, this.maxZoom);

            // Determine Target Y (Center of the pack)
            const packCenterY = (minY + maxY) / 2;
            const viewHeightWorld = this.viewportHeight / targetZoom;
            targetY = packCenterY - (viewHeightWorld / 2);
        }

        // Clamp to track bounds
        const minTrackY = -200;
        // const maxTrackY = this.trackHeight - (this.viewportHeight / targetZoom) + 200; 
        // Just clamp top for now, let it go down as far as needed
        if (targetY < minTrackY) targetY = minTrackY;

        // Smooth Zoom
        this.zoom += (targetZoom - this.zoom) * Math.min(1, dt * this.zoomSpeed);

        // Smooth Follow
        this.y += (targetY - this.y) * Math.min(1, dt * this.followSpeed);
    }
}
