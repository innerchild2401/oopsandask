import { NextRequest, NextResponse } from 'next/server'
import { TranslationSupabase } from '@/lib/translation.supabase'

export async function POST(request: NextRequest) {
  try {
    const { languageCode } = await request.json()
    
    if (!languageCode) {
      return NextResponse.json(
        { error: 'Language code is required' },
        { status: 400 }
      )
    }

    // Get the language ID
    const languageId = await TranslationSupabase.getLanguageId(languageCode)
    
    // Delete all cached translations for this language
    const { supabase } = await import('@/lib/supabase')
    const { error } = await supabase
      .from('localized_strings')
      .delete()
      .eq('language_id', languageId)

    if (error) {
      console.error('Failed to clear cache:', error)
      return NextResponse.json(
        { error: 'Failed to clear cache' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Cache cleared for language: ${languageCode}`,
      languageId
    })

  } catch (error) {
    console.error('Clear cache API error:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
