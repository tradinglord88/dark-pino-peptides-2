'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Check } from 'lucide-react'
import { ProductData } from '@/lib/data/mock-products'
import { ProductBadge } from './product-badge'
import { QuantitySelector } from './quantity-selector'
import { useCartStore } from '@/stores/cart-store'
import { formatPrice } from '@/lib/utils/format'
import { toast } from '@/components/ui/toast'

interface ProductCardProps {
  product: ProductData
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItemWithQuantity, getItemQuantity, openCart, isHydrated } =
    useCartStore()
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const currentQuantityInCart = isHydrated ? getItemQuantity(product.id) : 0

  const handleAddToCart = async () => {
    setIsAdding(true)

    // Add item to cart
    addItemWithQuantity(product, selectedQuantity)

    // Show success feedback
    toast.success(`${selectedQuantity}x ${product.name} added to cart!`, 2000)

    // Reset quantity selector and show brief success state
    setSelectedQuantity(1)

    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <div className="group relative bg-gradient-to-b from-slate-800/50 to-slate-900/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
      {/* Badge */}
      {product.badge && <ProductBadge badge={product.badge} />}

      {/* Product Image */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-40 flex items-center justify-center">
          <Image
            src={product.image_url}
            alt={product.name}
            width={120}
            height={160}
            className="object-contain drop-shadow-lg"
            onError={(e) => {
              // Fallback to a placeholder or default image
              const target = e.target as HTMLImageElement
              target.src =
                'data:image/svg+xml,%3Csvg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="120" height="160" rx="8" fill="%23374151"/%3E%3Cpath d="M40 60H80V100H40V60Z" fill="%236B7280"/%3E%3Ctext x="60" y="130" text-anchor="middle" fill="%239CA3AF" font-size="10"%3EPeptide%3C/text%3E%3C/svg%3E'
            }}
          />
        </div>
      </div>

      {/* Product Name */}
      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        {product.name}
      </h3>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
        {product.description}
      </p>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.category_tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full border border-cyan-500/30"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Spec Tags (Dosage & Purity) */}
      <div className="flex gap-2 mb-6">
        {product.spec_tags.map((spec, index) => (
          <span
            key={index}
            className="px-3 py-2 text-sm font-semibold bg-slate-700/80 text-white rounded-lg border border-slate-600"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="text-gray-400 text-sm block mb-1">PRICE</span>
        <span className="text-3xl font-bold text-white">
          {formatPrice(product.price)}
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Quantity</span>
          {currentQuantityInCart > 0 && (
            <span className="text-xs text-purple-400">
              {currentQuantityInCart} in cart
            </span>
          )}
        </div>
        <QuantitySelector
          initialQuantity={selectedQuantity}
          min={1}
          max={10}
          onQuantityChange={setSelectedQuantity}
          disabled={isAdding}
        />
      </div>

      {/* Add to Cart Button */}
      <div className="space-y-2">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`
            w-full py-3 px-4 font-semibold rounded-xl transition-all duration-200 shadow-lg
            ${
              isAdding
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105 active:scale-95 hover:shadow-purple-500/25'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            {isAdding ? (
              <>
                <Check size={18} />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </>
            )}
          </div>
        </button>

        {/* Quick Actions */}
        {currentQuantityInCart > 0 && (
          <button
            onClick={openCart}
            className="w-full py-2 px-4 text-sm bg-slate-700/50 hover:bg-slate-600 text-purple-300 hover:text-purple-200 rounded-lg transition-colors"
          >
            View Cart ({currentQuantityInCart})
          </button>
        )}
      </div>
    </div>
  )
}
