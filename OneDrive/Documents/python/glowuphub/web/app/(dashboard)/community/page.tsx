"use client";

import { motion } from "framer-motion";
import { Users, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

const stories = [
    {
        id: 1,
        name: "Priya K.",
        title: "Lost 15kg without giving up Rice",
        story: "I always thought I had to starve to lose weight. Sabita taught me how to balance my meals. I eat biryani on Sundays guilt-free!",
        image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=3087&auto=format&fit=crop",
        tags: ["Weight Loss", "Sustainable"],
    },
    {
        id: 2,
        name: "Anjali M.",
        title: "My PCOD Symptoms Disappeared",
        story: "Irregular periods and acne were ruining my confidence. With the seed cycling and gentle nutrition plan, my hormones are finally balanced.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3088&auto=format&fit=crop",
        tags: ["PCOD", "Hormonal Health"],
    },
    {
        id: 3,
        name: "Suman T.",
        title: "More Energy for my Kids",
        story: "I used to be exhausted by 2 PM. Now I have the energy to play with my children after work. The lifestyle changes were small but powerful.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3088&auto=format&fit=crop",
        tags: ["Energy", "Lifestyle"],
    },
];

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border py-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Community <span className="text-primary italic">Success Stories</span>
                    </h1>
                    <p className="text-foreground-muted max-w-2xl mx-auto">
                        Real women, real struggles, and real victories. Join our supportive community
                        and share your journey.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                {/* Featured Story */}
                <div className="mb-16">
                    <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-3xl overflow-hidden shadow-sm border border-border">
                        <div className="relative h-64 md:h-full min-h-[400px]">
                            <Image
                                src="https://images.unsplash.com/photo-1560963689-02e70246bb4b?q=80&w=3000&auto=format&fit=crop"
                                alt="Community Hero"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-8 md:p-12">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 inline-block">
                                Featured Journey
                            </span>
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                "Self-love is the first step to healing"
                            </h2>
                            <p className="text-foreground-muted text-lg leading-relaxed mb-6">
                                Join over 5,000 women who have transformed not just their bodies, but their
                                mindsets. Our specific approach focuses on what you GAIN (energy, confidence, health)
                                rather than what you lose.
                            </p>
                            <div className="flex gap-6 text-foreground-muted">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    <span>5k+ Members</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-primary" />
                                    <span>Supportive</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Stories Grid */}
                <h3 className="text-2xl font-bold text-foreground mb-8">Latest Inspirations</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col hover:border-primary/30 transition-colors"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={story.image}
                                    alt={story.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex gap-2 mb-3">
                                    {story.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/5 px-2 py-1 rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-2">{story.title}</h4>
                                <p className="text-foreground-muted text-sm leading-relaxed mb-4 flex-1">
                                    "{story.story}"
                                </p>
                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                        {story.name[0]}
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">{story.name}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
