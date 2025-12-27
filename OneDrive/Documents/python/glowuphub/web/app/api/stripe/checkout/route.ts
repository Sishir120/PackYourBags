import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // You should create a Product in your Stripe Dashboard and get the Price ID
        // For Development, you can use a test Price ID
        const priceId = process.env.STRIPE_PRICE_ID;

        if (!priceId) {
            return new NextResponse('Stripe Price ID not configured', { status: 500 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer_email: session.user.email,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
            metadata: {
                userId: session.user.id || '',
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error('[STRIPE_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
