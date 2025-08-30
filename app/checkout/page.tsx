'use client'

import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe/client'
import { useCartStore } from '@/stores/cart-store'
import { PaymentForm } from '@/components/checkout/payment-form'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { items, getTotal, clearCart } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/')
      return
    }

    // Create Payment Intent
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
              order_items: JSON.stringify(
                items.map((item) => ({
                  product_id: item.product.id,
                  name: item.product.name,
                  quantity: item.quantity,
                  price: item.product.price,
                }))
              ),
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
  }, [items, getTotal, router])

  const handlePaymentSuccess = () => {
    clearCart()
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

  if (!clientSecret) {
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

          {/* Payment Form */}
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
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>

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
