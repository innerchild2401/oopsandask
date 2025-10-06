import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, payment_method } = body

    // Generate a simple user_id and session_id for tracking
    const user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Call the track_donation function
    const { error } = await supabase.rpc('track_donation', {
      p_user_id: user_id,
      p_session_id: session_id,
      p_amount: amount || 0,
      p_currency: currency || 'USD',
      p_payment_method: payment_method || null
    })

    if (error) {
      console.error('Error tracking donation:', error)
      return NextResponse.json({ error: 'Failed to track donation' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in track-donation API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}