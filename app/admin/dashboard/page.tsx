'use client'

import { useEffect, useState } from 'react'
import {
  DollarSign, Package, Users, TrendingUp,
  ShoppingCart, Clock, CheckCircle, AlertCircle,
  Bitcoin, ArrowRightLeft, CreditCard, Truck
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalCustomers: number
  pendingPayments: number
  awaitingShipment: number
  shippedOrders: number
}

interface RecentOrder {
  id: string
  order_number: string
  customer_email: string
  customer_name: string | null
  payment_method: string
  payment_status: string
  shipping_status: string
  total_amount: number
  created_at: string
}

export default function AdminDashboard() {
  const supabase = createClientComponentClient()
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    pendingPayments: 0,
    awaitingShipment: 0,
    shippedOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [adminEmail, setAdminEmail] = useState<string>('')
  const [isHardcodedAdmin, setIsHardcodedAdmin] = useState(false)

  useEffect(() => {
    // Check authentication method
    const hardcodedAuth = localStorage.getItem('adminAuth')
    const hardcodedEmail = localStorage.getItem('adminEmail')

    if (hardcodedAuth === 'true' && hardcodedEmail) {
      setIsHardcodedAdmin(true)
      setAdminEmail(hardcodedEmail)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Error fetching orders:', ordersError)
        return
      }

      if (orders) {
        // Calculate stats
        const revenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
        const pending = orders.filter(o => o.payment_status === 'pending').length
        const completed = orders.filter(o => o.payment_status === 'completed').length
        const awaitingShip = orders.filter(o =>
          o.payment_status === 'completed' && o.shipping_status === 'pending'
        ).length
        const shipped = orders.filter(o => o.shipping_status === 'shipped').length

        // Get unique customers
        const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          pendingOrders: pending,
          completedOrders: completed,
          totalCustomers: uniqueCustomers,
          pendingPayments: pending,
          awaitingShipment: awaitingShip,
          shippedOrders: shipped
        })

        // Set recent orders (top 10)
        setRecentOrders(orders.slice(0, 10))
      }
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setIsLoading(false)
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
        return <DollarSign className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">Completed</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full">Pending</span>
      case 'processing':
        return <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">Processing</span>
      case 'failed':
        return <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full">Failed</span>
      case 'shipped':
        return <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full">Shipped</span>
      default:
        return <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-full">{status}</span>
    }
  }

  const handleLogout = async () => {
    if (isHardcodedAdmin) {
      // Clear hardcoded admin session
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminEmail')
      localStorage.removeItem('adminLoginTime')
      document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    } else {
      // Sign out from Supabase
      await supabase.auth.signOut()
    }

    // Redirect to login
    window.location.href = '/admin/login'
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-2">Monitor your store's performance and manage orders</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-white font-medium">{adminEmail || 'Admin'}</p>
            <p className="text-xs text-gray-400">
              {isHardcodedAdmin ? 'Hardcoded Auth' : 'Supabase Auth'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-white mt-1">
            ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-gray-400">{stats.totalOrders}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalOrders}</p>
        </div>

        {/* Pending Payments */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-400" />
            {stats.pendingPayments > 0 && (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
          </div>
          <p className="text-gray-400 text-sm">Pending Payments</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.pendingPayments}</p>
        </div>

        {/* Awaiting Shipment */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 text-purple-400" />
            {stats.awaitingShipment > 0 && (
              <AlertCircle className="w-5 h-5 text-purple-400" />
            )}
          </div>
          <p className="text-gray-400 text-sm">Awaiting Shipment</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.awaitingShipment}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/orders?filter=pending"
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 hover:bg-yellow-500/20 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-white font-semibold">Verify Payments</p>
              <p className="text-sm text-gray-400">{stats.pendingPayments} pending</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/shipping"
          className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 hover:bg-purple-500/20 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Truck className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-white font-semibold">Process Shipping</p>
              <p className="text-sm text-gray-400">{stats.awaitingShipment} ready</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/payments"
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 hover:bg-blue-500/20 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Bitcoin className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white font-semibold">Check Blockchain</p>
              <p className="text-sm text-gray-400">Verify crypto payments</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      {order.order_number || `#${order.id.slice(0, 8)}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-white">{order.customer_name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getPaymentIcon(order.payment_method)}
                      <span className="text-sm text-gray-300 capitalize">{order.payment_method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      ${order.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}