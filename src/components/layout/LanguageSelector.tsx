'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from '@/lib/i18n'

interface LanguageSelectorProps {
  className?: string
  isMobile?: boolean
}

export function LanguageSelector({ className = '', isMobile = false }: LanguageSelectorProps) {
  const { currentLanguage, availableLanguages, setLanguage } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const handleLanguageChange = async (languageCode: string) => {
    setIsLoading(true)
    try {
      setLanguage(languageCode)
      
      // Save language preference to localStorage
      localStorage.setItem('oops-ask-language', languageCode)
      
      // Save to Supabase user session (if available)
      // This will be implemented when we have an active session
      
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('oops-ask-language')
    if (savedLanguage && savedLanguage !== currentLanguage.code) {
      setLanguage(savedLanguage)
    }
  }, [currentLanguage.code, setLanguage])

  // Language detection is now handled by the TranslationProvider

  return (
    <div className={`flex items-center ${className}`}>
      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
      <Select
        value={currentLanguage.code}
        onValueChange={handleLanguageChange}
        disabled={isLoading}
      >
        <SelectTrigger className={`${isMobile ? 'w-40' : 'w-32'} h-9`}>
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span>{currentLanguage.flag}</span>
              <span className={`${isMobile ? 'text-sm' : 'text-xs'}`}>
                {isMobile ? currentLanguage.nativeName : currentLanguage.code.toUpperCase()}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{language.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Compact language selector for mobile/tight spaces
export function CompactLanguageSelector() {
  const { currentLanguage, setLanguage } = useTranslation()
  
  const handleCycleLanguage = () => {
    const allLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']
    const currentIndex = allLanguages.indexOf(currentLanguage.code)
    const nextIndex = (currentIndex + 1) % allLanguages.length
    setLanguage(allLanguages[nextIndex])
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCycleLanguage}
      className="px-2"
    >
      <div className="flex items-center space-x-1">
        <span>{currentLanguage.flag}</span>
        <span className="text-xs">{currentLanguage.code.toUpperCase()}</span>
      </div>
    </Button>
  )
}
