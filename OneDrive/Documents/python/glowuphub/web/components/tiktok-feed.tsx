"use client";

import { motion } from "framer-motion";
import { Play, Image as ImageIcon, ExternalLink } from "lucide-react";
import Image from "next/image";

const TIKTOK_CONTENT = [
    {
        type: "photo",
        url: "https://www.tiktok.com/@sabu7916/photo/7464574005240990984?_r=1&_t=ZS-92VOYJq3NM9",
        label: "Transformation Journey",
        views: "1.2k"
    },
    {
        type: "video",
        url: "https://www.tiktok.com/@sabu7916/video/7546135833099635975?_r=1&_t=ZS-92VOYJq3NM9",
        label: "Daily Routine Tips",
        views: "856"
    },
    {
        type: "video",
        url: "https://www.tiktok.com/@sabu7916/video/7533972597055212807?_r=1&_t=ZS-92VOYJq3NM9",
        label: "Nutrition Advice",
        views: "2.1k"
    },
    {
        type: "photo",
        url: "https://www.tiktok.com/@sabu7916/photo/7532817321866398983?_r=1&_t=ZS-92VOYJq3NM9",
        label: "Client Success",
        views: "945"
    },
    {
        type: "video",
        url: "https://www.tiktok.com/@sabu7916/video/7520222837257374994?_r=1&_t=ZS-92VOYJq3NM9",
        label: "Healthy Habits",
        views: "1.5k"
    }
];

export function TikTokFeed() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {TIKTOK_CONTENT.map((item, i) => (
                <motion.a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative aspect-[3/4] bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
                >
                    {/* Background Gradient Placeholder since we can't fetch thumbnails dynamically */}
                    <div className="absolute inset-0 bg-gradient-to-br from-card to-secondary/30 group-hover:scale-105 transition-transform duration-500" />

                    {/* Icon Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-primary/40 group-hover:text-primary transition-colors">
                        {item.type === 'video' ? (
                            <Play className="w-8 h-8 fill-current" />
                        ) : (
                            <ImageIcon className="w-8 h-8" />
                        )}
                    </div>

                    {/* Content Info */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-0.5">
                            {item.type}
                        </p>
                        <p className="text-xs text-white font-medium truncate">
                            {item.label}
                        </p>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="px-3 py-1.5 bg-white/10 text-white rounded-full text-xs font-bold border border-white/20 flex items-center gap-1.5 backdrop-blur-md">
                            Open TikTok <ExternalLink className="w-3 h-3" />
                        </div>
                    </div>
                </motion.a>
            ))}
        </div>
    );
}
