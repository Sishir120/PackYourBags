import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error('[STRIPE] Signature verification failed:', error);
        Sentry.captureException(error, { tags: { source: 'stripe_webhook', type: 'signature_verification' } });
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        ) as Stripe.Subscription;

        if (!session?.metadata?.userId && !session?.customer_email) {
            const error = new Error('Missing user identifier in Stripe session');
            console.error('[STRIPE]', error.message);
            Sentry.captureException(error, { extra: { session } });
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
                const error = new Error(`User not found for email: ${session.customer_email}`);
                console.error('[STRIPE]', error.message);
                Sentry.captureException(error);
                return new NextResponse('User not found', { status: 404 });
            }

            await prisma.subscription.upsert({
                where: {
                    userId: user.id,
                },
                create: {
                    userId: user.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0].price.id,
                    status: subscription.status,
                    currentPeriodEnd: new Date(
                        (subscription as any).current_period_end * 1000
                    ),
                },
                update: {
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0].price.id,
                    status: subscription.status,
                    currentPeriodEnd: new Date(
                        (subscription as any).current_period_end * 1000
                    ),
                },
            });

            console.log(`[STRIPE] Subscription created/updated for ${user.email}`);
        } catch (error) {
            console.error('[STRIPE] Database error:', error);
            Sentry.captureException(error, { tags: { source: 'stripe_webhook', action: 'create_subscription' } });
            return new NextResponse('Database error', { status: 500 });
        }
    }

    if (event.type === 'customer.subscription.updated' ||
        event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;

        try {
            await prisma.subscription.updateMany({
                where: {
                    stripeCustomerId: (subscription as Stripe.Subscription).customer as string,
                },
                data: {
                    status: (subscription as Stripe.Subscription).status,
                    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                },
            });
            console.log(`[STRIPE] Subscription ${subscription.status} for ${subscription.customer}`);
        } catch (error) {
            console.error('[STRIPE] Update error:', error);
            Sentry.captureException(error, { tags: { source: 'stripe_webhook', action: 'update_subscription' } });
            return new NextResponse('Database error', { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
