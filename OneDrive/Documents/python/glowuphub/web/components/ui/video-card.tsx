"use client";

import { Play, Zap } from "lucide-react";
import Image from "next/image";

interface VideoCardProps {
    thumbnail: string;
    title: string;
    views: string;
    onClick?: () => void;
}

export function VideoCard({ thumbnail, title, views, onClick }: VideoCardProps) {
    return (
        <div
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black cursor-pointer shadow-lg hover:shadow-xl transition-all"
            onClick={onClick}
        >
            <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
            />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white/90 font-medium">{views} views</span>
                </div>
                <p className="text-sm font-semibold text-white line-clamp-2 leading-tight">
                    {title}
                </p>
            </div>
        </div>
    );
}
