import { NextRequest, NextResponse } from 'next/server'
import { TranslationSupabase } from '@/lib/translation.supabase'
import { GPTTranslationService } from '@/lib/translation.gpt'

export async function POST(request: NextRequest) {
  try {
    const { languageCode, translationKeys } = await request.json()
    
    if (!languageCode || !translationKeys) {
      return NextResponse.json(
        { error: 'Language code and translation keys are required' },
        { status: 400 }
      )
    }

    // Check if translations already exist
    const existingTranslations = await TranslationSupabase.getLanguageTranslations(languageCode)
    
    if (Object.keys(existingTranslations).length > 0) {
      return NextResponse.json({
        translations: existingTranslations,
        cached: true
      })
    }

    // Generate new translations
    const generatedTranslations = await GPTTranslationService.translateBatch(
      translationKeys,
      languageCode
    )

    // Save to cache
    for (const [key, value] of Object.entries(generatedTranslations)) {
      await TranslationSupabase.saveTranslation(key, languageCode, value)
    }

    return NextResponse.json({
      translations: generatedTranslations,
      cached: false
    })

  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate translations' },
      { status: 500 }
    )
  }
}
