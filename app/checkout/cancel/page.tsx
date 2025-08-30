'use client'

import { useRouter } from 'next/navigation'
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-center">
          {/* Cancel Icon */}
          <div className="mb-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Cancelled
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/checkout')}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Checkout
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Having trouble with checkout? Contact our support team for
              assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
