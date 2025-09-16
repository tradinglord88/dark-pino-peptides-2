import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('billing_interval')
      .order('product_count')

    if (error) {
      console.error('Error fetching subscription plans:', error)
      return NextResponse.json({ error: 'Failed to fetch subscription plans' }, { status: 500 })
    }

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Error in subscription-plans GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}