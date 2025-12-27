"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const posts = [
    {
        slug: "nervous-system-calm",
        category: "Wellness",
        title: "The Science of Nervous System Calm",
        excerpt: "Why breath regulation before your skincare routine makes everything more effective. Learn the biological connection between stress and skin health.",
        readTime: "5 min read",
        image: "/assets/blog/cortisol.png",
        date: "Dec 12, 2024"
    },
    {
        slug: "building-consistency",
        category: "Practices",
        title: "Building Consistency with Compassion",
        excerpt: "How small daily practices compound into lasting confidence — without obsession. A guide to sustainable habit formation.",
        readTime: "3 min read",
        image: "/assets/blog/habits.png",
        date: "Dec 18, 2024"
    },
    {
        slug: "eating-for-radiance",
        category: "Nourishment",
        title: "Eating for Radiance, Not Restriction",
        excerpt: "Gentle nutrition that supports your glow from the inside out. Discover key nutrients for vitality and skin resilience.",
        readTime: "7 min read",
        image: "/assets/blog/nutrition.png",
        date: "Dec 22, 2024"
    }
];

export default function BlogIndexPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <FadeIn>
                        <Link href="/" className="inline-flex items-center text-foreground-muted hover:text-primary mb-8 transition-colors">
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Home
                        </Link>

                        <div className="max-w-3xl mb-16">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                                The GlowUp <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sage">Journal</span>
                            </h1>
                            <p className="text-xl text-foreground-muted leading-relaxed">
                                Science-backed insights, wellness practices, and gentle wisdom to support your journey towards radiance and vitality.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <FadeIn key={post.slug} delay={index * 0.1}>
                                <Link href={`/blog/${post.slug}`} className="group block h-full">
                                    <div className="bg-card border border-border rounded-3xl overflow-hidden h-full hover:border-primary/30 transition-all duration-300 flex flex-col">
                                        {/* Image */}
                                        <div className="h-64 relative overflow-hidden bg-primary-soft">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-60" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 md:p-8 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-1 rounded-full">
                                                    {post.category}
                                                </span>
                                                <span className="text-xs text-foreground-muted">{post.readTime}</span>
                                            </div>

                                            <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                                                {post.title}
                                            </h2>

                                            <p className="text-foreground-muted text-sm leading-relaxed mb-6 flex-1">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center text-xs font-medium text-foreground-muted pt-4 border-t border-border">
                                                <span>{post.date}</span>
                                                <span className="mx-2">•</span>
                                                <span className="group-hover:translate-x-1 transition-transform inline-block text-primary">Read Article →</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <div className="mt-auto">
                <Footer />
            </div>
        </main>
    );
}
