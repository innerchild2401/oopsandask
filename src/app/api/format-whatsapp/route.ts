import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { originalText, generatedText, language } = await request.json()
    
    // Get the current domain dynamically
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host') || 'oopsnandask.vercel.app'
    const baseUrl = `${protocol}://${host}`
    
    if (!originalText || !generatedText || !language) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Check OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create a prompt to format the WhatsApp message in the correct language
    const prompt = `Format this message for WhatsApp sharing in ${language}. 

Original text: "${originalText}"
Generated text: "${generatedText}"

Create a natural, flowing WhatsApp message with this structure:
- Start with the original text
- Add a natural phrase meaning "In other words:" in ${language}
- Include the generated text (preserve ALL formatting including line breaks, paragraphs, *bold*, etc.)
- End with a friendly phrase meaning "Want to answer in the same witty manner?" in ${language}
- Add the link: ${baseUrl}?lang=${language}

CRITICAL FORMATTING RULES:
- NO numbered lists or bullet points - make it flow naturally like a conversation
- Use ONLY standard ASCII characters and emojis
- NO invisible characters, zero-width spaces, or special Unicode
- Use regular line breaks (\n) for paragraphs
- Use *text* for bold formatting (WhatsApp standard)
- Use regular spaces, not non-breaking spaces
- Make it feel like a friendly, natural message
- Preserve paragraph breaks with double line breaks (\n\n)
- Keep it simple, clean, and joyful

Make sure all text is in ${language} and flows naturally like a casual WhatsApp conversation.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that formats messages for WhatsApp sharing. Always respond in the requested language.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to format message', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    let formattedMessage = data.choices[0]?.message?.content?.trim()

    if (!formattedMessage) {
      return NextResponse.json(
        { error: 'No formatted message generated' },
        { status: 500 }
      )
    }

    // Clean up any invisible characters or formatting issues
    formattedMessage = formattedMessage
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
      .replace(/\u00A0/g, ' ') // Replace non-breaking spaces with regular spaces
      .replace(/\u2013/g, '-') // Replace en-dash with regular dash
      .replace(/\u2014/g, '--') // Replace em-dash with double dash
      .replace(/\u2018/g, "'") // Replace left single quotation mark
      .replace(/\u2019/g, "'") // Replace right single quotation mark
      .replace(/\u201C/g, '"') // Replace left double quotation mark
      .replace(/\u201D/g, '"') // Replace right double quotation mark
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks to 2
      .replace(/^\d+\.\s*/gm, '') // Remove numbered list formatting
      .replace(/^[-•]\s*/gm, '') // Remove bullet point formatting
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up excessive spacing
      .trim()

    return NextResponse.json({
      formattedMessage
    })

  } catch (error) {
    console.error('Format WhatsApp API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
