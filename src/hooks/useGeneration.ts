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
      // Language context logged for debugging
      
      const request: GenerateMessageRequest = {
        mode,
        originalText: originalText.trim(),
        recipientName: recipientName.trim(),
        recipientRelationship: recipientRelationship.trim(),
        language: currentLanguage.code,
        sessionId: localStorage.getItem('oops-ask-session') || '',
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

  const formatWhatsAppMessage = async () => {
    try {
      // Ask GPT to format the WhatsApp message in the correct language
      const response = await fetch('/api/format-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText,
          generatedText,
          language: currentLanguage.code
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.formattedMessage
      }
    } catch (error) {
      console.error('Failed to format WhatsApp message:', error)
    }

    // Fallback to simple formatting if API fails
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
      .replace(/\n\n/g, '\n\n') // Preserve paragraph breaks
      .replace(/\n/g, '\n') // Preserve line breaks
      .replace(/\*\*(.*?)\*\*/g, '*$1*') // Convert **bold** to *bold* for WhatsApp
      .replace(/\*(.*?)\*/g, '*$1*') // Ensure single asterisks work
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks to 2
      .trim()
    
    return `${originalText}\n\nIn other words:\n\n${formattedGeneratedText}\n\nWant to answer in the same witty manner? 😄\nhttps://oopsnandask.vercel.app?lang=${currentLanguage.code}`
  }

  const handleWhatsAppShare = async () => {
    const message = await formatWhatsAppMessage()
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleShare = async () => {
    try {
      const formattedMessage = await formatWhatsAppMessage()
      // Include language in the URL so the app opens with the correct language
      const urlWithLanguage = `${window.location.origin}${window.location.pathname}?lang=${currentLanguage.code}`
      const shareData = {
        title: `${mode === 'oops' ? 'Oops!' : 'Ask For'} - AI Generated`,
        text: formattedMessage,
        url: urlWithLanguage,
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
