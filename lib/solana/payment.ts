import { PublicKey } from '@solana/web3.js'
import {
  findReference,
  FindReferenceError
} from '@solana/pay'
import { connection, USDC_MINT_ADDRESS, MERCHANT_WALLET } from './config'
import BigNumber from 'bignumber.js'

export interface SolanaPaymentRequest {
  recipient: PublicKey
  amount: BigNumber
  splToken?: PublicKey
  reference: PublicKey
  label: string
  message: string
  memo?: string
}

/**
 * Convert USD amount to USDC (with 6 decimal places)
 */
export function usdToUsdc(usdAmount: number): BigNumber {
  return new BigNumber(usdAmount) // USDC has 6 decimal places but BigNumber handles precision
}

/**
 * Create a Solana Pay payment request
 */
export function createSolanaPaymentRequest(
  amount: number,
  reference: PublicKey,
  label: string = 'Dark Pino Peptides',
  message: string = 'Payment for research peptides'
): SolanaPaymentRequest {
  // Validate merchant wallet
  if (!MERCHANT_WALLET || MERCHANT_WALLET === 'YOUR_MERCHANT_WALLET_ADDRESS') {
    throw new Error('MERCHANT_WALLET not configured. Please set NEXT_PUBLIC_MERCHANT_WALLET environment variable.')
  }

  try {
    return {
      recipient: new PublicKey(MERCHANT_WALLET),
      amount: usdToUsdc(amount),
      splToken: new PublicKey(USDC_MINT_ADDRESS),
      reference,
      label,
      message,
      memo: `Order ${reference.toString().slice(0, 8)}`
    }
  } catch (error) {
    throw new Error(`Invalid wallet configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate a unique reference for payment tracking
 */
export function generatePaymentReference(): PublicKey {
  // Generate a random 32-byte array for the reference
  const bytes = new Uint8Array(32)
  for (let i = 0; i < 32; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return new PublicKey(bytes)
}

/**
 * Check if a transaction with the given reference has been confirmed
 */
export async function checkTransactionStatus(reference: PublicKey): Promise<{
  confirmed: boolean
  signature?: string
  amount?: number
}> {
  try {
    // Use Solana Pay's findReference to locate the transaction
    const signatureInfo = await findReference(connection, reference, {
      finality: 'confirmed'
    })

    if (!signatureInfo) {
      return { confirmed: false }
    }

    const signature = signatureInfo.signature

    // Get transaction details
    const transaction = await connection.getParsedTransaction(signature, {
      commitment: 'confirmed'
    })

    if (!transaction) {
      return { confirmed: false }
    }

    // Look for USDC transfer in the transaction
    const instructions = transaction.transaction.message.instructions
    for (const instruction of instructions) {
      if ('parsed' in instruction && instruction.program === 'spl-token' && 
          instruction.parsed.type === 'transferChecked') {
        const info = instruction.parsed.info
        if (info.mint === USDC_MINT_ADDRESS) {
          return {
            confirmed: true,
            signature,
            amount: parseInt(info.tokenAmount.amount) / 1_000_000 // Convert back to USD
          }
        }
      }
    }

    return { confirmed: false }
  } catch (error) {
    if (error instanceof FindReferenceError) {
      // Transaction not found is expected during polling
      return { confirmed: false }
    }
    console.error('Error checking transaction status:', error)
    return { confirmed: false }
  }
}

/**
 * Create a Solana Pay URL for QR code generation or wallet deep linking
 */
export function createSolanaPayUrl(paymentData: SolanaPaymentRequest): URL {
  const urlParams = new URLSearchParams()
  
  urlParams.set('recipient', paymentData.recipient.toString())
  urlParams.set('amount', paymentData.amount.toString())
  
  if (paymentData.splToken) {
    urlParams.set('spl-token', paymentData.splToken.toString())
  }
  
  urlParams.set('reference', paymentData.reference.toString())
  urlParams.set('label', paymentData.label)
  urlParams.set('message', paymentData.message)
  
  if (paymentData.memo) {
    urlParams.set('memo', paymentData.memo)
  }

  return new URL(`solana:?${urlParams.toString()}`)
}