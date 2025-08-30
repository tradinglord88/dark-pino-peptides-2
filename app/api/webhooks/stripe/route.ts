import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // TODO: Handle Stripe webhooks
    const body = await request.text()
    
    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 })
  }
}