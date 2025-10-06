'use client'

import { useState, useEffect } from 'react'
import { X, Coffee, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  generationCount: number
  language?: string
}

export function DonationModal({ isOpen, onClose, generationCount, language = 'en' }: DonationModalProps) {
  const { t } = useTranslation()
  const [isAnimating, setIsAnimating] = useState(false)
  const [guiltMessage, setGuiltMessage] = useState('')
  const [isLoadingMessage, setIsLoadingMessage] = useState(false)

  // Generate guilt message when modal opens
  useEffect(() => {
    if (isOpen && !guiltMessage) {
      generateGuiltMessage()
    }
  }, [isOpen, guiltMessage])

  const generateGuiltMessage = async () => {
    setIsLoadingMessage(true)
    try {
      const response = await fetch('/api/donation-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationCount,
          language,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGuiltMessage(data.message)
      } else {
        // Fallback message
        setGuiltMessage(`You've used me ${generationCount} times and still no coffee? I'm starting to feel... unappreciated. ☕`)
      }
    } catch (error) {
      console.error('Failed to generate guilt message:', error)
      // Fallback message
      setGuiltMessage(`You've used me ${generationCount} times and still no coffee? I'm starting to feel... unappreciated. ☕`)
    } finally {
      setIsLoadingMessage(false)
    }
  }

  if (!isOpen) return null

  const handleDonate = () => {
    const buyMeACoffeeUrl = process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL
    if (buyMeACoffeeUrl) {
      window.open(buyMeACoffeeUrl, '_blank')
      // Store donation timestamp for 30-day cooldown
      localStorage.setItem('oops-ask-donation-timestamp', Date.now().toString())
    }
    onClose()
  }

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      onClose()
    }, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-card rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center animate-bounce">
                <Heart className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          {/* GPT Generated Message */}
          <div className="mb-6">
            {isLoadingMessage ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : (
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed px-2">
                {guiltMessage}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleDonate}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 text-base"
            >
              <Coffee className="mr-2 h-4 w-4" />
              {t('footer.buy_coffee')}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full py-3 text-base"
            >
              {t('modal.donation_maybe_later')}
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground mt-4 px-2">
            {t('modal.donation_footer')}
          </p>
        </div>
      </div>
    </div>
  )
}
