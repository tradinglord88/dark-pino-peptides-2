import { NextRequest, NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import { checkTransactionStatus } from '@/lib/solana/payment'

export async function POST(request: NextRequest) {
  try {
    const { reference, expectedAmount } = await request.json()

    if (!reference || !expectedAmount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Convert reference string to PublicKey
    const referenceKey = new PublicKey(reference)

    // Check transaction status
    const result = await checkTransactionStatus(referenceKey)

    if (!result.confirmed) {
      return NextResponse.json(
        { verified: false, message: 'Transaction not found or not confirmed' },
        { status: 200 }
      )
    }

    // Verify the amount matches
    if (result.amount && Math.abs(result.amount - expectedAmount) > 0.01) {
      return NextResponse.json(
        { 
          verified: false, 
          message: `Amount mismatch. Expected: $${expectedAmount}, Received: $${result.amount}` 
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      verified: true,
      signature: result.signature,
      amount: result.amount,
      message: 'Payment verified successfully'
    })

  } catch (error) {
    console.error('Solana payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}