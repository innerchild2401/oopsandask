/**
 * Main translation hook and context provider
 */

'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { TranslationContext as TranslationContextType, TranslationKey } from './translation.types'
import { TranslationSupabase } from './translation.supabase'
import { GPTTranslationService } from './translation.gpt'
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
  'common.original_text': 'Original Text',
  'common.select_persona': 'Select Persona',
  'common.select_relationship': 'Select Relationship',
  'common.mode_oops': 'Oops Mode',
  'common.mode_ask': 'Ask Mode',
  'common.mode_attorney': 'Attorney Mode',
  
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
      setDetectedLanguage(detection.detectedLanguage)
      
      // Only show modal if confidence is high and it's not English
      if (detection.confidence > 0.7 && detection.detectedLanguage !== 'en') {
        setShowLanguageModal(true)
      } else {
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
  const loadTranslations = async (lang: string) => {
    setIsLoading(true)
    try {
      // First try to load from cache
      const cachedTranslations = await TranslationSupabase.getLanguageTranslations(lang)
      
      if (Object.keys(cachedTranslations).length > 0) {
        setTranslations(cachedTranslations)
        setIsLoading(false)
        return
      }

      // If no cached translations, generate them
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

    try {
      // Get all English translations that need to be translated
      const translationKeys = Object.keys(ENGLISH_TRANSLATIONS) as TranslationKey[]
      const translationsToGenerate = translationKeys.map(key => ({
        key,
        text: ENGLISH_TRANSLATIONS[key],
        context: getContextForKey(key),
        tone: getToneForKey(key)
      }))

      // Generate translations in batches
      const generatedTranslations = await GPTTranslationService.translateBatch(
        translationsToGenerate,
        lang
      )

      // Save to cache
      const languageId = await TranslationSupabase.getLanguageId(lang)
      for (const [key, value] of Object.entries(generatedTranslations)) {
        await TranslationSupabase.saveTranslation(key, languageId, value)
      }

      setTranslations(generatedTranslations)
    } catch (error) {
      console.error('Failed to generate translations:', error)
      setTranslations(ENGLISH_TRANSLATIONS)
    }
  }

  // Get context for a translation key
  const getContextForKey = (key: TranslationKey): string => {
    if (key.startsWith('oops.')) return 'oops'
    if (key.startsWith('ask.')) return 'ask'
    if (key.includes('attorney')) return 'attorney'
    return 'ui'
  }

  // Get tone for a translation key
  const getToneForKey = (key: TranslationKey): string => {
    if (key.includes('title') || key.includes('description')) return 'dramatic'
    if (key.includes('tip') || key.includes('example')) return 'humorous'
    if (key.includes('button') || key.includes('action')) return 'casual'
    return 'dramatic'
  }

  // Set language and load translations
  const setLanguage = useCallback(async (newLanguage: string) => {
    setLanguageState(newLanguage)
    localStorage.setItem('oops-ask-language', newLanguage)
    
    // Save to Supabase if we have a session
    const sessionId = localStorage.getItem('oops-ask-session')
    if (sessionId) {
      const languageId = await TranslationSupabase.getLanguageId(newLanguage)
      await TranslationSupabase.saveLanguagePreference(sessionId, languageId)
    }
    
    await loadTranslations(newLanguage)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Get translation with fallback
  const t = useCallback((key: TranslationKey, fallback?: string): string => {
    return translations[key] || fallback || ENGLISH_TRANSLATIONS[key] || key
  }, [translations])

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
  return context
}
