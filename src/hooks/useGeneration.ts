'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { GenerateMessageRequest, GenerateMessageResponse } from '@/lib/types'

interface UseGenerationOptions {
  mode: 'oops' | 'ask' | 'ask_attorney'
  onGenerationComplete?: (count: number) => void
}

export function useGeneration({ mode, onGenerationComplete }: UseGenerationOptions) {
  const { currentLanguage, isDetecting, isLoading } = useTranslation()
  const [originalText, setOriginalText] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientRelationship, setRecipientRelationship] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isShared] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [generationCount, setGenerationCount] = useState(0)
  const [showDonationModal, setShowDonationModal] = useState(false)

  // Load generation count from localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem('oops-ask-generation-count')
    if (savedCount) {
      setGenerationCount(parseInt(savedCount, 10))
    }
  }, [])

  const handleGenerate = async () => {
    if (!originalText.trim()) return
    
    // Don't generate if language detection is still in progress
    if (isDetecting || isLoading) {
      console.log('⏳ Language detection in progress, waiting...', { isDetecting, isLoading })
      return
    }

    setIsGenerating(true)
    try {
      console.log('🌍 Language context:', {
        currentLanguage: currentLanguage,
        languageCode: currentLanguage.code,
        originalText: originalText.trim(),
        userAgent: navigator.userAgent,
        browserLanguage: navigator.language,
        languages: navigator.languages
      })
      
      const request: GenerateMessageRequest = {
        mode,
        originalText: originalText.trim(),
        recipientName: recipientName.trim(),
        recipientRelationship: recipientRelationship.trim(),
        language: currentLanguage.code,
        sessionId: localStorage.getItem('oops-ask-session') || '',
      }

      console.log('📤 Sending request to API:', request)
      
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
      console.log('📥 Received response from API:', data)
      setGeneratedText(data.generatedText)
      
      // Update generation count
      const newCount = generationCount + 1
      setGenerationCount(newCount)
      localStorage.setItem('oops-ask-generation-count', newCount.toString())
      
      // Trigger donation modal after 5 generations
      if (newCount >= 5 && newCount % 5 === 0) {
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
      await navigator.clipboard.writeText(generatedText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleWhatsAppShare = () => {
    const message = `${originalText}\n\n${generatedText}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleShare = async () => {
    try {
      const shareData = {
        title: `${mode === 'oops' ? 'Oops!' : 'Ask'} - AI Generated`,
        text: `${originalText}\n\n${generatedText}`,
        url: window.location.href,
      }
      
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback to WhatsApp
        handleWhatsAppShare()
      }
    } catch (error) {
      console.error('Share failed:', error)
      // Fallback to WhatsApp
      handleWhatsAppShare()
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
    isDetecting,
    isLoading,
    
    // Actions
    handleGenerate,
    handleCopy,
    handleShare,
    handleWhatsAppShare,
    handleRegenerate,
    handleTryAgain,
    handleDonationModalClose,
  }
}
