'use client'

import { LanguageOption } from '@/lib/types'

// Default language with country flags
export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
]

// Default translations - these will be replaced by Supabase data
export const DEFAULT_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.oops': 'Oops',
    'nav.ask': 'Ask',
    'nav.app_title': 'Oops & Ask',
    'nav.tagline': 'AI-Powered Dramatic Communication',

    // Home page
    'home.welcome': 'Welcome to Oops & Ask',
    'home.subtitle': 'Transform your messages into dramatic masterpieces',
    'home.oops_title': 'Oops! 😬',
    'home.oops_description': 'Generate over-the-top, theatrical apologies that turn mistakes into memorable moments.',
    'home.ask_title': 'Ask 💌',
    'home.ask_description': 'Create persuasive requests with optional Attorney Mode using fake laws and citations.',
    'home.get_started': 'Get Started',
    'home.language_select': 'Select Language',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.generate': 'Generate',
    'common.cancel': 'Cancel',
    'common.copy': 'Copy',
    'common.share': 'Share',
    'common.rating': 'Rate this',
    'common.close': 'Close',
    'common.submit': 'Submit',
    'common.try_again': 'Try Another',
    'common.original_text': 'What did you do wrong?',
    'common.select_persona': 'Choose Your Style',
    'common.select_relationship': 'Who are you writing to?',
    'common.mode_oops': 'Oops Mode',
    'common.mode_ask': 'Ask Mode',
    'common.mode_attorney': 'Attorney Mode',

    // Oops page
    'oops.title': 'Oops! Generate Your Dramatic Apology',
    'oops.description': 'Turn your mistakes into unforgettable apologies',
    'oops.input_placeholder': 'What did you do wrong? Tell us everything...',
    'oops.generate_button': 'Generate Dramatic Apology',

    // Ask page
    'ask.title': 'Ask! Generate Your Persuasive Request',
    'ask.description': 'Craft convincing requests using dramatic flair',
    'ask.input_placeholder': 'What do you want to ask for?',
    'ask.generate_button': 'Generate Persuasive Request',
    'ask.attorney_mode': 'Enable Attorney Mode',
    'ask.attorney_hint': 'Add fake legal citations and lawyer speak',

    // Footer
    'footer.buy_coffee': 'Buy me a coffee',
    'footer.support_message': 'Support Oops & Ask',

    // Modal/Components
    'modal.error_title': 'Oops! An Error Occurred',
    'modal.success_title': 'Success!',
    'modal.copy_success': 'Copied to clipboard!',
    'modal.share_success': 'Link copied to clipboard!',
  },
  // Spanish translations
  es: {
    'nav.home': 'Inicio',
    'nav.oops': 'Ups',
    'nav.ask': 'Pedir',
    'nav.app_title': 'Ups y Pedir',
    'nav.tagline': 'Comunicación Dramática con IA',

    'home.welcome': 'Bienvenido a Ups y Pedir',
    'home.subtitle': 'Transforma tus mensajes en obras maestras dramáticas',
    'home.oops_title': '¡Ups! 😬',
    'home.oops_description': 'Genera disculpas teatrales exageradas que convierten errores en momentos memorables.',
    'home.ask_title': 'Pedir 💌',
    'home.ask_description': 'Crea solicitudes persuasivas con modo Abogado opcional usando leyes falsas y citaciones.',
    'home.get_started': 'Comenzar',
    'home.language_select': 'Seleccionar Idioma',

    'common.loading': 'Cargando...',
    'common.error': 'Algo salió mal',
    'common.generate': 'Generar',
    'common.copy': 'Copiar',
    'common.share': 'Compartir',
    'common.rating': 'Calificar',
    'common.close': 'Cerrar',
    'common.submit': 'Enviar',
    'common.try_again': 'Intentar Otro',

    'oops.title': '¡Ups! Genera Tu Disculpa Dramática',
    'oops.description': 'Convierte tus errores en disculpas inolvidables',
    'oops.input_placeholder': '¿Qué hiciste mal? Cuéntanos todo...',
    'oops.generate_button': 'Generar Disculpa Dramática',

    'ask.title': '¡Pedir! Genera Tu Solicitud Persuasiva',
    'ask.description:': 'Crea solicitudes convincentes con dramatismo',
    'ask.input_placeholder': '¿Qué quieres pedir?',
    'ask.generate_button': 'Generar Solicitud Persuasiva',
  }
}

