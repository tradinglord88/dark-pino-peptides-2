import { CartItem } from './cart'

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: OrderStatus
  stripe_session_id?: string
  created_at: Date
  updated_at: Date
}