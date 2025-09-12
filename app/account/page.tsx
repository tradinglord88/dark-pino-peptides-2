'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Package, Clock, CheckCircle, XCircle, Settings, LogOut, RefreshCw, Calendar, Truck } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { supabase } from '@/lib/supabase/client'
import { Order, OrderItem, ShippingAddress, SubscriptionPlan, UserSubscription, SubscriptionDelivery } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils/format'
import { CancelSubscriptionModal } from '@/components/ui/cancel-subscription-modal'

interface OrderWithDetails extends Order {
  order_items: OrderItem[]
  shipping_addresses: ShippingAddress | null
}

interface SubscriptionWithPlan extends UserSubscription {
  subscription_plans: SubscriptionPlan
}

interface DeliveryWithItems extends SubscriptionDelivery {
  subscription_delivery_items: any[]
}

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, signOut, isLoading, isHydrated } = useAuthStore()
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithPlan[]>([])
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true)
  const [deliveries, setDeliveries] = useState<DeliveryWithItems[]>([])
  const [loadingDeliveries, setLoadingDeliveries] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'profile'>('subscriptions')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<SubscriptionWithPlan | null>(null)

  useEffect(() => {
    if (isHydrated && !isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, isHydrated, router])

  useEffect(() => {
    if (user) {
      loadOrders()
      loadSubscriptions()
    }
  }, [user])

  const loadOrders = async () => {
    try {
      setLoadingOrders(true)
      
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          shipping_addresses (*)
        `)
        .or(`user_id.eq.${user?.id},guest_email.eq.${user?.email}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading orders:', error)
        return
      }

      setOrders(ordersData || [])
    } catch (error) {
      console.error('Error in loadOrders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const loadSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true)
      
      const { data: subscriptionsData, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading subscriptions:', error)
        return
      }

      setSubscriptions(subscriptionsData || [])
      
      // Load deliveries for active subscriptions
      if (subscriptionsData && subscriptionsData.length > 0) {
        loadDeliveries(subscriptionsData.map(s => s.id))
      }
    } catch (error) {
      console.error('Error in loadSubscriptions:', error)
    } finally {
      setLoadingSubscriptions(false)
    }
  }

  const loadDeliveries = async (subscriptionIds: string[]) => {
    try {
      setLoadingDeliveries(true)
      
      const { data: deliveriesData, error } = await supabase
        .from('subscription_deliveries')
        .select(`
          *,
          subscription_delivery_items (*)
        `)
        .in('subscription_id', subscriptionIds)
        .order('delivery_date', { ascending: false })

      if (error) {
        console.error('Error loading deliveries:', error)
        return
      }

      setDeliveries(deliveriesData || [])
    } catch (error) {
      console.error('Error in loadDeliveries:', error)
    } finally {
      setLoadingDeliveries(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleCancelSubscription = (subscription: SubscriptionWithPlan) => {
    setSubscriptionToCancel(subscription)
    setCancelModalOpen(true)
  }

  const confirmCancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription')
      }

      // Update the local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'cancelled' as const, cancelled_at: new Date().toISOString() }
            : sub
        )
      )

      // Close modal and clear selection
      setCancelModalOpen(false)
      setSubscriptionToCancel(null)
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Failed to cancel subscription. Please try again.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-400" size={16} />
      case 'processing':
        return <Package className="text-blue-400" size={16} />
      case 'completed':
        return <CheckCircle className="text-green-400" size={16} />
      case 'cancelled':
      case 'failed':
        return <XCircle className="text-red-400" size={16} />
      default:
        return <Clock className="text-gray-400" size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400'
      case 'processing':
        return 'text-blue-400'
      case 'completed':
        return 'text-green-400'
      case 'cancelled':
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
          <p className="text-gray-300">Welcome back, {profile?.full_name || user.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeTab === 'subscriptions'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <RefreshCw size={20} />
                  <span>My Subscriptions</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Package size={20} />
                  <span>My Orders</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Settings size={20} />
                  <span>Profile Settings</span>
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-red-700/50 hover:text-red-300 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'subscriptions' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">My Subscriptions</h2>
                
                {loadingSubscriptions ? (
                  <div className="bg-gray-800/50 rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading your subscriptions...</p>
                  </div>
                ) : subscriptions.length === 0 ? (
                  <div className="bg-gray-800/50 rounded-lg p-8 text-center">
                    <RefreshCw size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No subscriptions yet</h3>
                    <p className="text-gray-300 mb-6">Start a subscription to get monthly peptides delivered to your door!</p>
                    <button
                      onClick={() => router.push('/products')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                    >
                      Browse Subscription Plans
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                        {/* Subscription Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {subscription.subscription_plans.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {subscription.subscription_plans.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                            <div className="flex items-center space-x-2">
                              {subscription.status === 'active' && <CheckCircle className="text-green-400" size={16} />}
                              {subscription.status === 'paused' && <Clock className="text-yellow-400" size={16} />}
                              {subscription.status === 'cancelled' && <XCircle className="text-red-400" size={16} />}
                              {subscription.status === 'trial' && <Clock className="text-blue-400" size={16} />}
                              <span className={`font-medium capitalize ${
                                subscription.status === 'active' ? 'text-green-400' :
                                subscription.status === 'paused' ? 'text-yellow-400' :
                                subscription.status === 'cancelled' ? 'text-red-400' :
                                subscription.status === 'trial' ? 'text-blue-400' : 'text-gray-400'
                              }`}>
                                {subscription.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Price</p>
                              <p className="text-lg font-semibold text-white">
                                {formatPrice(subscription.subscription_plans.price)}/{subscription.subscription_plans.billing_interval}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Subscription Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <h4 className="font-medium text-white mb-2">Current Period</h4>
                            <p className="text-sm text-gray-300">
                              {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <h4 className="font-medium text-white mb-2">Products per shipment</h4>
                            <p className="text-sm text-gray-300">
                              {subscription.subscription_plans.product_count} premium peptides
                            </p>
                          </div>
                          
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <h4 className="font-medium text-white mb-2">Discount</h4>
                            <p className="text-sm text-gray-300">
                              {subscription.subscription_plans.discount_percentage}% off regular price
                            </p>
                          </div>
                        </div>

                        {/* Recent Deliveries */}
                        <div className="bg-gray-700/20 rounded-lg p-4">
                          <h4 className="font-medium text-white mb-3 flex items-center">
                            <Truck size={16} className="mr-2" />
                            Recent Deliveries
                          </h4>
                          {loadingDeliveries ? (
                            <p className="text-sm text-gray-400">Loading deliveries...</p>
                          ) : (
                            <div className="space-y-2">
                              {deliveries
                                .filter(d => d.subscription_id === subscription.id)
                                .slice(0, 3)
                                .map((delivery) => (
                                  <div key={delivery.id} className="flex items-center justify-between py-2 border-b border-gray-600/30 last:border-b-0">
                                    <div>
                                      <p className="text-sm font-medium text-white">
                                        Delivery #{delivery.id.slice(-6).toUpperCase()}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {new Date(delivery.delivery_date).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {delivery.status === 'delivered' && <CheckCircle className="text-green-400" size={14} />}
                                      {delivery.status === 'shipped' && <Truck className="text-blue-400" size={14} />}
                                      {delivery.status === 'processing' && <Clock className="text-yellow-400" size={14} />}
                                      <span className={`text-xs capitalize ${
                                        delivery.status === 'delivered' ? 'text-green-400' :
                                        delivery.status === 'shipped' ? 'text-blue-400' :
                                        delivery.status === 'processing' ? 'text-yellow-400' : 'text-gray-400'
                                      }`}>
                                        {delivery.status}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              }
                              {deliveries.filter(d => d.subscription_id === subscription.id).length === 0 && (
                                <p className="text-sm text-gray-400">No deliveries yet</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          {subscription.status === 'active' && (
                            <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors">
                              Pause Subscription
                            </button>
                          )}
                          {subscription.status === 'paused' && (
                            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                              Resume Subscription
                            </button>
                          )}
                          <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Manage Preferences
                          </button>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                            View All Deliveries
                          </button>
                          {(subscription.status === 'active' || subscription.status === 'paused') && (
                            <button 
                              onClick={() => handleCancelSubscription(subscription)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              Cancel Subscription
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
                
                {loadingOrders ? (
                  <div className="bg-gray-800/50 rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-gray-800/50 rounded-lg p-8 text-center">
                    <Package size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                    <p className="text-gray-300 mb-6">Start shopping to see your orders here!</p>
                    <button
                      onClick={() => router.push('/products')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span className={`font-medium capitalize ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Total</p>
                              <p className="text-lg font-semibold text-white">
                                {formatPrice(order.total_amount)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-4">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                              <div>
                                <h4 className="font-medium text-white">{item.product_name}</h4>
                                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-medium text-white">
                                {formatPrice(item.price_at_time * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Address */}
                        {order.shipping_addresses && (
                          <div className="bg-gray-700/20 rounded-lg p-4">
                            <h4 className="font-medium text-white mb-2">Shipping Address</h4>
                            <div className="text-sm text-gray-300 space-y-1">
                              <p>{order.shipping_addresses.first_name} {order.shipping_addresses.last_name}</p>
                              <p>{order.shipping_addresses.address}</p>
                              <p>
                                {order.shipping_addresses.city}, {order.shipping_addresses.state} {order.shipping_addresses.postal_code}
                              </p>
                              <p>{order.shipping_addresses.country}</p>
                            </div>
                          </div>
                        )}

                        {/* Payment Method */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="text-gray-400">
                            Payment: <span className="capitalize text-white">{order.payment_method}</span>
                          </span>
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => window.location.reload()}
                              className="text-blue-400 hover:text-blue-300 underline"
                            >
                              Refresh Status
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="p-3 bg-gray-700/50 rounded-lg text-gray-300">
                        {user.email}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Email cannot be changed at this time
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="p-3 bg-gray-700/50 rounded-lg text-gray-300">
                        {profile?.full_name || 'Not set'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="p-3 bg-gray-700/50 rounded-lg text-gray-300">
                        {profile?.phone || 'Not set'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Member Since
                      </label>
                      <div className="p-3 bg-gray-700/50 rounded-lg text-gray-300">
                        {profile?.created_at 
                          ? new Date(profile.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Unknown'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {subscriptionToCancel && (
        <CancelSubscriptionModal
          isOpen={cancelModalOpen}
          onClose={() => {
            setCancelModalOpen(false)
            setSubscriptionToCancel(null)
          }}
          subscription={subscriptionToCancel}
          onConfirmCancel={confirmCancelSubscription}
        />
      )}
    </div>
  )
}