// Internationalization class
export class I18n {
  private currentLanguage: string = 'en'
  private translations: Record<string, string> = {}

  constructor(initialLanguage?: string) {
    if (initialLanguage && this.isValidLanguage(initialLanguage)) {
      this.currentLanguage = initialLanguage
    }
    this.loadTranslations(this.currentLanguage)
  }

  private isValidLanguage(code: string): boolean {
    return AVAILABLE_LANGUAGES.some(lang => lang.code === code)
  }

  private loadTranslations(languageCode: string): void {
    // First load default translations
    this.translations = DEFAULT_TRANSLATIONS[languageCode] || DEFAULT_TRANSLATIONS['en']
    
    // Then try to load from Supabase (this will be async in real usage)
    this.loadFromSupabase(languageCode)
  }

  private async loadFromSupabase(_languageCode: string): Promise<void> {
    try {
      // This will be implemented with actual Supabase call
      // const { supabaseHelpers } = await import('@/lib/supabase')
      // this.translations = await supabaseHelpers.getLocalizedStrings(languageCode)
    } catch (error) {
      console.warn('Failed to load translations from Supabase:', error)
    }
  }

  setLanguage(languageCode: string): void {
    if (this.isValidLanguage(languageCode)) {
      this.currentLanguage = languageCode
      this.loadTranslations(languageCode)
    }
  }

  getLanguage(): string {
    return this.currentLanguage
  }

  getCurrentLanguageObject(): LanguageOption {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === this.currentLanguage) 
      || AVAILABLE_LANGUAGES[0] // Fallback to English
  }

  t(key: string, fallback?: string): string {
    return this.translations[key] || fallback || key
  }

  // Get translations for a group of keys with a prefix
  tGroup(prefix: string): Record<string, string> {
    const group: Record<string, string> = {}
    Object.keys(this.translations).forEach(key => {
      if (key.startsWith(prefix + '.')) {
        const subKey = key.substring(prefix.length + 1)
        group[subKey] = this.translations[key]
      }
    })
    return group
  }

  // Detect language from browser
  static detectBrowserLanguage(): string {
    if (typeof window === 'undefined') return 'en'
    
    const browserLang = navigator.language.split('-')[0]
    const availableCodes = AVAILABLE_LANGUAGES.map(lang => lang.code)
    
    return availableCodes.includes(browserLang) ? browserLang : 'en'
  }

  // Get language by country code
  static getLanguageByCountry(countryCode: string): string {
    // Default country mappings
    const countryMappings: Record<string, string> = {
      'US': 'en', 'GB': 'en', 'AU': 'en', 'CA': 'en',
      'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es',
      'FR': 'fr', 'BE': 'fr', 'CH': 'fr',
      'DE': 'de', 'AT': 'de',
      'IT': 'it',
      'PT': 'pt', 'BR': 'pt',
      'RU': 'ru',
      'JP': 'ja',
      'KR': 'ko',
      'CN': 'zh',
      'SA': 'ar', 'AE': 'ar', 'EG': 'ar',
      'NL': 'nl',
      'SE': 'sv',
      'NO': 'no',
      'DK': 'da',
      'FI': 'fi',
      'PL': 'pl',
      'TR': 'tr',
    }
    
    return countryMappings[countryCode.toUpperCase()] || 'en'
  }
}

// Singleton instance
export const i18n = new I18n()

// React hook for translations
export function useTranslation() {
  return {
    t: i18n.t.bind(i18n),
    setLanguage: i18n.setLanguage.bind(i18n),
    currentLanguage: i18n.getCurrentLanguageObject(),
    availableLanguages: AVAILABLE_LANGUAGES,
  }
}
