'use client'

import { useState, useEffect } from 'react'
import { Heart, ArrowRight, RefreshCw, Copy, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { useGeneration } from '@/hooks/useGeneration'
import { DonationModal } from '@/components/shared/DonationModal'
import Link from 'next/link'

export default function OopsPage() {
  const { t, isLoading: isTranslating } = useTranslation()
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
    generationCount,
    showDonationModal,
    handleDonationModalClose,
  } = useGeneration({ 
    mode: 'oops'
  })

  const examples = [
    "I forgot to call you back yesterday",
    "I accidentally deleted your important file",
    "I was late to our meeting again",
    "I broke your favorite coffee mug",
    "I forgot your birthday",
    "I didn't text you back for 3 days",
    "I ate the last slice of pizza",
    "I forgot to pick up the groceries"
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('oops.title')}
              {isTranslating && <span className="ml-2 text-sm text-gray-500">(Loading translations...)</span>}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('oops.description')}
            </p>
          </div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Examples Carousel */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 h-96 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  {t('ui.examples')}
                </h3>
                <div className="text-center">
                  <div className="text-6xl mb-4">😬</div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg italic">
                    &ldquo;{examples[currentExampleIndex]}&rdquo;
                  </p>
                  <div className="flex justify-center mt-4 space-x-1">
                    {examples.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentExampleIndex ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Generated Text Display */}
              {generatedText && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('ui.generated_apology')}
                  </h3>
                  <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full">
                    {generatedText}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {t('ui.copy')}
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t('ui.share')}
                    </Button>
                    <Button
                      onClick={handleRegenerate}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {t('ui.regenerate')}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Input Form */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('ui.what_did_you_mess_up')}
                </h3>
                
                <div className="space-y-4">
                  {/* Main Input */}
                  <div>
                    <textarea
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      placeholder={t('ui.describe_what_went_wrong')}
                      className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      disabled={isGenerating || isDetecting || isLoading}
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={isGenerating || isDetecting || isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('common.recipient_relationship')} ({t('common.optional')})
                      </label>
                      <select
                        value={recipientRelationship}
                        onChange={(e) => setRecipientRelationship(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={isGenerating || isDetecting || isLoading}
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
                    disabled={!originalText.trim() || isGenerating || isDetecting || isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
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
                        {t('ui.generate_apology')}
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
      />
    </div>
  )
}