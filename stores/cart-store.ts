'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ProductData } from '@/lib/data/mock-products'

export interface CartItem {
  product: ProductData
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  isHydrated: boolean
  addItem: (product: ProductData) => void
  addItemWithQuantity: (product: ProductData, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getItemQuantity: (productId: string) => number
  getSubtotal: () => number
  getTax: () => number
  getShipping: () => number
  getTotal: () => number
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  setHydrated: () => void
  // Stripe checkout preparation
  getStripeLineItems: () => Array<{
    price_data: {
      currency: string
      product_data: {
        name: string
        description: string
        images?: string[]
        metadata: Record<string, string>
      }
      unit_amount: number
    }
    quantity: number
  }>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isHydrated: false,

      addItem: (product) => {
        const items = get().items
        const existingItem = items.find(
          (item) => item.product.id === product.id
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({ items: [...items, { product, quantity: 1 }] })
        }
      },

      addItemWithQuantity: (product, quantity) => {
        const items = get().items
        const existingItem = items.find(
          (item) => item.product.id === product.id
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ items: [...items, { product, quantity }] })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.product.id === productId)
        return item ? item.quantity : 0
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },

      getTax: () => {
        // 10% tax rate - can be made configurable
        return get().getSubtotal() * 0.1
      },

      getShipping: () => {
        // Free shipping over $150, otherwise $15
        const subtotal = get().getSubtotal()
        return subtotal >= 150 ? 0 : 15
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax() + get().getShipping()
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      setHydrated: () => set({ isHydrated: true }),

      getStripeLineItems: () => {
        return get().items.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              description: item.product.description,
              images: item.product.image_url ? [item.product.image_url] : [],
              metadata: {
                product_id: item.product.id,
                category_tags: item.product.category_tags.join(','),
                spec_tags: item.product.spec_tags.join(','),
                purity: item.product.purity,
                dosage: item.product.dosage,
              },
            },
            unit_amount: Math.round(item.product.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        }))
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated()
        }
      },
    }
  )
)
