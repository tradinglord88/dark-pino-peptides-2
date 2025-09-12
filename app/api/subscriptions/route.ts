import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user subscriptions with plan details
    const { data: subscriptions, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscriptions:', error)
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
    }

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Error in subscriptions GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, plan_id } = await request.json()

    if (!user_id || !plan_id) {
      return NextResponse.json({ error: 'User ID and Plan ID are required' }, { status: 400 })
    }

    // Get the subscription plan
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', plan_id)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 })
    }

    // Calculate subscription period
    const now = new Date()
    const currentPeriodStart = now.toISOString()
    
    let currentPeriodEnd: Date
    switch (plan.billing_interval) {
      case 'monthly':
        currentPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
        break
      case 'quarterly':
        currentPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
        break
      case 'yearly':
        currentPeriodEnd = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        break
      default:
        currentPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
    }

    // Create subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id,
        plan_id,
        status: plan.trial_days > 0 ? 'trial' : 'active',
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd.toISOString(),
        trial_end: plan.trial_days > 0 
          ? new Date(now.getTime() + plan.trial_days * 24 * 60 * 60 * 1000).toISOString()
          : null
      })
      .select()
      .single()

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

    // Create subscription preferences with defaults
    await supabase
      .from('subscription_preferences')
      .insert({
        subscription_id: subscription.id,
        preferred_delivery_day: 1,
        skip_months: [],
        special_instructions: null,
        allergy_info: null
      })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error in subscriptions POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}