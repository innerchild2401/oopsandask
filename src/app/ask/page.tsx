'use client'

import { useState } from 'react'
import { Heart, Copy, Share2, RefreshCw, Star, Loader, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { GenerateMessageRequest, GenerateMessageResponse } from '@/lib/types'

export default function AskPage() {
  const { t } = useTranslation()
  const [originalText, setOriginalText] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [attorneyMode, setAttorneyMode] = useState(false)

  const handleGenerate = async () => {
    if (!originalText.trim()) return

    setIsGenerating(true)
    try {
      const request: GenerateMessageRequest = {
        mode: attorneyMode ? 'attorney_ask' : 'ask',
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
        title: attorneyMode ? 'Ask (Attorney Mode) - Persuasive Request' : 'Ask - Persuasive Request',
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

  const examples = [
    {
      text: "Can I please borrow $50 until next week?",
      category: "Financial Request",
      attorney: "Pursuant to the statutes governing interpersonal financial covenants..."
    },
    {
      text: "Can you help me move this weekend?",
      category: "Favor Request",
      attorney: "In accordance with the humanitarian assistance protocols..."
    },
    {
      text: "Can I get a raise at work?",
      category: "Career Development",
      attorney: "Under the equitable compensation provisions of labor law..."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-dramatic-appeal">💌</div>
            <h1 className="text-4xl font-bold mb-4 text-blue-600">
              {t('ask.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {t('ask.description')}
            </p>
          </div>

          {/* Attorney Mode Toggle */}
          <div className="text-center mb-8">
            <label className="flex items-center justify-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={attorneyMode}
                  onChange={(e) => setAttorneyMode(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${attorneyMode ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${
                    attorneyMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
              <span className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-purple-600" />
                <span className="font-medium">
                  {t('ask.attorney_mode')}
                </span>
              </span>
            </label>
            <p className="text-sm text-muted-foreground mt-2">
              {attorneyMode ? t('ask.attorney_hint') : 'Use dramatic persuasion techniques'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-blue-500" />
                  {t('ask.input_placeholder')}
                </h2>
                
                <textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder={t('ask.input_placeholder')}
                  className="w-full min-h-[200px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                />
                
                <div className="mt-4">
                  <Button 
                    onClick={handleGenerate}
                    disabled={!originalText.trim() || isGenerating}
                    className={`w-full text-white hover:shadow-lg transition-all duration-300 ${
                      attorneyMode 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        {t('ask.generate_button')}
                        <Heart className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Example Requests */}
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">💡 Example Requests</h3>
                <div className="space-y-4">
                  {examples.map((example, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">{example.category}</p>
                      <p className="text-sm mb-2">{example.text}</p>
                      {attorneyMode && (
                        <p className="text-xs italic text-purple-600">{example.attorney}</p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOriginalText(example.text)}
                        className="mt-2"
                      >
                        Use This Example
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              {generatedText ? (
                <div className="bg-card rounded-lg p-6 border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    {attorneyMode ? '⚖️ Persuasive Request (Attorney Mode)' : '💌 Persuasive Request'}
                  </h2>
                  
                  <div className={`rounded-lg p-6 mb-6 min-h-[200px] ${
                    attorneyMode 
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950' 
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950'
                  }`}>
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
                    <span className="text-sm font-medium">Rate this request:</span>
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
                    <div className="text-4xl mb-4 opacity-50">
                      {attorneyMode ? '⚖️' : '💌'}
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Your persuasive request awaits
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {attorneyMode 
                        ? 'Enable dramatic legal language with fake citations.' 
                        : 'Craft convincing requests using dramatic flair.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  💡 Tips for Better Requests
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Be clear about what you're asking for</li>
                  <li>• Explain why this request is important to you</li>
                  <li>• Mention how the other person can help</li>
                  <li>• Offer something in return if appropriate</li>
                  <li>• Use respectful and persuasive language</li>
                  {attorneyMode && (
                    <li>• ⚖️ Fake legal citations add dramatic flair</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
