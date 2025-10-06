import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { 
      amount, 
      currency = 'USD', 
      payment_method = 'unknown' 
    } = await request.json()

    // Track the donation
    const { error } = await supabase.rpc('track_donation', {
      p_user_id: 'anonymous',
      p_session_id: 'anonymous',
      p_amount: amount,
      p_currency: currency,
      p_payment_method: payment_method
    })

    if (error) {
      console.error('Failed to track donation:', error)
      return NextResponse.json({ error: 'Failed to track donation' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track donation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
