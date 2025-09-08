'use client'

import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe/client'
import { useCartStore } from '@/stores/cart-store'
import { PaymentForm } from '@/components/checkout/payment-form'
import { SolanaPayForm } from '@/components/checkout/solana-pay-form'
import { useRouter } from 'next/navigation'
import { PaymentMethod } from '@/types/solana'

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe')
  const { items, getTotal, clearCart } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/')
      return
    }

    // Only create Payment Intent for Stripe payments
    if (paymentMethod === 'stripe') {
      const createPaymentIntent = async () => {
        try {
          const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: getTotal(),
              metadata: {
                item_count: items.length.toString(),
                total_amount: getTotal().toString(),
                order_summary: items.map(item => `${item.product.id}:${item.quantity}`).join(',').substring(0, 450)
              },
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Failed to create payment intent')
          }

          setClientSecret(data.clientSecret)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Payment setup failed')
        } finally {
          setLoading(false)
        }
      }

      createPaymentIntent()
    } else {
      // For Solana Pay, no server setup needed
      setLoading(false)
    }
  }, [items, getTotal, router, paymentMethod])

  const handlePaymentSuccess = (signature?: string) => {
    clearCart()
    // For Solana payments, we could store the signature for verification
    if (signature) {
      console.log('Solana transaction signature:', signature)
    }
    router.push('/checkout/success')
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Setting up payment...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    )
  }

  if (paymentMethod === 'stripe' && !clientSecret) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading payment form...</div>
      </div>
    )
  }

  const stripePromise = getStripe()

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-8">
            Complete Your Order
          </h1>

          {/* Order Summary */}
          <div className="mb-8 p-4 bg-gray-700/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-gray-300"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold text-white">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'stripe'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                  </svg>
                </div>
                <div className="text-white font-medium">Credit Card</div>
                <div className="text-gray-400 text-sm">Stripe • Instant</div>
              </button>

              <button
                onClick={() => setPaymentMethod('solana')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'solana'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.88 4.5c.2-.32.56-.5.94-.5h11.78c.83 0 1.28.93.78 1.58L18.12 8.5c-.2.32-.56.5-.94.5H5.4c-.83 0-1.28-.93-.78-1.58L7.88 4.5zM16.12 15.5c-.2.32-.56.5-.94.5H3.4c-.83 0-1.28.93-.78 1.58L5.88 20.5c.2.32.56.5.94.5h11.78c.83 0 1.28-.93.78-1.58l-3.26-2.92zM16.12 10.92c-.2-.32-.56-.5-.94-.5H3.4c-.83 0-1.28.93-.78 1.58L5.88 15c.2.32.56.5.94.5h11.78c.83 0 1.28-.93.78-1.58l-3.26-2.5z"/>
                  </svg>
                </div>
                <div className="text-white font-medium">Solana Pay</div>
                <div className="text-gray-400 text-sm">USDC • ~$0.0005 fee</div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'stripe' && clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#0070f3',
                    colorBackground: '#1f2937',
                    colorText: '#ffffff',
                    colorDanger: '#ef4444',
                    fontFamily: 'system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <PaymentForm
                onSuccess={() => handlePaymentSuccess()}
                onError={handlePaymentError}
              />
            </Elements>
          ) : paymentMethod === 'solana' ? (
            <SolanaPayForm
              amount={getTotal()}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          ) : null}

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
