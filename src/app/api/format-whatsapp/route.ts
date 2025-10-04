import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { originalText, generatedText, language } = await request.json()
    
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

Format it as:
1. The original text
2. A phrase meaning "In other words:" in ${language}
3. The generated text (preserve any formatting like *bold*)
4. A phrase meaning "Want to answer in the same witty manner?" in ${language}
5. The link: https://oopsnandask.vercel.app

Make sure all text is in ${language} and properly formatted for WhatsApp. Use line breaks appropriately.`

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
    const formattedMessage = data.choices[0]?.message?.content?.trim()

    if (!formattedMessage) {
      return NextResponse.json(
        { error: 'No formatted message generated' },
        { status: 500 }
      )
    }

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
