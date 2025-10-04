'use client'

import { useTranslation } from '@/lib/translation.hook'
import { LanguageModal } from './LanguageModal'

export function LanguageModalWrapper() {
  const { showLanguageModal, setShowLanguageModal, detectedLanguage } = useTranslation()
  
  return (
    <LanguageModal
      isOpen={showLanguageModal}
      onClose={() => setShowLanguageModal(false)}
      detectedLanguage={detectedLanguage}
    />
  )
}
