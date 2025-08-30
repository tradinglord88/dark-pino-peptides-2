import Stripe from 'stripe'

// Only initialize Stripe in runtime, not during build
const createStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    // During build time, environment variables might not be available
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    // Return a mock during build
    return null as unknown as Stripe
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
  })
}

export const stripe = createStripe()
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

export default stripe
