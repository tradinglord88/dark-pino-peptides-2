'use client'

import { useEffect, useState } from 'react'
import { Search, Mail, User, ShoppingBag, DollarSign, Calendar } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Customer {
  email: string
  name: string | null
  orderCount: number
  totalSpent: number
  lastOrderDate: string | null
  firstOrderDate: string | null
}

export default function CustomersPage() {
  const supabase = createClientComponentClient()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'email' | 'orderCount' | 'totalSpent' | 'lastOrderDate'>('totalSpent')

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    // Filter and sort customers
    let filtered = customers.filter(customer =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'email':
          return a.email.localeCompare(b.email)
        case 'orderCount':
          return b.orderCount - a.orderCount
        case 'totalSpent':
          return b.totalSpent - a.totalSpent
        case 'lastOrderDate':
          if (!a.lastOrderDate && !b.lastOrderDate) return 0
          if (!a.lastOrderDate) return 1
          if (!b.lastOrderDate) return -1
          return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
        default:
          return 0
      }
    })

    setFilteredCustomers(filtered)
  }, [customers, searchTerm, sortBy])

  const fetchCustomers = async () => {
    try {
      // Fetch all orders with customer info
      const { data: orders, error } = await supabase
        .from('orders')
        .select('customer_email, customer_name, total_amount, created_at, payment_status')

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      if (!orders) return

      // Group orders by customer email
      const customerMap = new Map<string, Customer>()

      orders.forEach(order => {
        const email = order.customer_email
        if (!customerMap.has(email)) {
          customerMap.set(email, {
            email,
            name: order.customer_name,
            orderCount: 0,
            totalSpent: 0,
            lastOrderDate: null,
            firstOrderDate: null
          })
        }

        const customer = customerMap.get(email)!

        // Only count completed orders
        if (order.payment_status === 'completed') {
          customer.orderCount += 1
          customer.totalSpent += order.total_amount || 0
        }

        // Update order dates
        const orderDate = order.created_at
        if (!customer.firstOrderDate || orderDate < customer.firstOrderDate) {
          customer.firstOrderDate = orderDate
        }
        if (!customer.lastOrderDate || orderDate > customer.lastOrderDate) {
          customer.lastOrderDate = orderDate
        }
      })

      const customerList = Array.from(customerMap.values())
      setCustomers(customerList)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
        <h1 className="text-3xl font-bold text-white">Customers</h1>
        <p className="text-gray-400 mt-2">Manage and view customer information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <User className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{customers.length}</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Total Customers</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <ShoppingBag className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {customers.reduce((sum, c) => sum + c.orderCount, 0)}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Total Orders</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <DollarSign className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">
              ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Total Revenue</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
        >
          <option value="totalSpent">Sort by Total Spent</option>
          <option value="orderCount">Sort by Order Count</option>
          <option value="lastOrderDate">Sort by Last Order</option>
          <option value="email">Sort by Email</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Orders</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Total Spent</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">First Order</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    {customers.length === 0 ? 'No customers found' : 'No customers match your search'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer.email} className="hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {customer.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {customer.name || 'Unknown'}
                          </p>
                          <p className="text-gray-400 text-sm flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-medium">{customer.orderCount}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-medium">
                        ${customer.totalSpent.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-400 text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(customer.firstOrderDate)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-400 text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(customer.lastOrderDate)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}