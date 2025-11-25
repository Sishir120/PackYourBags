export const DebugTools = {
    render: (ctx, physics, track) => {
        ctx.save();
        ctx.lineWidth = 1;

        // Render Static Lines (Walls)
        ctx.strokeStyle = '#00ff00';
        physics.staticLines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.start.x, line.start.y);
            ctx.lineTo(line.end.x, line.end.y);
            ctx.stroke();
        });

        // Render Bodies (Marbles/Obstacles)
        physics.bodies.forEach(body => {
            ctx.beginPath();
            ctx.arc(body.position.x, body.position.y, body.radius, 0, Math.PI * 2);

            if (body.isStatic) {
                ctx.strokeStyle = '#ff0000';
            } else {
                ctx.strokeStyle = '#ffff00';
            }
            ctx.stroke();

            // Velocity Vector
            if (!body.isStatic) {
                ctx.beginPath();
                ctx.moveTo(body.position.x, body.position.y);
                ctx.lineTo(body.position.x + body.velocity.x * 0.1, body.position.y + body.velocity.y * 0.1);
                ctx.strokeStyle = '#00ffff';
                ctx.stroke();
            }
        });

        // Render Checkpoints
        ctx.strokeStyle = '#ff00ff';
        ctx.setLineDash([5, 5]);
        track.checkpoints.forEach(cp => {
            ctx.beginPath();
            ctx.moveTo(0, cp.y);
            ctx.lineTo(400, cp.y);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        ctx.restore();
    }
};
