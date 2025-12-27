'use client';

import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-6 py-16 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-12">
                    <Logo size={48} />
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                </div>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Your Privacy Matters</h2>
                        <p className="text-foreground-muted leading-relaxed">
                            At GlowUp Hub, we believe your self-care journey is deeply personal. This Privacy Policy explains how we collect, use, and protect your information when you use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                        <ul className="text-foreground-muted space-y-2 list-disc list-inside">
                            <li>Account information (email, name)</li>
                            <li>Usage data (practices completed, progress)</li>
                            <li>Device information for app optimization</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Data</h2>
                        <p className="text-foreground-muted leading-relaxed">
                            We use your information to personalize your experience, track your progress, and improve our services. We never sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
                        <p className="text-foreground-muted leading-relaxed">
                            We employ industry-standard security measures to protect your data. Your reflections and photos remain private and are never shared without your explicit consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                        <p className="text-foreground-muted leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at privacy@glowuphub.com
                        </p>
                    </section>

                    <p className="text-foreground-muted text-sm pt-8 border-t border-border">
                        Last updated: December 2024
                    </p>
                </div>
            </div>
        </div>
    );
}
