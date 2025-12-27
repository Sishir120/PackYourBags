'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, User, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/fade-in';

export default function NervousSystemCalmPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                <img
                    src="/assets/blog/cortisol.png"
                    alt="Nervous System Calm"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                <div className="absolute top-6 left-6 z-10">
                    <Link
                        href="/#blog"
                        className="flex items-center gap-2 text-white/80 hover:text-white transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Journal
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 -mt-32 relative z-10">
                <FadeIn>
                    <div className="max-w-3xl mx-auto">
                        <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                            Wellness
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
                            The Science of Nervous System Calm
                        </h1>

                        <div className="flex items-center gap-6 text-foreground-muted text-sm mb-10">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                5 min read
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                GlowUp Team
                            </div>
                        </div>

                        {/* Article Body */}
                        <article className="prose prose-invert prose-lg max-w-none">
                            <p className="lead text-xl text-foreground/90 leading-relaxed">
                                Why breath regulation before your skincare routine makes everything more effective.
                                Your nervous system is the hidden key to radiance.
                            </p>

                            <h2>The Hidden Connection</h2>
                            <p>
                                Have you ever noticed how stress shows up on your face? Dark circles, breakouts,
                                dull skin — these aren't just surface issues. They're signals from your nervous
                                system telling you something's out of balance.
                            </p>
                            <p>
                                When we're in a state of chronic stress, our bodies prioritize survival over
                                repair. Blood flow decreases to the skin, collagen production slows, and
                                inflammation increases. No amount of serums can fully counteract this.
                            </p>

                            <h2>Why Breath Comes First</h2>
                            <p>
                                Starting your routine with just 60 seconds of intentional breathing shifts your
                                nervous system from sympathetic (fight-or-flight) to parasympathetic (rest-and-digest)
                                mode. This simple act:
                            </p>
                            <ul>
                                <li>Increases blood flow to your skin by up to 40%</li>
                                <li>Reduces cortisol levels that break down collagen</li>
                                <li>Opens your lymphatic pathways for better drainage</li>
                                <li>Helps your skin actually <em>absorb</em> what you're applying</li>
                            </ul>

                            <h2>The 4-7-8 Technique</h2>
                            <p>
                                Before you reach for any products, try this: breathe in for 4 counts,
                                hold for 7 counts, exhale slowly for 8 counts. Repeat three times.
                            </p>
                            <p>
                                This pattern activates your vagus nerve — the superhighway between your
                                brain and body that controls relaxation. Studies show this technique can
                                lower heart rate and blood pressure within minutes.
                            </p>

                            <h2>Building the Habit</h2>
                            <p>
                                The beauty of combining breath work with skincare is that you're anchoring
                                a new habit to an existing one. You already wash your face every morning.
                                Now you're just adding 60 seconds of intention beforehand.
                            </p>
                            <p>
                                Over time, this compounds. After 21 days, your nervous system begins to
                                anticipate relaxation during your routine. Your skin starts to change not
                                just from products, but from a fundamentally calmer state of being.
                            </p>

                            <blockquote className="border-l-4 border-primary pl-6 italic text-foreground/80">
                                "True radiance isn't about perfection. It's about presence. When you're calm,
                                you glow differently."
                            </blockquote>

                            <h2>Your Practice</h2>
                            <p>
                                This week, commit to the 4-7-8 breath before every skincare session.
                                Notice how your face feels different — softer, more receptive, more alive.
                                That's your nervous system doing what it was designed to do: heal you from
                                the inside out.
                            </p>
                        </article>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
                            <button className="flex items-center gap-2 text-foreground-muted hover:text-primary transition">
                                <Heart className="w-5 h-5" />
                                Save for later
                            </button>
                            <button className="flex items-center gap-2 text-foreground-muted hover:text-primary transition">
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>
                        </div>

                        {/* Related */}
                        <div className="mt-16 mb-20">
                            <h3 className="text-xl font-bold text-foreground mb-6">Continue Reading</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Link
                                    href="/blog/building-consistency"
                                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition group"
                                >
                                    <span className="text-xs text-primary font-semibold uppercase">Practices</span>
                                    <h4 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition">
                                        Building Consistency with Compassion
                                    </h4>
                                </Link>
                                <Link
                                    href="/blog/eating-for-radiance"
                                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition group"
                                >
                                    <span className="text-xs text-primary font-semibold uppercase">Nourishment</span>
                                    <h4 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition">
                                        Eating for Radiance, Not Restriction
                                    </h4>
                                </Link>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
