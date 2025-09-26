'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home, Package, CreditCard, Users, Settings, LogOut, Menu, X,
  DollarSign, TrendingUp, ShoppingCart, Clock, CheckCircle, AlertCircle,
  Bitcoin, ArrowRightLeft, Truck
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Shipping', href: '/admin/shipping', icon: Truck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <Image
              src="/images/pepe-mascot.png"
              alt="Dark Pino"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <div className="text-lg font-permanent-marker text-yellow-400">DARK PINO</div>
              <div className="text-xs text-gray-500 font-semibold">ADMIN PORTAL</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Page title */}
              <h1 className="text-xl font-semibold text-white">
                {navigation.find(item => item.href === pathname)?.name || 'Admin'}
              </h1>

              {/* Quick stats */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-400">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}