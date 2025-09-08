import { PublicKey } from '@solana/web3.js'

export interface SolanaPaymentState {
  status: 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed'
  reference?: PublicKey
  signature?: string
  error?: string
  paymentUrl?: string
}

export interface SolanaOrderData {
  amount: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  reference: string
  timestamp: number
}

export type PaymentMethod = 'stripe' | 'solana'