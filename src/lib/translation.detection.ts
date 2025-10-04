/**
 * Language detection service using browser preferences and IP geolocation
 */

import { LanguageDetection } from './translation.types'

export class LanguageDetectionService {
  // Detect language from browser preferences
  static detectBrowserLanguage(): string {
    if (typeof window === 'undefined') return 'en'

    const supportedLanguages = [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 
      'ar', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'tr'
    ]

    // Get browser language
    const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en'
    const primaryLang = browserLang.split('-')[0].toLowerCase()

    // Check if primary language is supported
    if (supportedLanguages.includes(primaryLang)) {
      return primaryLang
    }

    // Check navigator.languages array
    if (navigator.languages) {
      for (const lang of navigator.languages) {
        const langCode = lang.split('-')[0].toLowerCase()
        if (supportedLanguages.includes(langCode)) {
          return langCode
        }
      }
    }

    return 'en' // Fallback to English
  }

  // Detect language from IP geolocation (using a free service)
  static async detectIPLanguage(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('IP detection failed')
      }

      const data = await response.json()
      const countryCode = data.country_code?.toLowerCase()

      // Map country codes to language codes
      const countryToLanguage: Record<string, string> = {
        'us': 'en', 'gb': 'en', 'au': 'en', 'ca': 'en', 'nz': 'en', 'ie': 'en',
        'es': 'es', 'mx': 'es', 'ar': 'es', 'co': 'es', 'pe': 'es', 've': 'es',
        'fr': 'fr', 'be': 'fr', 'ch': 'fr', 'lu': 'fr',
        'de': 'de', 'at': 'de', 'li': 'de',
        'it': 'it', 'sm': 'it', 'va': 'it',
        'pt': 'pt', 'br': 'pt', 'ao': 'pt', 'mz': 'pt',
        'ru': 'ru', 'by': 'ru', 'kz': 'ru', 'kg': 'ru',
        'jp': 'ja',
        'kr': 'ko',
        'cn': 'zh', 'tw': 'zh', 'hk': 'zh', 'sg': 'zh',
        'sa': 'ar', 'ae': 'ar', 'eg': 'ar', 'ma': 'ar', 'tn': 'ar',
        'nl': 'nl',
        'se': 'sv',
        'no': 'no',
        'dk': 'da',
        'fi': 'fi',
        'pl': 'pl',
        'tr': 'tr'
      }

      return countryToLanguage[countryCode] || 'en'
    } catch {
      console.warn('IP language detection failed')
      return 'en'
    }
  }

  // Combined detection with confidence scoring
  static async detectLanguage(): Promise<LanguageDetection> {
    const browserLang = this.detectBrowserLanguage()
    
    try {
      const ipLang = await this.detectIPLanguage()
      
      // If both methods agree, high confidence
      if (browserLang === ipLang) {
        return {
          detectedLanguage: browserLang,
          confidence: 0.9,
          source: 'browser'
        }
      }

      // If they disagree, prefer browser but with lower confidence
      return {
        detectedLanguage: browserLang,
        confidence: 0.6,
        source: 'browser'
      }
    } catch {
      // Fallback to browser detection only
      return {
        detectedLanguage: browserLang,
        confidence: 0.7,
        source: 'browser'
      }
    }
  }

  // Get language display name
  static getLanguageDisplayName(languageCode: string): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'pt': 'Português',
      'ru': 'Русский',
      'ja': '日本語',
      'ko': '한국어',
      'zh': '中文',
      'ar': 'العربية',
      'nl': 'Nederlands',
      'sv': 'Svenska',
      'no': 'Norsk',
      'da': 'Dansk',
      'fi': 'Suomi',
      'pl': 'Polski',
      'tr': 'Türkçe'
    }
    return languageNames[languageCode] || 'English'
  }

  // Get language flag emoji
  static getLanguageFlag(languageCode: string): string {
    const flags: Record<string, string> = {
      'en': '🇺🇸',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'zh': '🇨🇳',
      'ar': '🇸🇦',
      'nl': '🇳🇱',
      'sv': '🇸🇪',
      'no': '🇳🇴',
      'da': '🇩🇰',
      'fi': '🇫🇮',
      'pl': '🇵🇱',
      'tr': '🇹🇷'
    }
    return flags[languageCode] || '🇺🇸'
  }
}
