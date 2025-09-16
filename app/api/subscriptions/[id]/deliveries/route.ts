import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const subscriptionId = id

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
    }

    const { data: deliveries, error } = await supabase
      .from('subscription_deliveries')
      .select(`
        *,
        subscription_delivery_items (*)
      `)
      .eq('subscription_id', subscriptionId)
      .order('delivery_date', { ascending: false })

    if (error) {
      console.error('Error fetching deliveries:', error)
      return NextResponse.json({ error: 'Failed to fetch deliveries' }, { status: 500 })
    }

    return NextResponse.json({ deliveries })
  } catch (error) {
    console.error('Error in deliveries GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const subscriptionId = id
    const { delivery_date, total_amount, items } = await request.json()

    if (!subscriptionId || !delivery_date || !total_amount || !items) {
      return NextResponse.json({ 
        error: 'Subscription ID, delivery date, total amount, and items are required' 
      }, { status: 400 })
    }

    // Create delivery
    const { data: delivery, error: deliveryError } = await supabase
      .from('subscription_deliveries')
      .insert({
        subscription_id: subscriptionId,
        delivery_date,
        status: 'pending',
        total_amount
      } as any)
      .select()
      .single()

    if (deliveryError) {
      console.error('Error creating delivery:', deliveryError)
      return NextResponse.json({ error: 'Failed to create delivery' }, { status: 500 })
    }

    // Create delivery items
    const deliveryItems = items.map((item: any) => ({
      delivery_id: delivery.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price_at_time: item.price_at_time
    }))

    const { error: itemsError } = await supabase
      .from('subscription_delivery_items')
      .insert(deliveryItems)

    if (itemsError) {
      console.error('Error creating delivery items:', itemsError)
      return NextResponse.json({ error: 'Failed to create delivery items' }, { status: 500 })
    }

    // Fetch complete delivery with items
    const { data: completeDelivery, error: fetchError } = await supabase
      .from('subscription_deliveries')
      .select(`
        *,
        subscription_delivery_items (*)
      `)
      .eq('id', delivery.id)
      .single()

    if (fetchError) {
      console.error('Error fetching complete delivery:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch delivery details' }, { status: 500 })
    }

    return NextResponse.json({ delivery: completeDelivery })
  } catch (error) {
    console.error('Error in deliveries POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}