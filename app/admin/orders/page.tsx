'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Package, Search, Filter, Download,
  Clock, CheckCircle, XCircle, AlertCircle,
  Bitcoin, ArrowRightLeft, CreditCard, Eye,
  Truck, Edit, RefreshCw
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

interface Order {
  id: string
  order_number: string
  customer_email: string
  customer_name: string | null
  customer_phone: string | null
  payment_method: string
  payment_status: string
  payment_amount: number
  payment_currency: string
  shipping_status: string
  shipping_name: string | null
  shipping_address_line1: string | null
  shipping_city: string | null
  shipping_country: string | null
  shipping_tracking_number: string | null
  total_amount: number
  order_items: any
  created_at: string
  paid_at: string | null
  shipped_at: string | null
  internal_notes: string | null
}

export default function OrdersPage() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter')

  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState(filterParam || 'all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, filterStatus])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      setOrders(data || [])
    } catch (error) {
      console.error('Orders error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Apply status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending') {
        filtered = filtered.filter(o => o.payment_status === 'pending')
      } else if (filterStatus === 'completed') {
        filtered = filtered.filter(o => o.payment_status === 'completed')
      } else if (filterStatus === 'awaiting-shipment') {
        filtered = filtered.filter(o =>
          o.payment_status === 'completed' && o.shipping_status === 'pending'
        )
      } else if (filterStatus === 'shipped') {
        filtered = filtered.filter(o => o.shipping_status === 'shipped')
      }
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, updates: Partial<Order>) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)

      if (!error) {
        // Refresh orders
        await fetchOrders()
        // Log activity
        await supabase
          .from('admin_activity_logs')
          .insert({
            action: 'update_order',
            resource_type: 'order',
            resource_id: orderId,
            new_values: updates
          })
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'solana':
        return <Bitcoin className="w-4 h-4 text-purple-400" />
      case 'etransfer':
        return <ArrowRightLeft className="w-4 h-4 text-blue-400" />
      case 'stripe':
        return <CreditCard className="w-4 h-4 text-green-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string, type: 'payment' | 'shipping' = 'payment') => {
    const baseClasses = "px-2 py-1 text-xs rounded-full inline-flex items-center space-x-1"

    if (type === 'payment') {
      switch (status) {
        case 'completed':
          return <span className={`${baseClasses} bg-green-500/10 text-green-400`}>
            <CheckCircle className="w-3 h-3" /> <span>Paid</span>
          </span>
        case 'pending':
          return <span className={`${baseClasses} bg-yellow-500/10 text-yellow-400`}>
            <Clock className="w-3 h-3" /> <span>Pending</span>
          </span>
        case 'failed':
          return <span className={`${baseClasses} bg-red-500/10 text-red-400`}>
            <XCircle className="w-3 h-3" /> <span>Failed</span>
          </span>
        default:
          return <span className={`${baseClasses} bg-gray-500/10 text-gray-400`}>
            <span>{status}</span>
          </span>
      }
    } else {
      switch (status) {
        case 'shipped':
          return <span className={`${baseClasses} bg-purple-500/10 text-purple-400`}>
            <Truck className="w-3 h-3" /> <span>Shipped</span>
          </span>
        case 'delivered':
          return <span className={`${baseClasses} bg-green-500/10 text-green-400`}>
            <CheckCircle className="w-3 h-3" /> <span>Delivered</span>
          </span>
        case 'pending':
          return <span className={`${baseClasses} bg-gray-500/10 text-gray-400`}>
            <Clock className="w-3 h-3" /> <span>Pending</span>
          </span>
        default:
          return <span className={`${baseClasses} bg-gray-500/10 text-gray-400`}>
            <span>{status}</span>
          </span>
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders Management</h1>
          <p className="text-gray-400 mt-1">View and manage all customer orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number, email, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending Payment</option>
            <option value="completed">Paid</option>
            <option value="awaiting-shipment">Awaiting Shipment</option>
            <option value="shipped">Shipped</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">Total Orders</p>
            <p className="text-xl font-bold text-white">{orders.length}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">Pending</p>
            <p className="text-xl font-bold text-yellow-400">
              {orders.filter(o => o.payment_status === 'pending').length}
            </p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">Ready to Ship</p>
            <p className="text-xl font-bold text-purple-400">
              {orders.filter(o => o.payment_status === 'completed' && o.shipping_status === 'pending').length}
            </p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">Shipped</p>
            <p className="text-xl font-bold text-green-400">
              {orders.filter(o => o.shipping_status === 'shipped').length}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Shipping</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {order.order_number || `#${order.id.slice(0, 8)}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.order_items?.length || 0} items
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-white">{order.customer_name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {getPaymentIcon(order.payment_method)}
                        <span className="text-sm text-gray-300 capitalize">{order.payment_method}</span>
                      </div>
                      {getStatusBadge(order.payment_status)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getStatusBadge(order.shipping_status, 'shipping')}
                      {order.shipping_tracking_number && (
                        <p className="text-xs text-gray-400">
                          #{order.shipping_tracking_number}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">
                      ${order.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-400">{order.payment_currency || 'USD'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-300">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-1.5 text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {order.payment_status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, { payment_status: 'completed', paid_at: new Date().toISOString() })}
                          className="p-1.5 text-green-400 hover:bg-green-500/10 rounded transition-colors"
                          title="Mark as Paid"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {order.payment_status === 'completed' && order.shipping_status === 'pending' && (
                        <button
                          onClick={() => {
                            const trackingNumber = prompt('Enter tracking number:')
                            if (trackingNumber) {
                              updateOrderStatus(order.id, {
                                shipping_status: 'shipped',
                                shipping_tracking_number: trackingNumber,
                                shipped_at: new Date().toISOString()
                              })
                            }
                          }}
                          className="p-1.5 text-purple-400 hover:bg-purple-500/10 rounded transition-colors"
                          title="Mark as Shipped"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}