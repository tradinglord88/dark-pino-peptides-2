'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, ShoppingCart } from 'lucide-react'
import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast = { id, message, type, duration }

    set((state) => ({
      toasts: [...state.toasts, toast],
    }))

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearAll: () => set({ toasts: [] }),
}))

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: string) => void
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />
      case 'info':
        return <ShoppingCart size={20} className="text-blue-400" />
      default:
        return null
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-900/80 border-green-500/50'
      case 'error':
        return 'bg-red-900/80 border-red-500/50'
      case 'info':
        return 'bg-blue-900/80 border-blue-500/50'
      default:
        return 'bg-slate-800/80 border-slate-600/50'
    }
  }

  return (
    <div
      className={`
        ${getBackgroundColor()}
        backdrop-blur-lg border rounded-lg p-4 shadow-lg transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <span className="text-white font-medium flex-1">{toast.message}</span>
        <button
          onClick={handleRemove}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

// Helper function to easily show toasts
export const toast = {
  success: (message: string, duration?: number) => {
    useToastStore.getState().addToast(message, 'success', duration)
  },
  error: (message: string, duration?: number) => {
    useToastStore.getState().addToast(message, 'error', duration)
  },
  info: (message: string, duration?: number) => {
    useToastStore.getState().addToast(message, 'info', duration)
  },
}
