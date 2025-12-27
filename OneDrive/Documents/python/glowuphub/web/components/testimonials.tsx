"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const TESTIMONIALS_DATA = [
    {
        url: "https://www.tiktok.com/@sabu7916/photo/7464574005240990984?_r=1&_t=ZS-92VOYJq3NM9",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop",
        caption: "20kg weight loss transformation",
        name: "Priya S.",
        type: "photo"
    },
    {
        url: "https://www.tiktok.com/@sabu7916/video/7546135833099635975?_r=1&_t=ZS-92VOYJq3NM9",
        image: "https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?w=800&h=1200&fit=crop",
        caption: "Morning routine transformations",
        name: "Sarah K.",
        type: "video"
    },
    {
        url: "https://www.tiktok.com/@sabu7916/video/7533972597055212807?_r=1&_t=ZS-92VOYJq3NM9",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=1200&fit=crop",
        caption: "Sustainable nutrition journey",
        name: "Anjali M.",
        type: "video"
    },
    {
        url: "https://www.tiktok.com/@sabu7916/photo/7532817321866398983?_r=1&_t=ZS-92VOYJq3NM9",
        image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=1200&fit=crop",
        caption: "15kg transformation story",
        name: "Meera R.",
        type: "photo"
    },
    {
        url: "https://www.tiktok.com/@sabu7916/video/7520222837257374994?_r=1&_t=ZS-92VOYJq3NM9",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=1200&fit=crop",
        caption: "Healthy habits for life",
        name: "Davina L.",
        type: "video"
    }
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-background border-y border-border overflow-hidden">
            <div className="container mx-auto px-6 mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Real Stories, <span className="text-primary italic">Real Results</span>
                    </h2>
                    <p className="text-foreground-muted max-w-2xl mx-auto mb-8">
                        Real weight loss journeys from our community. Follow Sabita's latest updates
                        and see how women are achieving sustainable transformations.
                    </p>
                </motion.div>

                {/* Transformation Grid - Mobile Carousel / Desktop Grid */}
                <div className="
                    flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-6 px-6 
                    md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:overflow-visible md:pb-0 md:mx-0 md:px-0
                    scrollbar-hide
                ">
                    {TESTIMONIALS_DATA.map((item, index) => (
                        <motion.a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="
                                flex-none w-[85vw] sm:w-[350px] snap-center 
                                md:w-auto
                                group relative aspect-[3/4] bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-lg hover:scale-[1.02]
                            "
                        >
                            {/* Image */}
                            <div className="relative w-full h-full">
                                <Image
                                    src={item.image}
                                    alt={item.caption}
                                    fill
                                    sizes="(max-width: 768px) 85vw, 20vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Type Badge */}
                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                                    {item.type === 'video' ? (
                                        <Play className="w-3 h-3 text-white fill-white" />
                                    ) : (
                                        <span className="text-[10px] text-white font-bold">PHOTO</span>
                                    )}
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* Content */}
                                <div className="absolute bottom-0 inset-x-0 p-6 md:p-4">
                                    <p className="text-white text-lg md:text-sm font-semibold mb-1 line-clamp-2">
                                        {item.caption}
                                    </p>
                                    <p className="text-white/80 text-sm md:text-xs font-medium mb-2">
                                        — {item.name}
                                    </p>
                                    <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                                        <span className="text-xs font-bold">View on TikTok</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full h-12 px-8 gap-2 group"
                        onClick={() => window.open('https://www.tiktok.com/@sabu7916', '_blank')}
                    >
                        Follow Sabita on TikTok <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
}

