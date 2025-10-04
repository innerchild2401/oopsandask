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
      // First try to find existing language
      const { data: existing } = await supabase
        .from('languages')
        .select('id')
        .eq('code', languageCode)
        .single()
      
      if (existing?.id) {
        return existing.id
      }

      // If not found, create a new language entry
      const { data: newLang, error: createError } = await supabase
        .from('languages')
        .insert({
          code: languageCode,
          name: this.getLanguageName(languageCode),
          native_name: this.getLanguageName(languageCode),
          flag: this.getLanguageFlag(languageCode),
          is_active: true
        })
        .select('id')
        .single()

      if (createError) {
        console.warn('Failed to create language:', createError)
        return 'en' // Fallback to English
      }

      return newLang?.id || 'en'
    } catch (error) {
      console.warn('Language ID lookup failed:', error)
      return 'en'
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
    language: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ preferred_language_id: language })
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
