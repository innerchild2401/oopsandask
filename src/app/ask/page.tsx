'use client'

import { useState, useEffect } from 'react'
import { Heart, ArrowRight, RefreshCw, Copy, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { useGeneration } from '@/hooks/useGeneration'
import { DonationModal } from '@/components/shared/DonationModal'
import Link from 'next/link'

export default function AskPage() {
  const { t, currentLanguage, isLoading: isTranslating } = useTranslation()
  const [attorneyMode, setAttorneyMode] = useState(false)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  
  const {
    originalText,
    setOriginalText,
    recipientName,
    setRecipientName,
    recipientRelationship,
    setRecipientRelationship,
    generatedText,
    isGenerating,
    isDetecting,
    isLoading,
    handleGenerate,
    handleCopy,
    handleShare,
    handleRegenerate,
    isCopied,
    generationCount,
    showDonationModal,
    handleDonationModalClose,
  } = useGeneration({ 
    mode: attorneyMode ? 'ask_attorney' : 'ask'
  })

  const examples = [
    "Can I please borrow $50 until next week?",
    "Can you help me move this weekend?",
    "Can I get a raise at work?",
    "Can you cover my shift tomorrow?",
    "Can I borrow your car for the weekend?",
    "Can you pick me up from the airport?",
    "Can I work from home tomorrow?",
    "Can you lend me your laptop for the presentation?"
  ]

  const relationships = [
    { value: 'mum', label: t('relationship.mum') },
    { value: 'dad', label: t('relationship.dad') },
    { value: 'brother', label: t('relationship.brother') },
    { value: 'sister', label: t('relationship.sister') },
    { value: 'wife', label: t('relationship.wife') },
    { value: 'husband', label: t('relationship.husband') },
    { value: 'lover', label: t('relationship.lover') },
    { value: 'extended_family', label: t('relationship.extended_family') },
    { value: 'friend', label: t('relationship.friend') },
    { value: 'boss', label: t('relationship.boss') },
    { value: 'coworker', label: t('relationship.coworker') },
  ]

  // Rotate examples
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % examples.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [examples.length])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-full overflow-hidden">
        <div className="max-w-full overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('ask.title')}
              {isTranslating && <span className="ml-2 text-sm text-gray-500">(Loading translations...)</span>}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
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
                <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  attorneyMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    attorneyMode ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('ask.attorney_mode')}
              </span>
            </label>
          </div>

          {/* Main Content Area - Single Column Mobile-First */}
          <div className="space-y-8">
            {/* Examples Carousel */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 h-96 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                {t('ui.examples')}
              </h3>
              <div className="text-center">
                <div className="text-6xl mb-4">💌</div>
                <p className="text-gray-700 dark:text-gray-300 text-lg italic">
                  &ldquo;{examples[currentExampleIndex]}&rdquo;
                </p>
                <div className="flex justify-center mt-4 space-x-1">
                  {examples.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentExampleIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Text Display */}
            {generatedText && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 max-w-full" data-tutorial="generated-text">
                {/* Header with Action Buttons */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('ui.generated_response')}
                  </h3>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-gray-300 text-gray-600 shadow-sm"
                      title={isCopied ? t('ui.copied') : t('ui.copy')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleRegenerate}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-gray-300 text-gray-600 shadow-sm"
                      title={t('ui.regenerate')}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Generated Text */}
                <div className="generated-text-container text-gray-800 dark:text-gray-200">
                  {generatedText}
                </div>
                
                {/* Share Button Below */}
                <div className="mt-4">
                  <Button
                    onClick={handleShare}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3"
                    data-tutorial="share-button"
                  >
                    <Share className="mr-2 h-4 w-4" />
                    {t('ui.share')}
                  </Button>
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="space-y-6" data-tutorial="input-form">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('ui.what_do_you_want_to_ask')}
                </h3>
                
                <div className="space-y-4">
                  {/* Main Input */}
                  <div>
                    <textarea
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      placeholder={t('ui.type_your_request')}
                      className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('common.recipient_name')} ({t('common.optional')})
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder={t('ui.recipient_name_placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={isGenerating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('common.recipient_relationship')} ({t('common.optional')})
                      </label>
                      <select
                        value={recipientRelationship}
                        onChange={(e) => setRecipientRelationship(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={isGenerating}
                      >
                        <option value="">{t('ui.select_relationship')}</option>
                        {relationships.map((rel) => (
                          <option key={rel.value} value={rel.value}>
                            {rel.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!originalText.trim() || isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generating...
                      </>
                    ) : (isDetecting || isLoading) ? (
                      <>
                        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Detecting language...
                      </>
                    ) : (
                      <>
                        {t('ui.generate_response')}
                        <Heart className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Back to Home */}
              <div className="text-center">
                <Button asChild variant="outline">
                  <Link href="/" className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                    {t('ui.back_to_home')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={handleDonationModalClose}
        generationCount={generationCount}
        language={currentLanguage.code}
      />

      {/* Tutorial Components */}
    </div>
  )
}