'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { GenerateMessageRequest, GenerateMessageResponse } from '@/lib/types'
import { safeLocalStorage, safeWindow, safeNavigator, safeAsync } from '@/lib/safe-utils'
import { TranslationKey } from '@/lib/translation.types'

interface UseGenerationOptions {
  mode: 'oops' | 'ask' | 'ask_attorney'
  onGenerationComplete?: (count: number) => void
  replyMode?: boolean
  replyContext?: string
  replyVoice?: 'dramatic' | 'legal'
  // Conversation context for better replies
  originalSenderName?: string
  originalSenderRelationship?: string
  conversationId?: string
}

export function useGeneration({ mode, onGenerationComplete, replyMode, replyContext, replyVoice, originalSenderName, originalSenderRelationship, conversationId }: UseGenerationOptions) {
  const { t, currentLanguage, isDetecting, isLoading } = useTranslation()
  const [originalText, setOriginalText] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientRelationship, setRecipientRelationship] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [generationCount, setGenerationCount] = useState(0)
  const [showDonationModal, setShowDonationModal] = useState(false)

  // Load generation count from localStorage
  useEffect(() => {
    const savedCount = safeLocalStorage.getItem('oops-ask-generation-count')
    if (savedCount) {
      const count = parseInt(savedCount, 10)
      if (!isNaN(count)) {
        setGenerationCount(count)
      }
    }
  }, [])

  // Check if donation modal should be shown (30-day cooldown)
  const shouldShowDonationModal = (count: number) => {
    // Check if user donated recently (30 days)
    const donationTimestamp = safeLocalStorage.getItem('oops-ask-donation-timestamp')
    if (donationTimestamp) {
      const timestamp = parseInt(donationTimestamp, 10)
      if (!isNaN(timestamp)) {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
        if (timestamp > thirtyDaysAgo) {
          return false // Still in cooldown period
        }
      }
    }
    
    // Show modal every 5 generations
    return count >= 5 && count % 5 === 0
  }

  // Simple country detection using browser language
  const getCountryCode = () => {
    try {
      // Try to get country from browser language
      const lang = safeNavigator.getLanguage()
      const parts = lang.split('-')
      if (parts.length > 1) {
        return parts[1].toLowerCase()
      }
      
      // Fallback to timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const countryMap: { [key: string]: string } = {
        'America/New_York': 'us',
        'America/Los_Angeles': 'us',
        'Europe/London': 'gb',
        'Europe/Paris': 'fr',
        'Europe/Berlin': 'de',
        'Europe/Rome': 'it',
        'Europe/Madrid': 'es',
        'Asia/Tokyo': 'jp',
        'Asia/Shanghai': 'cn',
        'Asia/Seoul': 'kr',
        'Australia/Sydney': 'au',
        'America/Sao_Paulo': 'br',
        'Europe/Bucharest': 'ro'
      }
      
      return countryMap[timezone] || 'unknown'
    } catch {
      return 'unknown'
    }
  }

  const handleGenerate = async () => {
    if (!originalText.trim()) return
    
    // Don't generate if language detection is still in progress (temporarily disabled for testing)
    // if (isDetecting || isLoading) {
    //   console.log('⏳ Language detection in progress, waiting...', { isDetecting, isLoading })
    //   return
    // }

    setIsGenerating(true)
    try {
      // Language context logged for debugging
      
      const request: GenerateMessageRequest = {
        mode,
        originalText: originalText.trim(),
        recipientName: recipientName.trim(),
        recipientRelationship: recipientRelationship.trim(),
        language: currentLanguage.code,
        sessionId: safeLocalStorage.getItem('oops-ask-session') || '',
        replyMode: replyMode || false,
        replyContext: replyContext || '',
        replyVoice: replyVoice || 'dramatic',
        countryCode: getCountryCode(),
        // Conversation context for better replies
        originalSenderName,
        originalSenderRelationship,
        conversationId
      }

      // Sending request to API

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: GenerateMessageResponse = await response.json()
      // Received response from API
      setGeneratedText(data.generatedText)
      
      // Update generation count
      const newCount = generationCount + 1
      setGenerationCount(newCount)
      safeLocalStorage.setItem('oops-ask-generation-count', newCount.toString())
      
      // Trigger donation modal with 30-day cooldown
      if (shouldShowDonationModal(newCount)) {
        setShowDonationModal(true)
      }
      
      onGenerationComplete?.(newCount)
    } catch (error) {
      console.error('Generation failed:', error)
      setGeneratedText('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      // Copy just the generated text without bold formatting
      const success = await safeNavigator.writeText(generatedText)
      if (success) {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } else {
        // Fallback: show alert for manual copy
        alert('Copy not available. Please select and copy the text manually.')
      }
    } catch (error) {
      console.error('Copy failed:', error)
      alert('Copy not available. Please select and copy the text manually.')
    }
  }

  const formatShareMessage = async (t: (key: TranslationKey, fallback?: string) => string) => {
    // Clean and format the generated text for all platforms
    const formattedGeneratedText = generatedText
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
      .replace(/\u00A0/g, ' ') // Replace non-breaking spaces with regular spaces
      .replace(/\u2013/g, '-') // Replace en-dash with regular dash
      .replace(/\u2014/g, '--') // Replace em-dash with double dash
      .replace(/\u2018/g, "'") // Replace left single quotation mark
      .replace(/\u2019/g, "'") // Replace right single quotation mark
      .replace(/\u201C/g, '"') // Replace left double quotation mark
      .replace(/\u201D/g, '"') // Replace right double quotation mark
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks to 2
      .trim()
    
    try {
      // Store conversation in database and get UUID
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText,
          generatedText,
          mode,
          recipientName,
          recipientRelationship,
          language: currentLanguage.code,
          replyVoice: 'dramatic'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const conversationId = data.conversationId
        
        // Get current domain dynamically
        const currentDomain = safeWindow.getLocationOrigin()
        
        // Create short, clean link with UUID
        const replyUrl = `${currentDomain}/reply?id=${conversationId}`
        
        return `${formattedGeneratedText}\n\n${t('share.which_means')} **${originalText}**\n\n\n${t('share.reply_prompt')}\n\n${replyUrl}`
      }
    } catch (error) {
      console.error('Failed to store conversation:', error)
    }

    // Fallback to old method if database fails
    const currentDomain = safeWindow.getLocationOrigin()
    const replyUrl = `${currentDomain}/reply?lang=${currentLanguage.code}&context=${encodeURIComponent(generatedText)}&message=${encodeURIComponent(originalText)}&voice=dramatic&recipient=${encodeURIComponent(recipientName || 'them')}`
    
    return `${formattedGeneratedText}\n\n${t('share.which_means')} **${originalText}**\n\n\n${t('share.reply_prompt')}\n\n${replyUrl}`
  }


  const handleShare = async () => {
    try {
      const formattedMessage = await formatShareMessage(t) // Async call
      const shareData = {
        text: formattedMessage,
      }
      
      // Use native share if available (Android/iOS Safari)
      const shareSuccess = await safeNavigator.share(shareData)
      if (shareSuccess) {
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
        return
      }
      
      // Fallback for desktop: copy to clipboard
      const copySuccess = await safeNavigator.writeText(formattedMessage)
      if (copySuccess) {
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
      } else {
        alert('Share not available. Please copy the text manually.')
      }
      
    } catch (error) {
      console.error('Share failed:', error)
      // Final fallback: copy to clipboard
      try {
        const formattedMessage = await formatShareMessage(t) // Async call
        const copySuccess = await safeNavigator.writeText(formattedMessage)
        if (copySuccess) {
          setIsShared(true)
          setTimeout(() => setIsShared(false), 2000)
        } else {
          alert('Share not available. Please copy the text manually.')
        }
      } catch (clipboardError) {
        console.error('Clipboard fallback failed:', clipboardError)
        // Show user-friendly error
        alert('Share not available. Please copy the text manually.')
      }
    }
  }

  const handleRegenerate = () => {
    setGeneratedText('')
    setUserRating(null)
    handleGenerate()
  }

  const handleTryAgain = () => {
    setGeneratedText('')
    setOriginalText('')
    setUserRating(null)
  }

  const handleDonationModalClose = () => {
    setShowDonationModal(false)
  }

  return {
    // State
    originalText,
    setOriginalText,
    recipientName,
    setRecipientName,
    recipientRelationship,
    setRecipientRelationship,
    generatedText,
    isGenerating,
    isCopied,
    isShared,
    userRating,
    setUserRating,
    generationCount,
    showDonationModal,
    setShowDonationModal,
    isDetecting,
    isLoading,
    
    // Actions
    handleGenerate,
    handleCopy,
    handleShare,
    handleRegenerate,
    handleTryAgain,
    handleDonationModalClose,
  }
}
