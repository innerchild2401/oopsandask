import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { 
      mode, 
      language_code, 
      country_code, 
      tokens_used = 0, 
      cost_estimate = 0 
    } = await request.json()

    // Track the generation
    const { error } = await supabase.rpc('track_generation', {
      p_user_id: 'anonymous',
      p_session_id: 'anonymous',
      p_mode: mode,
      p_language_code: language_code,
      p_country_code: country_code,
      p_tokens_used: tokens_used,
      p_cost_estimate: cost_estimate
    })

    if (error) {
      console.error('Failed to track generation:', error)
      return NextResponse.json({ error: 'Failed to track generation' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
