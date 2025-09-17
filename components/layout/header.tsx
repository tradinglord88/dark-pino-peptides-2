'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Home, Package, TestTube, Droplet, Sparkles, User, LogIn, Info, Activity } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { WalletButton } from '@/components/wallet/wallet-button'

export function Header() {
  const { getItemCount, toggleCart, isHydrated } = useCartStore()
  const { user, profile, isHydrated: authHydrated } = useAuthStore()
  const itemCount = isHydrated ? getItemCount() : 0

  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-lg border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
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
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
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
              <span className="whitespace-nowrap">Bac Water</span>
            </Link>
            <Link
              href="/skincare"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Sparkles size={18} />
              <span>Skincare</span>
            </Link>
            <Link
              href="/hormone"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Activity size={18} />
              <span>Hormone</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Info size={18} />
              <span>About</span>
            </Link>
          </nav>

          {/* User & Cart Actions */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Wallet Connection */}
            <WalletButton />

            {/* User Account */}
            {authHydrated && user ? (
              <Link
                href="/account"
                className="flex items-center space-x-2 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <User size={18} className="text-white" />
                <span className="hidden sm:block text-white font-medium">
                  {profile?.full_name?.split(' ')[0] || 'Account'}
                </span>
              </Link>
            ) : authHydrated ? (
              <Link
                href="/auth"
                className="flex items-center space-x-2 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <LogIn size={18} className="text-white" />
                <span className="hidden sm:block text-white font-medium">Sign In</span>
              </Link>
            ) : null}

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
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3 border-t border-gray-800/30 mt-2">
          <nav className="flex items-center justify-between px-2 overflow-x-auto scrollbar-hide">
            <Link
              href="/"
              className="flex flex-col items-center space-y-1.5 text-gray-300 hover:text-white transition-colors whitespace-nowrap min-w-fit px-2 py-1"
            >
              <Home size={18} />
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link
              href="/peptides"
              className="flex flex-col items-center space-y-1.5 text-gray-300 hover:text-white transition-colors whitespace-nowrap min-w-fit px-2 py-1"
            >
              <TestTube size={18} />
              <span className="text-xs font-medium">Peptides</span>
            </Link>
            <Link
              href="/bacteriostatic-water"
              className="flex flex-col items-center space-y-1.5 text-gray-300 hover:text-white transition-colors whitespace-nowrap min-w-fit px-2 py-1"
            >
              <Droplet size={18} />
              <span className="text-xs font-medium">Water</span>
            </Link>
            <Link
              href="/skincare"
              className="flex flex-col items-center space-y-1.5 text-gray-300 hover:text-white transition-colors whitespace-nowrap min-w-fit px-2 py-1"
            >
              <Sparkles size={18} />
              <span className="text-xs font-medium">Skincare</span>
            </Link>
            <Link
              href="/hormone"
              className="flex flex-col items-center space-y-1.5 text-gray-300 hover:text-white transition-colors whitespace-nowrap min-w-fit px-2 py-1"
            >
              <Activity size={18} />
              <span className="text-xs font-medium">Hormone</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
