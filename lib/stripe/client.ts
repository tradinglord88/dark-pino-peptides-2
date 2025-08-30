import { loadStripe } from '@stripe/stripe-js'

let stripePromise: Promise<import('@stripe/stripe-js').Stripe | null> | null =
  null

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      throw new Error(
        'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable'
      )
    }
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}
