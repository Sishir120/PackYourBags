'use client';

import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-6 py-16 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-12">
                    <Logo size={48} />
                    <h1 className="text-4xl font-bold">Terms of Service</h1>
                </div>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Welcome to GlowUp Hub</h2>
                        <p className="text-foreground-muted leading-relaxed">
                            By using GlowUp Hub, you agree to these Terms of Service. Please read them carefully before using our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Use of Services</h2>
                        <p className="text-foreground-muted leading-relaxed">
                            GlowUp Hub provides self-care guidance and tracking tools. Our content is for informational purposes only and is not a substitute for professional medical advice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Account Responsibility</h2>
                        <p className="text-foreground-muted leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Subscription & Billing</h2>
                        <p className="text-foreground-muted leading-relaxed">
                            Premium subscriptions are billed according to your chosen plan. You may cancel anytime through your account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
                        <p className="text-foreground-muted leading-relaxed">
                            For questions about these Terms, contact us at support@glowuphub.com
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
