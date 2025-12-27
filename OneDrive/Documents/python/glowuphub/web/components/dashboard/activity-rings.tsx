"use client";

interface ActivityRingsProps {
    move: number; // Percentage 0-100
    glow: number; // Percentage 0-100 (Self-care)
    mind: number; // Percentage 0-100 (Mindfulness)
    size?: number;
}

export function ActivityRings({ move, glow, mind, size = 300 }: ActivityRingsProps) {
    const center = size / 2;
    const strokeWidth = size * 0.12;
    const gap = size * 0.04;

    const r1 = size / 2 - strokeWidth / 2;
    const r2 = r1 - strokeWidth - gap;
    const r3 = r2 - strokeWidth - gap;

    const c1 = 2 * Math.PI * r1;
    const c2 = 2 * Math.PI * r2;
    const c3 = 2 * Math.PI * r3;

    const o1 = c1 - (move / 100) * c1;
    const o2 = c2 - (glow / 100) * c2;
    const o3 = c3 - (mind / 100) * c3;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Ring 1 - Move (Outer) - Rose */}
                <circle cx={center} cy={center} r={r1} stroke="#2A2A2A" strokeWidth={strokeWidth} fill="transparent" />
                <circle
                    cx={center}
                    cy={center}
                    r={r1}
                    stroke="#E11D48"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={c1}
                    strokeDashoffset={o1}
                    strokeLinecap="round"
                />

                {/* Ring 2 - Glow (Middle) - Lime */}
                <circle cx={center} cy={center} r={r2} stroke="#2A2A2A" strokeWidth={strokeWidth} fill="transparent" />
                <circle
                    cx={center}
                    cy={center}
                    r={r2}
                    stroke="#DFFF00"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={c2}
                    strokeDashoffset={o2}
                    strokeLinecap="round"
                />

                {/* Ring 3 - Mind (Inner) - Cyan */}
                <circle cx={center} cy={center} r={r3} stroke="#2A2A2A" strokeWidth={strokeWidth} fill="transparent" />
                <circle
                    cx={center}
                    cy={center}
                    r={r3}
                    stroke="#06B6D4"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={c3}
                    strokeDashoffset={o3}
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}
