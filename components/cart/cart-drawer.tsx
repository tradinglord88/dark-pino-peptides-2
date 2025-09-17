'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, ShoppingBag, CreditCard } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { CartItem } from './cart-item'
import { formatPrice } from '@/lib/utils/format'

export function CartDrawer() {
  const router = useRouter()
  const {
    isOpen,
    items,
    closeCart,
    getItemCount,
    getSubtotal,
    getTax,
    getShipping,
    getTotal,
    isHydrated,
  } = useCartStore()

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeCart])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Don't render until hydrated to prevent SSR mismatches
  if (!isHydrated) return null

  const subtotal = getSubtotal()
  const tax = getTax()
  const shipping = getShipping()
  const total = getTotal()
  const itemCount = getItemCount()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`
        fixed right-0 top-0 h-full w-96 max-w-[95vw] sm:max-w-full bg-gradient-to-b from-slate-800/95 to-slate-900/95 
        backdrop-blur-lg border-l border-slate-700/50 shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-2">
            <ShoppingBag size={20} className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              Cart {itemCount > 0 && `(${itemCount})`}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100%-80px)]">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-400 mb-6">
                Add some premium peptides to get started
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-slate-700/50 p-6 space-y-4 flex-shrink-0">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-gray-300">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-300">
                  <span>
                    Shipping
                    {shipping === 0 && (
                      <span className="text-green-400 text-sm ml-1">
                        (Free!)
                      </span>
                    )}
                  </span>
                  <span>{formatPrice(shipping)}</span>
                </div>

                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <div className="text-sm text-gray-400">
                    Add {formatPrice(150 - subtotal)} more for free shipping
                    <div className="w-full bg-slate-700/50 rounded-full h-2 mt-1">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((subtotal / 150) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-slate-600/50 pt-4">
                  <div className="flex justify-between text-white text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    closeCart()
                    router.push('/checkout')
                  }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard size={20} />
                    <span>Pay with Card</span>
                  </div>
                </button>
                <div className="text-center text-xs text-gray-400">
                  🔒 Secure checkout powered by Stripe
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
