'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Home, Package, TestTube, Droplet } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

export function Header() {
  const { getItemCount, toggleCart, isHydrated } = useCartStore()
  const itemCount = isHydrated ? getItemCount() : 0

  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-lg border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/pepe-mascot.png"
                alt="Dark Pino Pepe Logo"
                width={32}
                height={32}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="text-lg font-permanent-marker text-3d-yellow leading-tight">
                  DARK PINO
                </span>
                <span className="text-sm font-bold text-white tracking-wider leading-tight">
                  PEPTIDES
                </span>
              </div>
              <div className="hidden md:block h-8 w-px bg-gray-500/50"></div>
              <span className="hidden md:block text-xs font-semibold text-white/70 tracking-widest uppercase">
                NEXT-GEN RESEARCH CHEMISTRY
              </span>
            </div>
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
            <Link
              href="/peptides"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <TestTube size={18} />
              <span>Peptides</span>
            </Link>
            <Link
              href="/bacteriostatic-water"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Droplet size={18} />
              <span>Bacteriostatic Water</span>
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
          <nav className="flex items-center space-x-4 overflow-x-auto">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Home size={16} />
              <span className="text-sm">Home</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Package size={16} />
              <span className="text-sm">Products</span>
            </Link>
            <Link
              href="/peptides"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <TestTube size={16} />
              <span className="text-sm">Peptides</span>
            </Link>
            <Link
              href="/bacteriostatic-water"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Droplet size={16} />
              <span className="text-sm">Bact Water</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
