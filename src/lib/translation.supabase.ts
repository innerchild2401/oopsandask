/**
 * Supabase queries for translation caching
 */

import { supabase } from './supabase'
// Translation types are imported but not used in this file

export class TranslationSupabase {
  // Get cached translation
  static async getTranslation(key: string, language: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('localized_strings')
        .select('value')
        .eq('key', key)
        .eq('language_id', language)
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
    language: string, 
    value: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('localized_strings')
        .upsert({
          key,
          language_id: language,
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
  static async getLanguageTranslations(language: string): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from('localized_strings')
        .select('key, value')
        .eq('language_id', language)

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
  static async hasLanguageTranslations(language: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('localized_strings')
        .select('*', { count: 'exact', head: true })
        .eq('language_id', language)

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

  // Get language ID from language code
  static async getLanguageId(languageCode: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('id')
        .eq('code', languageCode)
        .single()

      if (error) {
        console.warn('Language ID lookup failed:', error)
        return 'en' // Fallback to English
      }

      return data?.id || 'en'
    } catch (error) {
      console.warn('Language ID lookup failed:', error)
      return 'en'
    }
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
