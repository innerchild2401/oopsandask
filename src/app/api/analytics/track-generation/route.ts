import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mode, language_code, country_code, tokens_used, cost_estimate } = body

    // Generate a simple user_id and session_id for tracking
    const user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Call the track_generation function
    const { error } = await supabase.rpc('track_generation', {
      p_user_id: user_id,
      p_session_id: session_id,
      p_mode: mode,
      p_language_code: language_code,
      p_country_code: country_code || null,
      p_tokens_used: tokens_used || 0,
      p_cost_estimate: cost_estimate || 0
    })

    if (error) {
      console.error('Error tracking generation:', error)
      return NextResponse.json({ error: 'Failed to track generation' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in track-generation API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}