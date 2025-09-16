'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useState } from 'react'
import { useCartStore } from '@/stores/cart-store'
import { Loader2 } from 'lucide-react'

const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com'
// Replace this with your actual wallet address
const MERCHANT_WALLET_ADDRESS = 'So11111111111111111111111111111111111111112' // SOL token mint as placeholder
const MERCHANT_WALLET = new PublicKey(MERCHANT_WALLET_ADDRESS)

export function SolanaCheckout() {
  const { publicKey, signTransaction } = useWallet()
  const { items, getTotal, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Convert USD to SOL (you'll need to implement real-time price conversion)
  const convertToSOL = async (usdAmount: number) => {
    // This is a placeholder - you should use a real price API
    // For demo purposes, assuming 1 SOL = $100 USD
    const solPrice = 100
    return usdAmount / solPrice
  }

  const handleSolanaPayment = async () => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet first')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('idle')

    try {
      const connection = new Connection(SOLANA_RPC_URL, 'confirmed')
      const totalUSD = getTotal()
      const totalSOL = await convertToSOL(totalUSD)
      const lamports = Math.round(totalSOL * LAMPORTS_PER_SOL)

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: MERCHANT_WALLET,
          lamports: lamports,
        })
      )

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Sign transaction
      const signedTransaction = await signTransaction(transaction)
      
      // Send transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())
      
      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed')
      
      // Clear cart and show success
      clearCart()
      setPaymentStatus('success')
      
      // Here you would typically also:
      // 1. Create order in your database
      // 2. Send confirmation email
      // 3. Update inventory
      
    } catch (error) {
      console.error('Payment failed:', error)
      setPaymentStatus('error')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="text-gray-300 text-center">Connect your wallet to pay with Solana</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {paymentStatus === 'success' && (
        <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg">
          <p className="text-green-300 font-medium">Payment successful! 🎉</p>
          <p className="text-green-400 text-sm mt-1">Your order has been processed.</p>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-300 font-medium">Payment failed</p>
          <p className="text-red-400 text-sm mt-1">Please try again or contact support.</p>
        </div>
      )}

      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <h3 className="text-white font-semibold mb-2">Pay with Solana</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Total: ${getTotal().toFixed(2)} USD</span>
          <span className="text-purple-400">≈ {(getTotal() / 100).toFixed(4)} SOL*</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">*Approximate conversion rate</p>
        
        <button
          onClick={handleSolanaPayment}
          disabled={isProcessing || items.length === 0}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Pay with SOL</span>
          )}
        </button>
      </div>
    </div>
  )
}