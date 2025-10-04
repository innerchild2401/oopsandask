/**
 * Translation System Types for Oops & Ask
 */

export interface Translation {
  id: string
  key: string
  language: string
  value: string
  created_at: string
}

export interface LanguageDetection {
  detectedLanguage: string
  confidence: number
  source: 'browser' | 'ip' | 'manual'
}

export interface TranslationContext {
  language: string
  setLanguage: (language: string, forceRegenerate?: boolean) => void
  t: (key: TranslationKey, fallback?: string) => string
  isLoading: boolean
  isDetecting: boolean
  detectedLanguage: string | null
  showLanguageModal: boolean
  setShowLanguageModal: (show: boolean) => void
}

export interface GPTTranslationRequest {
  text: string
  targetLanguage: string
  context: 'oops' | 'ask' | 'attorney' | 'ui'
  tone: 'dramatic' | 'humorous' | 'formal' | 'casual'
}

export interface GPTTranslationResponse {
  translatedText: string
  culturalNotes: string[]
  confidence: number
}

// Translation keys for the app
export type TranslationKey = 
  // Navigation
  | 'nav.home'
  | 'nav.oops'
  | 'nav.ask'
  | 'nav.app_title'
  | 'nav.tagline'
  
  // Home page
  | 'home.welcome'
  | 'home.subtitle'
  | 'home.oops_title'
  | 'home.oops_description'
  | 'home.ask_title'
  | 'home.ask_description'
  | 'home.get_started'
  | 'home.language_select'
  
  // Common UI
  | 'common.loading'
  | 'common.error'
  | 'common.generate'
  | 'common.cancel'
  | 'common.copy'
  | 'common.share'
  | 'common.rating'
  | 'common.close'
  | 'common.submit'
  | 'common.try_again'
  | 'common.original_text'
  | 'common.select_persona'
  | 'common.select_relationship'
  | 'common.mode_oops'
  | 'common.mode_ask'
  | 'common.mode_attorney'
  | 'common.recipient_name'
  | 'common.recipient_relationship'
  | 'common.who_are_you_apologizing_to'
  | 'common.who_are_you_asking'
  | 'common.relationship_placeholder'
  | 'common.what_happened'
  | 'common.what_do_you_want'
  | 'common.regenerate'
  
  // Oops page
  | 'oops.title'
  | 'oops.description'
  | 'oops.input_placeholder'
  | 'oops.generate_button'
  | 'oops.tips_title'
  | 'oops.tip_1'
  | 'oops.tip_2'
  | 'oops.tip_3'
  | 'oops.tip_4'
  | 'oops.tip_5'
  | 'oops.example_title'
  | 'oops.stats_title'
  | 'oops.switch_mode_title'
  | 'oops.switch_mode_description'
  | 'oops.switch_mode_button'
  
  // Ask page
  | 'ask.title'
  | 'ask.description'
  | 'ask.input_placeholder'
  | 'ask.generate_button'
  | 'ask.attorney_mode'
  | 'ask.attorney_hint'
  | 'ask.tips_title'
  | 'ask.tip_1'
  | 'ask.tip_2'
  | 'ask.tip_3'
  | 'ask.tip_4'
  | 'ask.tip_5'
  | 'ask.tip_6'
  | 'ask.example_title'
  | 'ask.stats_title'
  | 'ask.switch_mode_title'
  | 'ask.switch_mode_description'
  | 'ask.switch_mode_button'
  
  // Footer
  | 'footer.buy_coffee'
  | 'footer.support_message'
  
  // Modals
  | 'modal.error_title'
  | 'modal.success_title'
  | 'modal.copy_success'
  | 'modal.share_success'
  | 'modal.language_detected_title'
  | 'modal.language_detected_message'
  | 'modal.language_detected_use_detected'
  | 'modal.language_detected_use_english'
  | 'modal.donation_title'
  | 'modal.donation_message'
  | 'modal.donation_features_title'
  | 'modal.donation_feature_1'
  | 'modal.donation_feature_2'
  | 'modal.donation_feature_3'
  | 'modal.donation_feature_4'
  | 'modal.donation_buy_coffee'
  | 'modal.donation_maybe_later'
  | 'modal.donation_footer'
  
  // Output card
  | 'output.dramatic_apology'
  | 'output.persuasive_request'
  | 'output.legal_request'
  | 'output.awaits_apology'
  | 'output.awaits_request'
  | 'output.awaits_legal'
  | 'output.describe_mistake'
  | 'output.enable_legal'
  | 'output.craft_convincing'
  | 'output.rate_apology'
  | 'output.rate_request'
  
  // Language names
  | 'language.english'
  | 'language.spanish'
  | 'language.french'
  | 'language.german'
  | 'language.italian'
  | 'language.portuguese'
  | 'language.russian'
  | 'language.japanese'
  | 'language.korean'
  | 'language.chinese'
  | 'language.arabic'
  | 'language.dutch'
  | 'language.swedish'
  | 'language.norwegian'
  | 'language.danish'
  | 'language.finnish'
  | 'language.polish'
  | 'language.turkish'
