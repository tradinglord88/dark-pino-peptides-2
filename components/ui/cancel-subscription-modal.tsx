'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { UserSubscription, SubscriptionPlan } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils/format'

interface CancelSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: UserSubscription & { subscription_plans: SubscriptionPlan }
  onConfirmCancel: (subscriptionId: string) => Promise<void>
}

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onConfirmCancel
}: CancelSubscriptionModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  
  const expectedText = 'CANCEL'
  const canConfirm = confirmText === expectedText

  const handleConfirm = async () => {
    if (!canConfirm) return

    try {
      setIsConfirming(true)
      await onConfirmCancel(subscription.id)
      onClose()
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  const handleClose = () => {
    setConfirmText('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-red-400" size={24} />
            <h2 className="text-xl font-bold text-white">Cancel Subscription</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Subscription Details */}
        <div className="mb-6 p-4 bg-gray-700/30 rounded-lg">
          <h3 className="font-semibold text-white mb-2">{subscription.subscription_plans.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{subscription.subscription_plans.description}</p>
          <p className="text-lg font-bold text-white">
            {formatPrice(subscription.subscription_plans.price)}/{subscription.subscription_plans.billing_interval}
          </p>
        </div>

        {/* Warning Message */}
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h4 className="font-semibold text-red-400 mb-2">⚠️ Before you cancel:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Your subscription will remain active until {new Date(subscription.current_period_end).toLocaleDateString()}</li>
            <li>• You won&apos;t be charged for future billing periods</li>
            <li>• You can resubscribe at any time</li>
            <li>• This action cannot be undone</li>
          </ul>
        </div>

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Type <span className="font-bold text-red-400">CANCEL</span> to confirm cancellation:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder="Type CANCEL here"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            disabled={isConfirming}
          >
            Keep Subscription
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || isConfirming}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isConfirming ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Need help? Contact our support team instead of cancelling
          </p>
        </div>
      </div>
    </div>
  )
}