import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, successUrl, cancelUrl } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Create line items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.description || '',
          images: item.product.image_url ? [item.product.image_url] : [],
          metadata: {
            product_id: item.product.id,
            category: item.product.category_tags?.join(',') || ''
          }
        },
        unit_amount: Math.round(item.product.price * 100) // Convert to cents
      },
      quantity: item.quantity
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'SG', 'HK', 'JP', 'KR', 'CN', 'TW', 'TH', 'MY', 'PH', 'ID', 'VN', 'IN', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'PL', 'CZ', 'HU', 'RO', 'BG', 'GR', 'TR', 'IL', 'AE', 'SA', 'EG', 'ZA', 'NG', 'KE', 'MA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO']
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 995, // $9.95
              currency: 'usd'
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5
              },
              maximum: {
                unit: 'business_day',
                value: 10
              }
            }
          }
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1995, // $19.95
              currency: 'usd'
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2
              },
              maximum: {
                unit: 'business_day',
                value: 5
              }
            }
          }
        }
      ],
      metadata: {
        order_type: 'peptides',
        source: 'website'
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'if_required',
      payment_intent_data: {
        metadata: {
          order_items: JSON.stringify(items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price
          })))
        }
      }
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session ID provided' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer']
    })

    return NextResponse.json({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
      shipping_details: session.shipping_details
    })
  } catch (error) {
    console.error('Stripe session retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve checkout session' },
      { status: 500 }
    )
  }
}