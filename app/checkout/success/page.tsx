'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null)

  useEffect(() => {
    // Get payment intent from URL parameters (set by Stripe redirect)
    const paymentIntentId = searchParams.get('payment_intent')
    if (paymentIntentId) {
      setPaymentIntent(paymentIntentId)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            Thank you for your order. Your payment has been processed
            successfully.
          </p>

          {/* Payment Details */}
          {paymentIntent && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-400">Payment ID:</p>
              <p className="text-white font-mono text-sm break-all">
                {paymentIntent}
              </p>
            </div>
          )}

          {/* What's Next */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3 text-gray-300">
              <Mail className="h-5 w-5 text-blue-400" />
              <span>You&apos;ll receive a confirmation email shortly</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-300">
              <Package className="h-5 w-5 text-blue-400" />
              <span>Your order will be processed and shipped soon</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Continue Shopping
            </Button>

            {/* Future: Add order tracking link when implemented */}
            {/* 
            <Button
              onClick={() => router.push('/orders')}
              variant="outline"
              className="w-full"
            >
              View Order Details
            </Button>
            */}
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Questions about your order? Contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
