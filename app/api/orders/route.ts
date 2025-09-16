import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'
import { InsertOrder, InsertOrderItem, InsertShippingAddress, Order } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      guest_email,
      total_amount,
      payment_method,
      items,
      shipping_info,
      stripe_session_id,
      solana_signature,
      etransfer_reference,
    } = body

    // Validate required fields
    if (!total_amount || !payment_method || !items || !shipping_info) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create order
    const orderData: InsertOrder = {
      user_id: user_id || null,
      guest_email: guest_email || null,
      total_amount,
      payment_method,
      status: 'pending',
      stripe_session_id: stripe_session_id || null,
      solana_signature: solana_signature || null,
      etransfer_reference: etransfer_reference || null,
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData as any)
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    if (!order) {
      console.error('Order was not created')
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // TypeScript type assertion to fix 'never' type
    const typedOrder = order as Order

    // Create order items
    const orderItems: InsertOrderItem[] = items.map((item: any) => ({
      order_id: typedOrder.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price_at_time: item.product.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems as any)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Try to clean up the order
      await supabase.from('orders').delete().eq('id', typedOrder.id)
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      )
    }

    // Create shipping address
    const shippingData: InsertShippingAddress = {
      order_id: typedOrder.id,
      first_name: shipping_info.firstName,
      last_name: shipping_info.lastName,
      email: shipping_info.email,
      phone: shipping_info.phone || null,
      address: shipping_info.address,
      city: shipping_info.city,
      state: shipping_info.state,
      postal_code: shipping_info.postalCode,
      country: shipping_info.country,
    }

    const { error: shippingError } = await supabase
      .from('shipping_addresses')
      .insert(shippingData as any)

    if (shippingError) {
      console.error('Error creating shipping address:', shippingError)
      // Try to clean up the order and items
      await supabase.from('orders').delete().eq('id', typedOrder.id)
      return NextResponse.json(
        { error: 'Failed to create shipping address' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      order_id: typedOrder.id,
      order: typedOrder 
    })

  } catch (error) {
    console.error('Error in orders API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, status, stripe_session_id, solana_signature, etransfer_reference } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const updateData: any = { status }
    
    if (stripe_session_id) updateData.stripe_session_id = stripe_session_id
    if (solana_signature) updateData.solana_signature = solana_signature
    if (etransfer_reference) updateData.etransfer_reference = etransfer_reference

    let query = supabase.from('orders').update(updateData as any)
    
    // Allow finding by order_id or stripe_session_id
    if (order_id) {
      query = query.eq('id', order_id)
    } else if (stripe_session_id) {
      query = query.eq('stripe_session_id', stripe_session_id)
    } else {
      return NextResponse.json(
        { error: 'Either order_id or stripe_session_id is required' },
        { status: 400 }
      )
    }

    const { data: order, error } = await query.select().single()

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, order })

  } catch (error) {
    console.error('Error in orders update API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}