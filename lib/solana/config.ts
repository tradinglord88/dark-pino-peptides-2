import { Connection, clusterApiUrl } from '@solana/web3.js'

// Solana network configuration
export const SOLANA_NETWORK = process.env.NODE_ENV === 'production' ? 'mainnet-beta' : 'devnet'
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK)

// Create Solana connection
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

// SPL Token addresses
export const USDC_MINT_ADDRESS = SOLANA_NETWORK === 'mainnet-beta' 
  ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'  // USDC on mainnet
  : '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'   // USDC on devnet

// Merchant wallet (replace with your actual wallet address)
export const MERCHANT_WALLET = process.env.NEXT_PUBLIC_MERCHANT_WALLET || '11111111111111111111111111111112'

// Transaction confirmation settings
export const CONFIRMATION_TIMEOUT = 30000 // 30 seconds
export const MAX_RETRIES = 3