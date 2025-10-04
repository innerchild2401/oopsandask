/**
 * Language selection modal for first-time visitors
 */

'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/translation.hook'
import { LanguageDetectionService } from '@/lib/translation.detection'

interface LanguageModalProps {
  isOpen: boolean
  onClose: () => void
  detectedLanguage: string | null
}

export function LanguageModal({ isOpen, onClose, detectedLanguage }: LanguageModalProps) {
  const { setLanguage, t } = useTranslation()
  const [isSelecting, setIsSelecting] = useState(false)

  if (!isOpen) return null

  const handleLanguageSelect = async (language: string) => {
    setIsSelecting(true)
    try {
      // Force regeneration for Romanian to clear any bad cached data
      const forceRegenerate = language === 'ro'
      await setLanguage(language, forceRegenerate)
      onClose()
    } catch (error) {
      console.error('Failed to set language:', error)
    } finally {
      setIsSelecting(false)
    }
  }

  const detectedLanguageName = detectedLanguage 
    ? LanguageDetectionService.getLanguageDisplayName(detectedLanguage)
    : 'Unknown'
  const detectedLanguageFlag = detectedLanguage 
    ? LanguageDetectionService.getLanguageFlag(detectedLanguage)
    : '🌍'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300">
        <div className="text-center">
          <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            {t('modal.language_detected_title')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('modal.language_detected_message').replace('{language}', detectedLanguageName)}
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => handleLanguageSelect(detectedLanguage || 'en')}
              disabled={isSelecting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
            >
              <span className="mr-2 text-xl">{detectedLanguageFlag}</span>
              {t('modal.language_detected_use_detected').replace('{language}', detectedLanguageName)}
              {isSelecting && <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            </Button>

            <Button
              onClick={() => handleLanguageSelect('en')}
              disabled={isSelecting}
              variant="outline"
              className="w-full"
            >
              <span className="mr-2 text-xl">🇺🇸</span>
              {t('modal.language_detected_use_english')}
            </Button>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            You can change this later in the language selector
          </div>
        </div>
      </div>
    </div>
  )
}
