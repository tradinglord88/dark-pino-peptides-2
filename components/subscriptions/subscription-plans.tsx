'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, RefreshCw, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { SubscriptionPlan } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils/format'
import { useAuthStore } from '@/stores/auth-store'

export function SubscriptionPlans() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingSubscription, setCreatingSubscription] = useState<string | null>(null)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('billing_interval')
        .order('product_count')

      if (error) {
        console.error('Error loading subscription plans:', error)
        return
      }

      setPlans(data || [])
    } catch (error) {
      console.error('Error in loadPlans:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBillingIntervalColor = (interval: string) => {
    switch (interval) {
      case 'monthly':
        return 'text-blue-400 bg-blue-400/20'
      case 'quarterly':
        return 'text-green-400 bg-green-400/20'
      case 'yearly':
        return 'text-purple-400 bg-purple-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getPlanFeatures = (plan: SubscriptionPlan) => [
    `${plan.product_count} premium peptide${plan.product_count > 1 ? 's' : ''} per delivery`,
    `${plan.discount_percentage}% discount off regular prices`,
    'Free shipping on all deliveries',
    'Skip or pause anytime',
    'Premium customer support',
    plan.trial_days > 0 ? `${plan.trial_days}-day free trial` : 'No commitment required'
  ]

  const handleStartSubscription = async (plan: SubscriptionPlan) => {
    if (!user) {
      router.push('/auth')
      return
    }

    try {
      setCreatingSubscription(plan.id)

      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          plan_id: plan.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      // Redirect to account page to see the new subscription
      router.push('/account')
    } catch (error) {
      console.error('Error creating subscription:', error)
      alert('Failed to create subscription. Please try again.')
    } finally {
      setCreatingSubscription(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading subscription plans...</p>
      </div>
    )
  }

  const monthlyPlans = plans.filter(p => p.billing_interval === 'monthly')
  const quarterlyPlans = plans.filter(p => p.billing_interval === 'quarterly')

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Subscription Plans</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Get premium research peptides delivered monthly with significant savings and convenience.
        </p>
      </div>

      {/* Monthly Plans */}
      {monthlyPlans.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Monthly Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyPlans.map((plan) => (
              <div key={plan.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">{formatPrice(plan.price)}</span>
                    <span className="text-gray-400">/{plan.billing_interval}</span>
                  </div>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBillingIntervalColor(plan.billing_interval)}`}>
                    {plan.discount_percentage}% savings
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {getPlanFeatures(plan).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="text-green-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleStartSubscription(plan)}
                  disabled={creatingSubscription === plan.id}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {creatingSubscription === plan.id ? 'Creating...' : user ? 'Start Subscription' : 'Sign In to Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quarterly Plans */}
      {quarterlyPlans.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <RefreshCw className="mr-2" size={20} />
            Quarterly Plans
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">Best Value</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quarterlyPlans.map((plan) => (
              <div key={plan.id} className="bg-gray-800/50 rounded-lg p-6 border-2 border-green-500/50 hover:border-green-400 transition-all duration-300 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                    Popular Choice
                  </span>
                </div>
                
                <div className="text-center mb-6 mt-2">
                  <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">{formatPrice(plan.price)}</span>
                    <span className="text-gray-400">/{plan.billing_interval}</span>
                    <div className="text-sm text-green-400 mt-1">
                      Only {formatPrice(plan.price / 3)}/month
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBillingIntervalColor(plan.billing_interval)}`}>
                    {plan.discount_percentage}% savings
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {getPlanFeatures(plan).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="text-green-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleStartSubscription(plan)}
                  disabled={creatingSubscription === plan.id}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {creatingSubscription === plan.id ? 'Creating...' : user ? 'Start Subscription' : 'Sign In to Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {plans.length === 0 && (
        <div className="text-center py-12">
          <RefreshCw size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No subscription plans available</h3>
          <p className="text-gray-400">Check back soon for subscription options!</p>
        </div>
      )}
    </div>
  )
}