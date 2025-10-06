import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { 
      endpoint, 
      tokens_used = 0, 
      cost_estimate = 0, 
      response_time_ms = 0 
    } = await request.json()

    // Track the API call
    const { error } = await supabase.rpc('track_api_call', {
      p_endpoint: endpoint,
      p_user_id: 'anonymous',
      p_session_id: 'anonymous',
      p_tokens_used: tokens_used,
      p_cost_estimate: cost_estimate,
      p_response_time_ms: response_time_ms
    })

    if (error) {
      console.error('Failed to track API call:', error)
      return NextResponse.json({ error: 'Failed to track API call' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track API call error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
