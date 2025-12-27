'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, User, Heart, Share2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export default function BuildingConsistencyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                <img
                    src="/assets/blog/habits.png"
                    alt="Building Consistency"
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
                            Practices
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
                            Building Consistency with Compassion
                        </h1>

                        <div className="flex items-center gap-6 text-foreground-muted text-sm mb-10">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                3 min read
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                GlowUp Team
                            </div>
                        </div>

                        {/* Article Body */}
                        <article className="prose prose-invert prose-lg max-w-none">
                            <p className="lead text-xl text-foreground/90 leading-relaxed">
                                How small daily practices compound into lasting confidence — without obsession.
                                The secret isn't discipline. It's kindness.
                            </p>

                            <h2>The Myth of Motivation</h2>
                            <p>
                                We've been sold a lie: that transformation requires iron willpower and relentless
                                hustle. But research shows the opposite. The people who maintain habits long-term
                                aren't more disciplined — they're more forgiving with themselves.
                            </p>

                            <h2>The 2-Minute Rule</h2>
                            <p>
                                Instead of committing to an hour of self-care, start with two minutes. That's it.
                                Two minutes of face massage. Two minutes of stretching. Two minutes of journaling.
                            </p>
                            <p>
                                This works because it bypasses your brain's resistance to change. Two minutes feels
                                so small that it's almost embarrassing not to do it. And once you start, you often
                                continue longer — but that's a bonus, not the goal.
                            </p>

                            <h2>The Power of "Good Enough"</h2>
                            <p>
                                Perfectionism is the enemy of consistency. When you set impossibly high standards,
                                you create a pass/fail system where anything less than perfect feels like failure.
                            </p>
                            <ul>
                                <li>Didn't do your full routine? Washing your face still counts.</li>
                                <li>Missed a day? Starting again tomorrow isn't starting over.</li>
                                <li>Feeling unmotivated? Showing up at 50% is infinitely better than 0%.</li>
                            </ul>

                            <h2>Streaks Are Not the Goal</h2>
                            <p>
                                Breaking a streak can feel devastating when you've attached your self-worth to it.
                                That's why we reframe: a practice is not a chain to maintain, but a garden to tend.
                            </p>
                            <p>
                                Some days you water deeply. Some days you just glance at it and appreciate its
                                existence. The garden doesn't die from one missed day — it dies from abandonment.
                            </p>

                            <blockquote className="border-l-4 border-primary pl-6 italic text-foreground/80">
                                "Consistency isn't about never falling. It's about always getting back up —
                                gently, without drama."
                            </blockquote>

                            <h2>Building Your Identity</h2>
                            <p>
                                The real shift happens when practices become part of who you are — not what
                                you do. You're not "trying to be healthier." You're "someone who takes care
                                of herself."
                            </p>
                            <p>
                                Every small action reinforces this identity. Even one minute of intentional
                                self-care whispers to your brain: "I am worth caring for."
                            </p>

                            <h2>Your Practice</h2>
                            <p>
                                This week, choose one tiny practice. Make it so small you could do it in the
                                middle of a crisis. Then do it daily — not because you have to, but because
                                you're building a relationship with yourself.
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
                                    href="/blog/nervous-system-calm"
                                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition group"
                                >
                                    <span className="text-xs text-primary font-semibold uppercase">Wellness</span>
                                    <h4 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition">
                                        The Science of Nervous System Calm
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
