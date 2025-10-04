'use client'

import { useState } from 'react'
import { Zap, Copy, Share2, RefreshCw, Star, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { GenerateMessageRequest, GenerateMessageResponse } from '@/lib/types'

export default function OopsPage() {
  const { t } = useTranslation()
  const [originalText, setOriginalText] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!originalText.trim()) return

    setIsGenerating(true)
    try {
      const request: GenerateMessageRequest = {
        mode: 'oops',
        originalText: originalText.trim(),
        language: 'en', // Will be dynamic based on language selector
        sessionId: localStorage.getItem('oops-ask-session') || '',
      }

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
      setGeneratedText(data.generatedText)
    } catch (error) {
      console.error('Generation failed:', error)
      setGeneratedText(t('common.error'))
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

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Oops! - Dramatic Apology',
        text: `${originalText}\n\n${generatedText}`,
        url: window.location.href,
      }
      
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${originalText}\n\n${generatedText}`)
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  const handleTryAgain = () => {
    setGeneratedText('')
    setOriginalText('')
    setUserRating(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-dramatic-appeal">😬</div>
            <h1 className="text-4xl font-bold mb-4 text-red-600">
              {t('oops.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {t('oops.description')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-red-500" />
                  {t('common.original_text')}
                </h2>
                
                <textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder={t('oops.input_placeholder')}
                  className="w-full min-h-[200px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isGenerating}
                />
                
                <div className="mt-4">
                  <Button 
                    onClick={handleGenerate}
                    disabled={!originalText.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transition-all duration-300"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        {t('oops.generate_button')}
                        <Zap className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Generation Stats */}
              {generatedText && (
                <div className="bg-card rounded-lg p-6 border shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Generation Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Language:</span>
                      <span className="ml-2 font-medium">English</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mode:</span>
                      <span className="ml-2 font-medium">😬 Oops</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Style:</span>
                      <span className="ml-2 font-medium">Dramatic</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              {generatedText ? (
                <div className="bg-card rounded-lg p-6 border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Dramatic Apology</h2>
                  
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 rounded-lg p-6 mb-6 min-h-[200px]">
                    <p className="text-lg leading-relaxed font-medium">
                      {generatedText}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      onClick={handleCopy}
                      variant={isCopied ? 'default' : 'outline'}
                      className={isCopied ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {isCopied ? 'Copied!' : t('common.copy')}
                    </Button>
                    
                    <Button onClick={handleShare} variant="outline">
                      <Share2 className="mr-2 h-4 w-4" />
                      {isShared ? 'Shared!' : t('common.share')}
                    </Button>
                    
                    <Button onClick={handleTryAgain} variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t('common.try_again')}
                    </Button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Rate this apology:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className={`${userRating && star <= userRating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300 hover:text-yellow-400'
                        } transition-colors`}
                      >
                        <Star className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-lg p-6 border shadow-sm">
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4 opacity-50">🎭</div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Your dramatic apology awaits
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Describe what you did wrong and let our AI transform it into a theatrical masterpiece.
                    </p>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">💡 Tips for Better Apologies</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Be specific about what you did wrong</li>
                  <li>• Mention how it affected the other person</li>
                  <li>• Include details about your regret</li>
                  <li>• Suggest how you'll make things right</li>
                  <li>• Be genuine and heartfelt</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
