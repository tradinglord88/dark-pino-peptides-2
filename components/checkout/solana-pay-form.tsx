'use client'

import { useState, useEffect, useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
import { QRCodeSVG } from 'qrcode.react'
import { 
  createSolanaPaymentRequest, 
  generatePaymentReference, 
  createSolanaPayUrl,
  checkTransactionStatus 
} from '@/lib/solana/payment'
import { SolanaPaymentState } from '@/types/solana'
import { ShippingInfo } from './shipping-form'

interface SolanaPayFormProps {
  amount: number
  shippingInfo?: ShippingInfo
  onSuccess: (signature: string) => void
  onError: (error: string) => void
  onBackToShipping?: () => void
}

export function SolanaPayForm({ amount, shippingInfo, onSuccess, onError, onBackToShipping }: SolanaPayFormProps) {
  const [paymentState, setPaymentState] = useState<SolanaPaymentState>({
    status: 'idle'
  })

  const startTransactionPolling = useCallback(async (reference: PublicKey) => {
    const maxAttempts = 60 // Poll for 5 minutes (5 second intervals)
    let attempts = 0

    const pollTransaction = async () => {
      try {
        setPaymentState(prev => ({ ...prev, status: 'confirming' }))
        
        const result = await checkTransactionStatus(reference)
        
        if (result.confirmed && result.signature) {
          setPaymentState(prev => ({ 
            ...prev, 
            status: 'confirmed', 
            signature: result.signature 
          }))
          onSuccess(result.signature)
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(pollTransaction, 5000) // Poll every 5 seconds
        } else {
          setPaymentState(prev => ({ 
            ...prev, 
            status: 'failed', 
            error: 'Payment confirmation timeout' 
          }))
          onError('Payment confirmation timed out. Please check your wallet and try again.')
        }
      } catch (error) {
        console.error('Transaction polling error:', error)
        setPaymentState(prev => ({ 
          ...prev, 
          status: 'failed', 
          error: 'Transaction check failed' 
        }))
        onError('Failed to check transaction status')
      }
    }

    // Start polling after a short delay
    setTimeout(pollTransaction, 2000)
  }, [onSuccess, onError])

  useEffect(() => {
    console.log('SolanaPayForm component mounted!')
    console.log('Amount:', amount)
    
    // Initialize payment request
    const initializePayment = async () => {
      try {
        console.log('Starting Solana payment initialization...')
        
        console.log('Generating payment reference...')
        const reference = generatePaymentReference()
        console.log('Reference generated:', reference.toString())
        
        console.log('Creating payment request...')
        const description = shippingInfo 
          ? `Payment of $${amount.toFixed(2)} for research peptides - Ship to: ${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.city}, ${shippingInfo.state}`
          : `Payment of $${amount.toFixed(2)} for research peptides`
        
        const paymentData = createSolanaPaymentRequest(
          amount,
          reference,
          'Dark Pino Peptides',
          description
        )
        console.log('Payment data created:', paymentData)
        
        console.log('Creating payment URL...')
        const paymentUrlObj = createSolanaPayUrl(paymentData)
        const paymentUrl = paymentUrlObj.toString()
        console.log('Payment URL created:', paymentUrl)
        
        setPaymentState({
          status: 'pending',
          reference,
          paymentUrl
        })

        // Start polling for transaction confirmation
        console.log('Starting transaction polling...')
        startTransactionPolling(reference)
        console.log('Solana payment initialization complete!')
      } catch (error) {
        console.error('Solana payment initialization error:', error)
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize Solana payment'
        onError(errorMessage)
        setPaymentState({ 
          status: 'failed', 
          error: `Initialization failed: ${errorMessage}` 
        })
      }
    }

    initializePayment()
  }, [amount, onError, startTransactionPolling])

  const handleRetry = () => {
    window.location.reload() // Simple retry by reloading
  }

  if (paymentState.status === 'failed') {
    return (
      <div className="text-center p-6">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Setup Required</h3>
          <p className="text-red-400 text-sm mb-4">
            {paymentState.error || 'Something went wrong with your payment'}
          </p>
          <div className="bg-gray-800/50 p-4 rounded-lg text-left text-xs text-gray-300 mb-4">
            <p className="font-semibold mb-2">To enable Solana Pay:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Install Phantom wallet</li>
              <li>Create a wallet address</li>
              <li>Add it to .env.local as NEXT_PUBLIC_MERCHANT_WALLET</li>
            </ol>
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (paymentState.status === 'confirmed') {
    return (
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-lg font-semibold text-green-400 mb-2">Payment Confirmed!</h3>
        <p className="text-gray-300 text-sm mb-4">
          Your transaction has been confirmed on the Solana blockchain.
        </p>
        {paymentState.signature && (
          <p className="text-xs text-gray-400 break-all">
            Transaction: {paymentState.signature.slice(0, 20)}...
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="text-center p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Pay with Solana</h3>
      
      {/* Shipping Info Display */}
      {shippingInfo && (
        <div className="mb-6 p-4 bg-gray-700/30 rounded-lg text-left">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-semibold text-gray-300">Shipping To:</h4>
            {onBackToShipping && (
              <button
                onClick={onBackToShipping}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Edit
              </button>
            )}
          </div>
          <div className="text-sm text-white space-y-1">
            <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p>{shippingInfo.address}</p>
            <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}</p>
            <p>{shippingInfo.country}</p>
            {shippingInfo.email && <p className="text-gray-400">{shippingInfo.email}</p>}
          </div>
        </div>
      )}
      
      {paymentState.paymentUrl && (
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg inline-block mb-4">
            <QRCodeSVG 
              value={paymentState.paymentUrl}
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Scan QR code with your Solana wallet or click the button below
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Amount:</span>
            <span className="font-semibold">${amount.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Token:</span>
            <span>USDC</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300">
            <span>Network:</span>
            <span>Solana</span>
          </div>
        </div>

        {paymentState.paymentUrl && (
          <a
            href={paymentState.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Open in Wallet
          </a>
        )}

        {paymentState.status === 'confirming' && (
          <div className="flex items-center justify-center space-x-2 text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-sm">Confirming payment...</span>
          </div>
        )}

        <div className="text-xs text-gray-400">
          <p className="mb-1">Supported wallets: Phantom, Solflare, Glow</p>
          <p>Transaction fees: ~$0.0005</p>
        </div>
      </div>
    </div>
  )
}