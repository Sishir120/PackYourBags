"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { format, subDays } from "date-fns";

// Generate mock history relative to a current weight
const generateData = (currentWeight: number | null | undefined) => {
    // Ensure we have a valid number to start with
    const baseWeight = typeof currentWeight === 'number' && !isNaN(currentWeight) ? currentWeight : 60;

    return Array.from({ length: 30 }).map((_, i) => {
        const date = subDays(new Date(), 29 - i);
        const diff = (29 - i) * 0.05;
        const fluctuation = Math.sin(i * 0.8) * 0.4 + (Math.random() * 0.2 - 0.1);

        let val = baseWeight + diff + fluctuation;

        if (i === 29) val = baseWeight;

        return {
            date: date.toISOString(),
            value: typeof val === 'number' && !isNaN(val) ? Number(val.toFixed(1)) : baseWeight,
        };
    });
};


interface TooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length && label) {
        return (
            <div className="glass-premium p-3 rounded-xl border border-white/10 shadow-xl" role="tooltip">
                <p className="text-xs text-foreground-muted mb-1">{format(new Date(label), "MMM d, yyyy")}</p>
                <p className="text-lg font-bold text-primary">
                    {typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : '0.0'} <span className="text-xs font-normal text-foreground-muted">kg</span>
                </p>
            </div>
        );
    }
    return null;
};

interface WeightChartProps {
    currentWeight?: number;
}

export function WeightChart({ currentWeight = 60 }: WeightChartProps) {
    const data = generateData(currentWeight);

    return (
        <div className="w-full h-[350px] relative group">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        tickFormatter={(str) => format(new Date(str), "d")}
                        stroke="var(--foreground-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        opacity={0.5}
                        dy={10}
                        interval={6}
                    />
                    <YAxis
                        stroke="var(--foreground-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        opacity={0.5}
                        domain={['dataMin - 1', 'dataMax + 1']}
                        dx={-5}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        fill="url(#colorWeight)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Overlay for added premium feel if data is empty or generic */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-medium text-primary">Live Trend</span>
                </div>
            </div>
        </div>
    );
}
