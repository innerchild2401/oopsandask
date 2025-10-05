'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { GenerateMessageRequest, GenerateMessageResponse } from '@/lib/types'

interface UseGenerationOptions {
  mode: 'oops' | 'ask' | 'ask_attorney'
  onGenerationComplete?: (count: number) => void
  replyMode?: boolean
  replyContext?: string
  replyVoice?: 'dramatic' | 'legal'
}

export function useGeneration({ mode, onGenerationComplete, replyMode, replyContext, replyVoice }: UseGenerationOptions) {
  const { currentLanguage, isDetecting, isLoading } = useTranslation()
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
        replyMode: replyMode || false,
        replyContext: replyContext || '',
        replyVoice: replyVoice || 'dramatic'
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

  const formatShareMessage = () => {
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
    
    // Get current domain dynamically
    const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://oopsnandask.vercel.app'
    
    // Create clean, well-formatted message for all platforms
    const replyUrl = `${currentDomain}/reply?lang=${currentLanguage.code}&context=${encodeURIComponent(generatedText)}&message=${encodeURIComponent(originalText)}&voice=dramatic&recipient=${encodeURIComponent(recipientName || 'them')}`
    
    // Format with proper paragraphs and structure
    return `${originalText}\n\nIn other words:\n\n${formattedGeneratedText}\n\nOooh, the little devil! Reply to him in this same manner: Reply in Same Style 😈\n\n${replyUrl}`
  }


  const handleShare = async () => {
    try {
      const formattedMessage = formatShareMessage() // Synchronous call
      // Include language in the URL so the app opens with the correct language
      const urlWithLanguage = `${window.location.origin}${window.location.pathname}?lang=${currentLanguage.code}`
      const shareData = {
        title: `${mode === 'oops' ? 'Oops!' : 'Ask For'} - AI Generated`,
        text: formattedMessage,
        url: urlWithLanguage,
      }
      
      // Use native share if available (Android/iOS Safari)
      if (navigator.share) {
        await navigator.share(shareData)
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
        return
      }
      
      // Fallback for desktop: copy to clipboard
      await navigator.clipboard.writeText(`${formattedMessage}\n\n${urlWithLanguage}`)
      setIsShared(true)
      setTimeout(() => setIsShared(false), 2000)
      
    } catch (error) {
      console.error('Share failed:', error)
      // Final fallback: copy to clipboard
      try {
        const formattedMessage = formatShareMessage() // Synchronous call
        const urlWithLanguage = `${window.location.origin}${window.location.pathname}?lang=${currentLanguage.code}`
        await navigator.clipboard.writeText(`${formattedMessage}\n\n${urlWithLanguage}`)
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
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
