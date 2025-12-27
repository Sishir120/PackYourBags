"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const STORIES = [
    {
        name: "Jessica M.",
        loss: "-12kg",
        time: "3 Months",
        quote: "The personalized macro planning changed everything. I never felt hungry.",
        avatar: "JM"
    },
    {
        name: "David K.",
        loss: "-18kg",
        time: "5 Months",
        quote: "The expert feedback on my metabolic logs kept me from stalling. Truly life-changing.",
        avatar: "DK"
    },
    {
        name: "Sarah L.",
        loss: "-8kg",
        time: "2 Months",
        quote: "I finally understood how to balance social life with my fitness goals.",
        avatar: "SL"
    }
];

export function SuccessStories() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest opacity-50">Community Wins</h3>
                <div className="flex gap-1 text-primary">
                    <Star size={10} fill="currentColor" />
                    <Star size={10} fill="currentColor" />
                    <Star size={10} fill="currentColor" />
                    <Star size={10} fill="currentColor" />
                    <Star size={10} fill="currentColor" />
                </div>
            </div>

            <div className="space-y-3">
                {STORIES.map((story, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-premium p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-all group"
                    >
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-[10px] text-primary border border-primary/20 shrink-0">
                                {story.avatar}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs tracking-tight">{story.name}</span>
                                    <span className="text-[9px] font-black py-0.5 px-1.5 bg-sage/20 text-sage rounded-full">{story.loss}</span>
                                </div>
                                <p className="text-[11px] text-foreground-muted leading-relaxed italic line-clamp-2">
                                    "{story.quote}"
                                </p>
                                <div className="text-[8px] font-bold text-foreground-muted uppercase tracking-widest opacity-40">
                                    Achieved in {story.time}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
