'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  initialQuantity?: number
  min?: number
  max?: number
  onQuantityChange: (quantity: number) => void
  disabled?: boolean
}

export function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max = 99,
  onQuantityChange,
  disabled = false,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onQuantityChange(newQuantity)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onQuantityChange(newQuantity)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min
    const clampedValue = Math.max(min, Math.min(max, value))
    setQuantity(clampedValue)
    onQuantityChange(clampedValue)
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
      >
        <Minus size={14} className="text-white" />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className="w-12 h-8 text-center bg-slate-800/80 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
      />

      <button
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
      >
        <Plus size={14} className="text-white" />
      </button>
    </div>
  )
}
