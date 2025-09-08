'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/stores/cart-store'
import { useCartStore } from '@/stores/cart-store'
import { formatPrice } from '@/lib/utils/format'
import { toast } from '@/components/ui/toast'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove()
    } else {
      updateQuantity(item.product.id, newQuantity)
    }
  }

  const handleRemove = () => {
    removeItem(item.product.id)
    toast.info(`${item.product.name} removed from cart`)
  }

  const handleDecrease = () => {
    const newQuantity = item.quantity - 1
    handleQuantityChange(newQuantity)
  }

  const handleIncrease = () => {
    const newQuantity = item.quantity + 1
    handleQuantityChange(newQuantity)
  }

  const itemTotal = item.product.price * item.quantity

  return (
    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/20">
      <div className="flex flex-col space-y-3">
        {/* Top Row: Image, Name, and Price */}
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-20 bg-slate-800/50 rounded-lg flex items-center justify-center p-2">
              <Image
                src={item.product.image_url}
                alt={item.product.name}
                width={50}
                height={60}
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src =
                    'data:image/svg+xml,%3Csvg width="50" height="60" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="50" height="60" rx="4" fill="%23374151"/%3E%3Cpath d="M15 25H35V35H15V25Z" fill="%236B7280"/%3E%3C/svg%3E'
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-2 leading-tight">
              {item.product.name}
            </h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {item.product.category_tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              {formatPrice(item.product.price)} each
            </p>
          </div>

          {/* Item Total */}
          <div className="flex-shrink-0">
            <span className="text-white font-semibold text-lg">
              {formatPrice(itemTotal)}
            </span>
          </div>
        </div>

        {/* Bottom Row: Quantity Controls and Remove */}
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-600 flex items-center justify-center transition-colors"
            >
              <Minus size={14} className="text-white" />
            </button>

            <span className="w-8 text-center text-white font-medium">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-600 flex items-center justify-center transition-colors"
            >
              <Plus size={14} className="text-white" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
