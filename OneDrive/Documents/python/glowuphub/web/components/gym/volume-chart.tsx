'use client';
// Force rebuild

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface VolumeChartProps {
    id?: string;
}

export function VolumeChart({ id }: VolumeChartProps) {
    const [data, setData] = useState([
        { day: 'M', volume: 12000, color: 'bg-rose-400' },
        { day: 'T', volume: 14500, color: 'bg-violet-400' },
        { day: 'W', volume: 8000, color: 'bg-emerald-400' },
        { day: 'T', volume: 0, color: 'bg-slate-700' },
        { day: 'F', volume: 13200, color: 'bg-indigo-400' },
        { day: 'S', volume: 15100, color: 'bg-teal-400' },
        { day: 'S', volume: 4000, color: 'bg-orange-400' },
    ]);

    useEffect(() => {
        const handleFlood = () => {
            // Generate chaotic data
            const newData = data.map(d => ({
                ...d,
                volume: Math.floor(Math.random() * 30000)
            }));
            setData(newData);
        };

        window.addEventListener('chaos:flood-gym', handleFlood);
        return () => window.removeEventListener('chaos:flood-gym', handleFlood);
    }, [data]);

    const maxVol = Math.max(...data.map(d => d.volume));

    return (
        <div id={id} className="h-48 flex items-end justify-between gap-2 px-2">
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.volume / Math.max(maxVol, 1)) * 100}%` }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
                        className={`w-full max-w-[24px] rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity relative ${d.volume === 0 ? 'h-1 bg-white/5' : d.color}`}
                    >
                        {d.volume > 0 && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-10">
                                {d.volume.toLocaleString()} lbs
                            </div>
                        )}
                    </motion.div>
                    <span className="text-[10px] font-bold text-foreground-muted">{d.day}</span>
                </div>
            ))}
        </div>
    );
}
