/**
 * Main translation hook and context provider
 */

'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { TranslationContext as TranslationContextType, TranslationKey } from './translation.types'
import { TranslationSupabase } from './translation.supabase'
import { LanguageDetectionService } from './translation.detection'

// English fallback translations
const ENGLISH_TRANSLATIONS: Record<TranslationKey, string> = {
  // Navigation
  'nav.home': 'Home',
  'nav.oops': 'Oops',
  'nav.ask': 'Ask',
  'nav.app_title': 'Oops & Ask',
  'nav.tagline': 'Dramatic AI for Life\'s Awkward Moments',
  
  // Home page
  'home.welcome': 'Welcome to Oops & Ask',
  'home.subtitle': 'Transform your awkward moments into dramatic masterpieces',
  'home.oops_title': '😬 Oops Mode',
  'home.oops_description': 'Turn your mistakes into theatrical apologies worthy of Shakespeare',
  'home.ask_title': '💌 Ask Mode',
  'home.ask_description': 'Transform your requests into persuasive manifestos of desire',
  'home.get_started': 'Get Started',
  'home.language_select': 'Select Language',
  
  // Common UI
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.generate': 'Generate',
  'common.cancel': 'Cancel',
  'common.copy': 'Copy',
  'common.share': 'Share',
  'common.rating': 'Rating',
  'common.close': 'Close',
  'common.submit': 'Submit',
  'common.try_again': 'Try Again',
  'common.regenerate': 'Regenerate',
  'common.original_text': 'Original Text',
  'common.select_persona': 'Select Persona',
  'common.select_relationship': 'Select Relationship',
  'common.mode_oops': 'Oops Mode',
  'common.mode_ask': 'Ask Mode',
  'common.mode_attorney': 'Attorney Mode',
  'common.recipient_name': 'Recipient Name',
  'common.recipient_relationship': 'Recipient Relationship',
  'common.who_are_you_apologizing_to': 'Who are you apologizing to? (Optional)',
  'common.who_are_you_asking': 'Who are you asking? (Optional)',
  'common.relationship_placeholder': 'Select relationship...',
  'common.what_happened': 'What happened?',
  'common.what_do_you_want': 'What do you want to ask for?',
  
  // Oops page
  'oops.title': 'Dramatic Apologies',
  'oops.description': 'Transform your mistakes into theatrical masterpieces',
  'oops.input_placeholder': 'Describe what you did wrong...',
  'oops.generate_button': 'Generate Apology',
  'oops.tips_title': 'Tips for Better Apologies',
  'oops.tip_1': 'Be specific about what you did wrong',
  'oops.tip_2': 'Mention how it affected the other person',
  'oops.tip_3': 'Include details about your regret',
  'oops.tip_4': 'Suggest how you\'ll make things right',
  'oops.tip_5': 'Be genuine and heartfelt',
  'oops.example_title': 'Example Apologies',
  'oops.stats_title': 'Generation Stats',
  'oops.switch_mode_title': 'Switch Mode',
  'oops.switch_mode_description': 'Need to make a request instead? Try Ask mode!',
  'oops.switch_mode_button': 'Switch to Ask Mode',
  
  // Ask page
  'ask.title': 'Persuasive Requests',
  'ask.description': 'Transform your requests into compelling manifestos',
  'ask.input_placeholder': 'What would you like to ask for?',
  'ask.generate_button': 'Generate Request',
  'ask.attorney_mode': 'Attorney Mode',
  'ask.attorney_hint': 'Use dramatic legal language with fake citations',
  'ask.tips_title': 'Tips for Better Requests',
  'ask.tip_1': 'Be clear about what you\'re asking for',
  'ask.tip_2': 'Explain why this request is important to you',
  'ask.tip_3': 'Mention how the other person can help',
  'ask.tip_4': 'Offer something in return if appropriate',
  'ask.tip_5': 'Use respectful and persuasive language',
  'ask.tip_6': 'Fake legal citations add dramatic flair',
  'ask.example_title': 'Example Requests',
  'ask.stats_title': 'Generation Stats',
  'ask.switch_mode_title': 'Switch Mode',
  'ask.switch_mode_description': 'Need to apologize instead? Try Oops mode!',
  'ask.switch_mode_button': 'Switch to Oops Mode',
  
  // Footer
  'footer.buy_coffee': 'Buy Me a Coffee',
  'footer.support_message': 'Support us with a coffee to keep the drama alive!',
  
  // Modals
  'modal.error_title': 'Error',
  'modal.success_title': 'Success',
  'modal.copy_success': 'Copied to clipboard!',
  'modal.share_success': 'Shared successfully!',
  'modal.language_detected_title': 'Language Detected!',
  'modal.language_detected_message': 'We detected you might prefer {language}. Which would you like to use?',
  'modal.language_detected_use_detected': 'Use {language}',
  'modal.language_detected_use_english': 'Use English',
  'modal.donation_title': 'Wow! {count} Generations!',
  'modal.donation_message': 'You\'ve been creating dramatic masterpieces! If you\'re enjoying Oops & Ask, consider supporting us with a coffee.',
  'modal.donation_features_title': 'Why Support Us?',
  'modal.donation_feature_1': 'Keep the AI magic flowing',
  'modal.donation_feature_2': 'Fuel our late-night coding sessions',
  'modal.donation_feature_3': 'Unlock even more dramatic features!',
  'modal.donation_feature_4': 'Support the development team',
  'modal.donation_buy_coffee': 'Buy Me a Coffee!',
  'modal.donation_maybe_later': 'Maybe Later',
  'modal.donation_footer': 'Every cup helps us keep the drama alive!',
  
  // Output card
  'output.dramatic_apology': 'Dramatic Apology',
  'output.persuasive_request': 'Persuasive Request',
  'output.legal_request': 'Legal Request',
  'output.awaits_apology': 'Your dramatic apology awaits',
  'output.awaits_request': 'Your persuasive request awaits',
  'output.awaits_legal': 'Your legal request awaits',
  'output.describe_mistake': 'Describe what you did wrong and let our AI transform it into a theatrical masterpiece.',
  'output.enable_legal': 'Enable dramatic legal language with fake citations.',
  'output.craft_convincing': 'Craft convincing requests using dramatic flair.',
  'output.rate_apology': 'Rate this apology:',
  'output.rate_request': 'Rate this request:',
  
  // Language names
  'language.english': 'English',
  'language.spanish': 'Español',
  'language.french': 'Français',
  'language.german': 'Deutsch',
  'language.italian': 'Italiano',
  'language.portuguese': 'Português',
  'language.russian': 'Русский',
  'language.japanese': '日本語',
  'language.korean': '한국어',
  'language.chinese': '中文',
  'language.arabic': 'العربية',
  'language.dutch': 'Nederlands',
  'language.swedish': 'Svenska',
  'language.norwegian': 'Norsk',
  'language.danish': 'Dansk',
  'language.finnish': 'Suomi',
  'language.polish': 'Polski',
  'language.turkish': 'Türkçe'
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>('en')
  const [isLoading, setIsLoading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [translations, setTranslations] = useState<Record<string, string>>({})
  
  // Add unique instance ID for debugging
  const instanceId = React.useMemo(() => Math.random().toString(36).substr(2, 9), [])

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('oops-ask-language')
    if (savedLanguage) {
      setLanguageState(savedLanguage)
      loadTranslations(savedLanguage)
    } else {
      // Detect language on first visit
      detectAndSetLanguage()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Detect language and show modal
  const detectAndSetLanguage = async () => {
    setIsDetecting(true)
    try {
      const detection = await LanguageDetectionService.detectLanguage()
      console.log('Language detection result:', detection)
      setDetectedLanguage(detection.detectedLanguage)
      
      // Only show modal if confidence is high and it's not English
      if (detection.confidence > 0.7 && detection.detectedLanguage !== 'en') {
        console.log('Showing language modal for:', detection.detectedLanguage)
        setShowLanguageModal(true)
      } else {
        console.log('Using English, confidence:', detection.confidence, 'language:', detection.detectedLanguage)
        setLanguageState('en')
        loadTranslations('en')
      }
    } catch (error) {
      console.warn('Language detection failed:', error)
      setLanguageState('en')
      loadTranslations('en')
    } finally {
      setIsDetecting(false)
    }
  }

  // Load translations for a language
  const loadTranslations = async (lang: string, forceRegenerate = false) => {
    setIsLoading(true)
    try {
      // If force regenerate, clear cache first and skip cache check
      if (forceRegenerate) {
        console.log(`Force regenerating translations for ${lang}`)
        await fetch('/api/clear-cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ languageCode: lang })
        })
        
        // Skip cache check and go straight to generation
        console.log(`Generating new translations for ${lang} (force regenerate)`)
        await generateAndCacheTranslations(lang)
        return
      }

      // First try to load from cache
      const cachedTranslations = await TranslationSupabase.getLanguageTranslations(lang)
      console.log(`[${instanceId}] Cached translations for ${lang}:`, Object.keys(cachedTranslations).length, 'keys')
      
      if (Object.keys(cachedTranslations).length > 0) {
        console.log(`[${instanceId}] Using cached translations for ${lang}`)
        console.log(`[${instanceId}] Cached translations sample:`, Object.entries(cachedTranslations).slice(0, 3))
        console.log(`[${instanceId}] Setting cached translations in state...`)
        setTranslations(cachedTranslations)
        console.log(`[${instanceId}] Cached translations set in state`)
        setIsLoading(false)
        return
      }

      // If no cached translations, generate them
      console.log(`Generating new translations for ${lang}`)
      await generateAndCacheTranslations(lang)
    } catch (error) {
      console.error('Failed to load translations:', error)
      setTranslations(ENGLISH_TRANSLATIONS)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate and cache translations for a language
  const generateAndCacheTranslations = async (lang: string) => {
    if (lang === 'en') {
      setTranslations(ENGLISH_TRANSLATIONS)
      return
    }

    // Prevent multiple simultaneous calls for the same language
    if (isLoading) {
      console.log(`Already loading translations for ${lang}, skipping duplicate call`)
      return
    }

    try {
      // Get all English translations that need to be translated
      const translationKeys = Object.keys(ENGLISH_TRANSLATIONS) as TranslationKey[]
      const translationsToGenerate = translationKeys.map(key => ({
        key,
        text: ENGLISH_TRANSLATIONS[key],
        context: getContextForKey(key),
        tone: getToneForKey(key)
      }))

      // Call server-side API to generate translations
      console.log(`Calling /api/translate for ${lang} with ${translationsToGenerate.length} keys`)
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageCode: lang,
          translationKeys: translationsToGenerate
        })
      })

      console.log(`API response status: ${response.status}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error('Failed to generate translations')
      }

      const data = await response.json()
      console.log(`Generated translations for ${lang}:`, Object.keys(data.translations).length, 'keys')
      console.log('Sample translations:', Object.entries(data.translations).slice(0, 3))
      console.log('Setting translations in state...')
      setTranslations(data.translations)
      console.log('Translations set in state')
    } catch (error) {
      console.error('Failed to generate translations:', error)
      setTranslations(ENGLISH_TRANSLATIONS)
    }
  }

  // Get context for a translation key
  const getContextForKey = (key: TranslationKey): string => {
    // UI elements that should be professional
    if (key.startsWith('nav.') || key.startsWith('common.') || key.startsWith('modal.') || 
        key.startsWith('footer.') || key.startsWith('language.') || key.startsWith('home.') ||
        key === 'oops.title' || key === 'oops.description' || key === 'ask.title' || key === 'ask.description') {
      return 'ui'
    }
    // Generated content that should be dramatic
    if (key.startsWith('oops.')) return 'oops'
    if (key.startsWith('ask.')) return 'ask'
    if (key.includes('attorney')) return 'attorney'
    // Default to UI for any other keys
    return 'ui'
  }

  // Get tone for a translation key
  const getToneForKey = (key: TranslationKey): string => {
    // UI elements should be professional
    if (key.startsWith('nav.') || key.startsWith('common.') || key.startsWith('modal.') || 
        key.startsWith('footer.') || key.startsWith('language.')) {
      return 'formal'
    }
    // Generated content can be dramatic
    if (key.includes('title') || key.includes('description')) return 'dramatic'
    if (key.includes('tip') || key.includes('example')) return 'humorous'
    if (key.includes('button') || key.includes('action')) return 'casual'
    return 'dramatic'
  }

  // Set language and load translations
  const setLanguage = useCallback(async (newLanguage: string, forceRegenerate = false) => {
    setLanguageState(newLanguage)
    localStorage.setItem('oops-ask-language', newLanguage)
    
    // Save to Supabase if we have a session
    const sessionId = localStorage.getItem('oops-ask-session')
    if (sessionId) {
      await TranslationSupabase.saveLanguagePreference(sessionId, newLanguage)
    }
    
    await loadTranslations(newLanguage, forceRegenerate)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Get translation with fallback
  const t = useCallback((key: TranslationKey, fallback?: string): string => {
    const result = translations[key] || fallback || ENGLISH_TRANSLATIONS[key] || key
    // Debug logging for Romanian
    if (language === 'ro' && key.startsWith('nav.')) {
      console.log(`[${instanceId}] Translation for ${key}:`, { 
        fromCache: translations[key], 
        fallback, 
        english: ENGLISH_TRANSLATIONS[key], 
        result,
        translationsKeys: Object.keys(translations).length
      })
    }
    return result
  }, [translations, language, instanceId])

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    isLoading,
    isDetecting,
    detectedLanguage,
    showLanguageModal,
    setShowLanguageModal
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return {
    ...context,
    currentLanguage: {
      code: context.language,
      name: LanguageDetectionService.getLanguageDisplayName(context.language),
      nativeName: LanguageDetectionService.getLanguageDisplayName(context.language),
      flag: LanguageDetectionService.getLanguageFlag(context.language)
    },
    availableLanguages: [ // Dynamically generate available languages based on common ones + detected
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
      { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
      // Add detected language if not in the list
      ...(context.detectedLanguage && !['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'tr', 'ro'].includes(context.detectedLanguage) ? [{
        code: context.detectedLanguage,
        name: LanguageDetectionService.getLanguageDisplayName(context.detectedLanguage),
        nativeName: LanguageDetectionService.getLanguageDisplayName(context.detectedLanguage),
        flag: LanguageDetectionService.getLanguageFlag(context.detectedLanguage)
      }] : [])
    ]
  }
}
