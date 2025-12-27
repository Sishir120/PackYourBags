"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Heart } from "lucide-react";

// Using proven, reliable image URLs that work consistently
const TRANSFORMATIONS = [
    {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        caption: "Trust the process. 20kg down and feeling stronger than ever.",
        author: "Priya S."
    },
    {
        url: "https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c",
        caption: "From struggling to walk up stairs to running 5k.",
        author: "Anjali M."
    },
    {
        url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        caption: "Healing my relationship with food was the first step.",
        author: "Sarah K."
    },
    {
        url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8",
        caption: "Consistent habits over intensity.",
        author: "Meera R."
    },
    {
        url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
        caption: "Finally feeling like me again.",
        author: "Davina L."
    },
    {
        url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        caption: "Nourishing my body, not punishing it.",
        author: "Suman T."
    },
    {
        url: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7",
        caption: "Small changes led to big results.",
        author: "Kavita P."
    },
    {
        url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        caption: "Learning to love the journey.",
        author: "Riya M."
    }
];

export function TransformationGallery() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Transformation <span className="text-primary italic">Gallery</span>
                    </h1>
                    <p className="text-foreground-muted max-w-2xl mx-auto text-lg">
                        Real people. Real results. Snapshot proof that sustainable habits lead to lasting change.
                    </p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {TRANSFORMATIONS.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="break-inside-avoid"
                        >
                            <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all shadow-sm group">
                                <div className="relative aspect-[3/4] w-full">
                                    <Image
                                        src={item.url}
                                        alt={item.caption}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        priority={i < 4}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-6">
                                    <div className="flex gap-2 mb-3">
                                        <Heart className="w-4 h-4 text-primary fill-current" />
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Success Story</span>
                                    </div>
                                    <p className="text-foreground text-sm italic mb-4 leading-relaxed">
                                        "{item.caption}"
                                    </p>
                                    <p className="text-xs font-bold text-foreground-muted uppercase tracking-widest">
                                        — {item.author}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
