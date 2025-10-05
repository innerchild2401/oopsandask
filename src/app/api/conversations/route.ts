import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { 
      originalText, 
      generatedText, 
      mode, 
      recipientName, 
      recipientRelationship, 
      language, 
      replyVoice = 'dramatic' 
    } = await request.json()

    // Store conversation in Supabase
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        original_text: originalText,
        generated_text: generatedText,
        mode: mode,
        recipient_name: recipientName,
        recipient_relationship: recipientRelationship,
        language: language,
        reply_voice: replyVoice
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to store conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      conversationId: data.id,
      success: true 
    })

  } catch (error) {
    console.error('Conversation storage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('id')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      )
    }

    // Fetch conversation from Supabase
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Conversation not found or expired' },
        { status: 404 }
      )
    }

    // Check if conversation has expired
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Conversation has expired' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      originalText: data.original_text,
      generatedText: data.generated_text,
      mode: data.mode,
      recipientName: data.recipient_name,
      recipientRelationship: data.recipient_relationship,
      language: data.language,
      replyVoice: data.reply_voice
    })

  } catch (error) {
    console.error('Conversation retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
