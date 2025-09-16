import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, ...updates } = await request.json()
    const { id } = await params
    const subscriptionId = id

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
    }

    // Validate status if provided
    const validStatuses = ['active', 'paused', 'cancelled', 'expired', 'trial']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid subscription status' }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = { ...updates }
    if (status) {
      updateData.status = status
      if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString()
      }
    }

    // Update subscription
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .update(updateData)
      .eq('id', subscriptionId)
      .select(`
        *,
        subscription_plans (*)
      `)
      .single()

    if (error) {
      console.error('Error updating subscription:', error)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error in subscription PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const subscriptionId = id

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
    }

    // Cancel subscription instead of deleting
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .select()
      .single()

    if (error) {
      console.error('Error cancelling subscription:', error)
      return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error in subscription DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}