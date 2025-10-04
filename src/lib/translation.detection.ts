/**
 * Language detection service using browser preferences and IP geolocation
 */

import { LanguageDetection } from './translation.types'

export class LanguageDetectionService {
  // Detect language from browser preferences
  static detectBrowserLanguage(): string {
    if (typeof window === 'undefined') return 'en'

    // Get browser language - GPT can handle any language
    const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en'
    const primaryLang = browserLang.split('-')[0].toLowerCase()

    // Return the detected language - GPT will handle it
    return primaryLang
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
      
      console.log('IP detection data:', { 
        countryCode, 
        country: data.country_name,
        fullData: data 
      })

      // Map country codes to language codes - basic mapping, GPT will handle cultural adaptation
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
        'tr': 'tr',
        'ro': 'ro'
      }

      // Return detected language or fallback to English
      const detectedLang = countryToLanguage[countryCode] || 'en'
      console.log('IP language detection result:', { countryCode, detectedLang })
      return detectedLang
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
      
      console.log(`Language detection: browser=${browserLang}, ip=${ipLang}`)
      
      // If both methods agree, high confidence
      if (browserLang === ipLang) {
        return {
          detectedLanguage: browserLang,
          confidence: 0.9,
          source: 'browser'
        }
      }

      // If they disagree, prefer IP detection for non-English countries
      // IP detection is more reliable for location-based language selection
      if (ipLang !== 'en') {
        return {
          detectedLanguage: ipLang,
          confidence: 0.8,
          source: 'ip'
        }
      }

      // If IP detected English but browser has something else, prefer browser
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
      'tr': 'Türkçe',
      'ro': 'Română'
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
      'tr': '🇹🇷',
      'ro': '🇷🇴'
    }
    return flags[languageCode] || '🇺🇸'
  }
}
