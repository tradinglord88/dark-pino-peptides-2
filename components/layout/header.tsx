'use client'

import Link from 'next/link'
import { ShoppingCart, Home, Package } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

export function Header() {
  const { getItemCount, toggleCart, isHydrated } = useCartStore()
  const itemCount = isHydrated ? getItemCount() : 0

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dark Pino Peptides
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Package size={18} />
              <span>Products</span>
            </Link>
          </nav>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="relative flex items-center space-x-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <ShoppingCart size={20} className="text-white" />
            <span className="hidden sm:block text-white font-medium">Cart</span>

            {/* Cart Badge */}
            {itemCount > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Home size={16} />
              <span className="text-sm">Home</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Package size={16} />
              <span className="text-sm">Products</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
