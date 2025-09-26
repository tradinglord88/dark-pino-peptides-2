'use client'

import { useEffect, useState } from 'react'
import { Package, Truck, Clock, CheckCircle, AlertTriangle, Edit, Save, X } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Order {
  id: string
  order_number: string
  customer_email: string
  customer_name: string | null
  shipping_address: any
  shipping_status: string
  tracking_number: string | null
  shipped_date: string | null
  total_amount: number
  created_at: string
  items: any[]
}

export default function ShippingPage() {
  const supabase = createClientComponentClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [editingTracking, setEditingTracking] = useState<string | null>(null)
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    // Filter orders by status
    if (filterStatus === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.shipping_status === filterStatus))
    }
  }, [orders, filterStatus])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      if (data) {
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateShippingStatus = async (orderId: string, newStatus: string, trackingNumber?: string) => {
    try {
      const updateData: any = {
        shipping_status: newStatus
      }

      if (newStatus === 'shipped') {
        updateData.shipped_date = new Date().toISOString()
        if (trackingNumber) {
          updateData.tracking_number = trackingNumber
        }
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)

      if (error) {
        console.error('Error updating shipping status:', error)
        return
      }

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderId
          ? {
              ...order,
              shipping_status: newStatus,
              tracking_number: trackingNumber || order.tracking_number,
              shipped_date: newStatus === 'shipped' ? new Date().toISOString() : order.shipped_date
            }
          : order
      ))

      // Log activity
      await supabase
        .from('admin_activity_logs')
        .insert({
          admin_email: localStorage.getItem('adminEmail') || 'admin@darkpino.com',
          action: 'update_shipping',
          resource_type: 'order',
          resource_id: orderId,
          details: {
            status: newStatus,
            tracking_number: trackingNumber
          }
        })
    } catch (error) {
      console.error('Error updating shipping:', error)
    }
  }

  const saveTrackingNumber = (orderId: string) => {
    const trackingNumber = trackingNumbers[orderId]
    if (trackingNumber) {
      updateShippingStatus(orderId, 'shipped', trackingNumber)
    }
    setEditingTracking(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
      case 'processing':
        return (
          <span className="flex items-center px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
            <Package className="w-3 h-3 mr-1" />
            Processing
          </span>
        )
      case 'shipped':
        return (
          <span className="flex items-center px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full">
            <Truck className="w-3 h-3 mr-1" />
            Shipped
          </span>
        )
      case 'delivered':
        return (
          <span className="flex items-center px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </span>
        )
      default:
        return <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-full">{status}</span>
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Shipping Management</h1>
        <p className="text-gray-400 mt-2">Manage order fulfillment and shipping</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <Clock className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">
              {orders.filter(o => o.shipping_status === 'pending').length}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Pending Shipment</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <Package className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">
              {orders.filter(o => o.shipping_status === 'processing').length}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Processing</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <Truck className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">
              {orders.filter(o => o.shipping_status === 'shipped').length}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Shipped</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {orders.filter(o => o.shipping_status === 'delivered').length}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Delivered</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto">
        {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as typeof filterStatus)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              filterStatus === status
                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
            }`}
          >
            {status === 'all' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No orders found for the selected filter</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                {/* Order Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-lg">
                        Order #{order.order_number}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.shipping_status)}
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Customer</p>
                      <p className="text-white">{order.customer_name || 'Unknown'}</p>
                      <p className="text-gray-400 text-sm">{order.customer_email}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Shipping Address</p>
                      {order.shipping_address ? (
                        <div className="text-white text-sm">
                          <p>{order.shipping_address.line1}</p>
                          {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                          <p>
                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                          </p>
                          <p>{order.shipping_address.country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No address provided</p>
                      )}
                    </div>
                  </div>

                  {/* Tracking Number */}
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Tracking Number</p>
                    {editingTracking === order.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={trackingNumbers[order.id] || ''}
                          onChange={(e) => setTrackingNumbers({
                            ...trackingNumbers,
                            [order.id]: e.target.value
                          })}
                          placeholder="Enter tracking number"
                          className="flex-1 px-3 py-1 bg-black/50 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        />
                        <button
                          onClick={() => saveTrackingNumber(order.id)}
                          className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingTracking(null)}
                          className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-white">
                          {order.tracking_number || 'Not yet assigned'}
                        </p>
                        {order.shipping_status === 'pending' || order.shipping_status === 'processing' ? (
                          <button
                            onClick={() => {
                              setEditingTracking(order.id)
                              setTrackingNumbers({
                                ...trackingNumbers,
                                [order.id]: order.tracking_number || ''
                              })
                            }}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                  {order.shipping_status === 'pending' && (
                    <button
                      onClick={() => updateShippingStatus(order.id, 'processing')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Start Processing
                    </button>
                  )}

                  {order.shipping_status === 'processing' && (
                    <button
                      onClick={() => {
                        if (trackingNumbers[order.id] || order.tracking_number) {
                          updateShippingStatus(order.id, 'shipped', trackingNumbers[order.id])
                        } else {
                          alert('Please add a tracking number before marking as shipped')
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Mark as Shipped
                    </button>
                  )}

                  {order.shipping_status === 'shipped' && (
                    <button
                      onClick={() => updateShippingStatus(order.id, 'delivered')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}