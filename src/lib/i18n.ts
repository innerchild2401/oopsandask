/**
 * Legacy i18n utilities - now redirects to new translation system
 * @deprecated Use useTranslation from translation.hook.ts instead
 */

import { LanguageOption } from '@/lib/types'
import { useTranslation as useNewTranslation } from './translation.hook'

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
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
]

// Legacy hook that redirects to new translation system
export function useTranslation() {
  const newTranslation = useNewTranslation()
  
  return {
    t: newTranslation.t,
    setLanguage: newTranslation.setLanguage,
    currentLanguage: {
      code: newTranslation.language,
      name: AVAILABLE_LANGUAGES.find(lang => lang.code === newTranslation.language)?.name || 'English',
      nativeName: AVAILABLE_LANGUAGES.find(lang => lang.code === newTranslation.language)?.nativeName || 'English',
      flag: AVAILABLE_LANGUAGES.find(lang => lang.code === newTranslation.language)?.flag || '🇺🇸'
    },
    availableLanguages: AVAILABLE_LANGUAGES,
    isDetecting: newTranslation.isDetecting,
    isLoading: newTranslation.isLoading,
    detectedLanguage: newTranslation.detectedLanguage,
    showLanguageModal: newTranslation.showLanguageModal,
    setShowLanguageModal: newTranslation.setShowLanguageModal,
  }
}
