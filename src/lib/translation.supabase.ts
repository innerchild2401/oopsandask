/**
 * Supabase queries for translation caching
 */

import { supabase } from './supabase'
// Translation types are imported but not used in this file

export class TranslationSupabase {
  // Get cached translation
  static async getTranslation(key: string, languageCode: string): Promise<string | null> {
    try {
      const languageId = await this.getLanguageId(languageCode)
      
      const { data, error } = await supabase
        .from('localized_strings')
        .select('value')
        .eq('key', key)
        .eq('language_id', languageId)
        .single()

      if (error) {
        console.warn('Translation cache miss:', error.message)
        return null
      }

      return data?.value || null
    } catch (error) {
      console.warn('Failed to get translation from cache:', error)
      return null
    }
  }

  // Save translation to cache
  static async saveTranslation(
    key: string, 
    languageCode: string, 
    value: string
  ): Promise<boolean> {
    try {
      const languageId = await this.getLanguageId(languageCode)
      
      const { error } = await supabase
        .from('localized_strings')
        .upsert({
          key,
          language_id: languageId,
          value,
          context: 'ui_translation'
        })

      if (error) {
        console.error('Failed to save translation:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to save translation:', error)
      return false
    }
  }

  // Get all translations for a language
  static async getLanguageTranslations(languageCode: string): Promise<Record<string, string>> {
    try {
      // First get the language ID from the language code
      const languageId = await this.getLanguageId(languageCode)
      
      const { data, error } = await supabase
        .from('localized_strings')
        .select('key, value')
        .eq('language_id', languageId)

      if (error) {
        console.warn('Failed to get language translations:', error)
        return {}
      }

      return data?.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {} as Record<string, string>) || {}
    } catch (error) {
      console.warn('Failed to get language translations:', error)
      return {}
    }
  }

  // Check if language has any cached translations
  static async hasLanguageTranslations(languageCode: string): Promise<boolean> {
    try {
      const languageId = await this.getLanguageId(languageCode)
      
      const { count, error } = await supabase
        .from('localized_strings')
        .select('*', { count: 'exact', head: true })
        .eq('language_id', languageId)

      if (error) {
        console.warn('Failed to check language translations:', error)
        return false
      }

      return (count || 0) > 0
    } catch (error) {
      console.warn('Failed to check language translations:', error)
      return false
    }
  }

  // Get language ID from language code, create if doesn't exist
  static async getLanguageId(languageCode: string): Promise<string> {
    try {
      console.log(`Looking up language ID for code: ${languageCode}`)
      
      // First try to find existing language
      const { data: existing, error: lookupError } = await supabase
        .from('languages')
        .select('id')
        .eq('code', languageCode)
        .maybeSingle() // Use maybeSingle() instead of single() to avoid 406 error
      
      if (lookupError) {
        console.log(`Language lookup error for ${languageCode}:`, lookupError)
      }
      
      if (existing?.id) {
        console.log(`Found existing language ID for ${languageCode}: ${existing.id}`)
        return existing.id
      }

      console.log(`Creating new language entry for ${languageCode}`)
      
      // If not found, create a new language entry
      const { data: newLang, error: createError } = await supabase
        .from('languages')
        .insert({
          code: languageCode,
          name: this.getLanguageName(languageCode),
          native_name: this.getLanguageName(languageCode),
          country_codes: [], // Add required field
          is_active: true
        })
        .select('id')
        .single()

      if (createError) {
        console.warn('Failed to create language:', createError)
        return await this.getEnglishLanguageId() // Fallback to English
      }

      console.log(`Created new language ID for ${languageCode}: ${newLang?.id}`)
      return newLang?.id || await this.getEnglishLanguageId()
    } catch (error) {
      console.warn('Language ID lookup failed:', error)
      return await this.getEnglishLanguageId()
    }
  }

  // Helper to get English language ID as fallback
  private static async getEnglishLanguageId(): Promise<string> {
    try {
      const { data } = await supabase
        .from('languages')
        .select('id')
        .eq('code', 'en')
        .maybeSingle() // Use maybeSingle() instead of single() to avoid 406 error
      
      if (data?.id) {
        return data.id
      }
      
      // If English doesn't exist, create it
      const { data: newEn, error } = await supabase
        .from('languages')
        .insert({
          code: 'en',
          name: 'English',
          native_name: 'English',
          country_codes: ['US', 'GB', 'AU', 'CA', 'NZ', 'IE'],
          is_active: true
        })
        .select('id')
        .single()
      
      if (error) {
        console.error('Failed to create English language:', error)
        return '00000000-0000-0000-0000-000000000000' // Fallback UUID
      }
      
      return newEn?.id || '00000000-0000-0000-0000-000000000000'
    } catch (error) {
      console.error('Failed to get English language ID:', error)
      return '00000000-0000-0000-0000-000000000000'
    }
  }

  // Helper to get language name
  private static getLanguageName(languageCode: string): string {
    // GPT will handle the actual cultural adaptation
    return languageCode.charAt(0).toUpperCase() + languageCode.slice(1)
  }

  // Helper to get language flag
  private static getLanguageFlag(languageCode: string): string {
    // Basic flag mapping - GPT will handle cultural context
    const flagMap: Record<string, string> = {
      'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
      'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
      'ar': '🇸🇦', 'nl': '🇳🇱', 'sv': '🇸🇪', 'no': '🇳🇴', 'da': '🇩🇰',
      'fi': '🇫🇮', 'pl': '🇵🇱', 'tr': '🇹🇷', 'ro': '🇷🇴'
    }
    return flagMap[languageCode] || '🌍'
  }

  // Save language preference for session
  static async saveLanguagePreference(
    sessionId: string, 
    languageCode: string
  ): Promise<boolean> {
    try {
      const languageId = await this.getLanguageId(languageCode)
      
      const { error } = await supabase
        .from('user_sessions')
        .update({ preferred_language_id: languageId })
        .eq('session_token', sessionId)

      if (error) {
        console.warn('Failed to save language preference:', error)
        return false
      }

      return true
    } catch (error) {
      console.warn('Failed to save language preference:', error)
      return false
    }
  }
}
