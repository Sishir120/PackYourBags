import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

let stripePromise = null

if (stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey)
} else {
    console.warn('⚠️ Stripe publishable key not found. Payment features disabled.')
}

/**
 * Create a Stripe checkout session for a destination booking
 * @param {Object} destination - The destination object
 * @param {Object} options - Booking options (dates, travelers, etc.)
 */
export const createCheckoutSession = async (destination, options = {}) => {
    if (!stripePromise) {
        throw new Error('Stripe is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment.')
    }

    const stripe = await stripePromise

    // TODO: In production, call your backend API to create a checkout session
    // For now, this is a placeholder that redirects to Stripe Checkout
    // You'll need to set up Stripe Products and Prices in your dashboard

    const { error } = await stripe.redirectToCheckout({
        lineItems: [{
            // You'll need to create prices in Stripe Dashboard and add price IDs to destinations
            price: destination.stripe_price_id || 'price_placeholder',
            quantity: options.travelers || 1
        }],
        mode: 'payment',
        successUrl: `${window.location.origin}/booking-success?destination=${destination.destination_id}`,
        cancelUrl: `${window.location.origin}/destination/${destination.destination_id}`,
        customerEmail: options.email || undefined
    })

    if (error) {
        console.error('Stripe checkout error:', error)
        throw error
    }
}

/**
 * Check if Stripe is configured
 */
export const isStripeConfigured = () => Boolean(stripePromise)

/**
 * Get Stripe instance (for advanced usage)
 */
export const getStripe = () => stripePromise
