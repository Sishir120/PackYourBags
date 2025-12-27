import * as Sentry from "@sentry/nextjs";

// ... (imports)

export async function POST(req: Request) {
    // ...
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.error('[STRIPE] Signature verification failed:', error);
        Sentry.captureException(error, { tags: { source: 'stripe_webhook', type: 'signature_verification' } });
        return new NextResponse('Webhook Error', { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        // ...
        if (!session?.metadata?.userId && !session?.customer_email) {
            const error = new Error('Missing user identifier in Stripe session');
            console.error('[STRIPE]', error.message);
            Sentry.captureException(error, { extra: { session } });
            return new NextResponse('Webhook Error: No User ID or Email', { status: 400 });
        }

        try {
            // ... (db logic)
            if (!user) {
                const error = new Error(`User not found for email: ${session.customer_email}`);
                console.error('[STRIPE]', error.message);
                Sentry.captureException(error);
                return new NextResponse('User not found', { status: 404 });
            }
            // ...
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
            // ...
        } catch (error) {
            console.error('[STRIPE] Update error:', error);
            Sentry.captureException(error, { tags: { source: 'stripe_webhook', action: 'update_subscription' } });
            return new NextResponse('Database error', { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
