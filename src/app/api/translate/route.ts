import { NextRequest, NextResponse } from 'next/server'
import { TranslationSupabase } from '@/lib/translation.supabase'
import { GPTTranslationService } from '@/lib/translation.gpt'

export async function POST(request: NextRequest) {
  try {
    const { languageCode, translationKeys } = await request.json()
    
    console.log(`[API] Translation request for ${languageCode} with ${translationKeys?.length || 0} keys`)
    
    if (!languageCode || !translationKeys) {
      console.log(`[API] Missing required parameters: languageCode=${languageCode}, translationKeys=${!!translationKeys}`)
      return NextResponse.json(
        { error: 'Language code and translation keys are required' },
        { status: 400 }
      )
    }

    // Check if translations already exist
    const existingTranslations = await TranslationSupabase.getLanguageTranslations(languageCode)
    console.log(`[API] Existing translations for ${languageCode}: ${Object.keys(existingTranslations).length} keys`)
    
    if (Object.keys(existingTranslations).length > 0) {
      console.log(`[API] Returning cached translations for ${languageCode}`)
      return NextResponse.json({
        translations: existingTranslations,
        cached: true
      })
    }

    // Generate new translations
    console.log(`[API] Generating new translations for ${languageCode}`)
    const generatedTranslations = await GPTTranslationService.translateBatch(
      translationKeys,
      languageCode
    )
    console.log(`[API] Generated ${Object.keys(generatedTranslations).length} translations`)

    // Save to cache
    console.log(`[API] Saving translations to cache...`)
    for (const [key, value] of Object.entries(generatedTranslations)) {
      await TranslationSupabase.saveTranslation(key, languageCode, value)
    }
    console.log(`[API] Translations saved to cache`)

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
