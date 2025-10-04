'use client'

import { useState } from 'react'
import { X, Coffee, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  generationCount: number
}

export function DonationModal({ isOpen, onClose, generationCount }: DonationModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  if (!isOpen) return null

  const handleDonate = () => {
    const buyMeACoffeeUrl = process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL
    if (buyMeACoffeeUrl) {
      window.open(buyMeACoffeeUrl, '_blank')
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
      <div className={`relative bg-card rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Coffee className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center animate-bounce">
                <Heart className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Wow! {generationCount} Generations! 🎉
          </h2>

          {/* Message */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            You&apos;ve been creating dramatic masterpieces! If you&apos;re enjoying Oops & Ask, 
            consider supporting us with a coffee. Every cup helps us keep the drama alive! ☕✨
          </p>

          {/* Features */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 flex items-center justify-center">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
              What your support enables:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• More dramatic AI responses</li>
              <li>• New languages and cultural contexts</li>
              <li>• Enhanced theatrical features</li>
              <li>• Server costs and maintenance</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDonate}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
            >
              <Coffee className="mr-2 h-4 w-4" />
              Buy Me a Coffee
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground mt-4">
            No pressure! You can continue using Oops & Ask for free. 💝
          </p>
        </div>
      </div>
    </div>
  )
}
