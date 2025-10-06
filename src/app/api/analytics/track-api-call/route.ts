import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, tokens_used, cost_estimate, response_time_ms } = body

    // Generate a simple user_id and session_id for tracking
    const user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Call the track_api_call function
    const { error } = await supabase.rpc('track_api_call', {
      p_endpoint: endpoint,
      p_user_id: user_id,
      p_session_id: session_id,
      p_tokens_used: tokens_used || 0,
      p_cost_estimate: cost_estimate || 0,
      p_response_time_ms: response_time_ms || 0
    })

    if (error) {
      console.error('Error tracking API call:', error)
      return NextResponse.json({ error: 'Failed to track API call' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in track-api-call API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}