import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// This is required for Next.js App Router to accept raw body
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        return new NextResponse('Webhook Error', { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId && !session?.customer_email) {
            console.error('[STRIPE] Missing user identifier');
            return new NextResponse('Webhook Error: No User ID or Email', { status: 400 });
        }

        try {
            // Find user by email or metadata userId
            const user = await prisma.user.findFirst({
                where: session.metadata?.userId
                    ? { id: session.metadata.userId }
                    : { email: session.customer_email! }
            });

            if (!user) {
                console.error('[STRIPE] User not found:', session.customer_email);
                return new NextResponse('User not found', { status: 404 });
            }

            // Create or update subscription
            await prisma.subscription.upsert({
                where: { userId: user.id },
                create: {
                    userId: user.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0].price.id,
                    status: subscription.status,
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                },
                update: {
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0].price.id,
                    status: subscription.status,
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                },
            });

            console.log(`[STRIPE] Subscription created/updated for ${user.email}`);
        } catch (error) {
            console.error('[STRIPE] Database error:', error);
            return new NextResponse('Database error', { status: 500 });
        }
    }

    if (event.type === 'customer.subscription.updated' ||
        event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;

        try {
            await prisma.subscription.updateMany({
                where: { stripeCustomerId: subscription.customer as string },
                data: {
                    status: subscription.status,
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                },
            });

            console.log(`[STRIPE] Subscription ${subscription.status} for ${subscription.customer}`);
        } catch (error) {
            console.error('[STRIPE] Update error:', error);
            return new NextResponse('Database error', { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
