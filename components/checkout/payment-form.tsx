'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'

interface PaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
  onPaymentStart?: () => Promise<any>
}

export function PaymentForm({ onSuccess, onError, onPaymentStart }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      // Create order in database first if callback provided
      if (onPaymentStart) {
        await onPaymentStart()
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      })

      if (error) {
        onError(error.message || 'An unexpected error occurred.')
      } else {
        // Payment succeeded - this should not normally be reached
        // because the user will be redirected to the success page
        onSuccess()
      }
    } catch {
      onError('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Shipping Address</h3>
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
          <AddressElement
            options={{
              mode: 'shipping',
            }}
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Payment Information</h3>
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-12 text-lg font-semibold"
      >
        {isProcessing ? 'Processing...' : 'Complete Payment'}
      </Button>
    </form>
  )
}
