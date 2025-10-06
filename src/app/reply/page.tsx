'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCw, MessageCircle, Scale, ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useGeneration } from '@/hooks/useGeneration'
import { DonationModal } from '@/components/shared/DonationModal'
import Link from 'next/link'

function ReplyPageContent() {
  const { t, currentLanguage } = useTranslation()
  const searchParams = useSearchParams()
  const [replyVoice, setReplyVoice] = useState<'dramatic' | 'legal'>('dramatic')
  const [replyContext, setReplyContext] = useState('')
  const [originalMessage, setOriginalMessage] = useState('')
  
  // Get context from URL parameters
  useEffect(() => {
    const conversationId = searchParams.get('id')
    const context = searchParams.get('context')
    const message = searchParams.get('message')
    const voice = searchParams.get('voice') as 'dramatic' | 'legal'
    const originalRecipient = searchParams.get('recipient')
    
    // New UUID-based system
    if (conversationId) {
      fetch(`/api/conversations?id=${conversationId}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Failed to fetch conversation:', data.error)
            return
          }
          
          setReplyContext(data.generatedText)
          setOriginalMessage(data.originalText)
          setReplyVoice(data.replyVoice || 'dramatic')
          
          // DON'T auto-fill recipient name - let the replier input the original sender's name
          // The replier should input the name of the person they're replying TO
        })
        .catch(error => {
          console.error('Error fetching conversation:', error)
        })
    } 
    // Fallback to old URL parameter system
    else {
      if (context) setReplyContext(context)
      if (message) setOriginalMessage(message)
      if (voice) setReplyVoice(voice)
      
      // Auto-fill recipient name for reply (the person who sent the original message)
      if (originalRecipient) {
        setRecipientName(originalRecipient)
      }
    }
  }, [searchParams])
  
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
    handleRegenerate,
    handleShare,
    isShared,
    isCopied,
    generationCount,
    showDonationModal,
    setShowDonationModal
  } = useGeneration({ 
    mode: 'ask', 
    replyMode: true,
    replyContext,
    replyVoice
  })

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
    { value: 'coworker', label: t('relationship.coworker') }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-full overflow-hidden">
        <div className="max-w-full overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Link href="/" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('ui.back_to_home')}
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('reply.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('reply.description')}
            </p>
          </div>

          {/* Reply Context */}
          {originalMessage && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('reply.replying_to')}
              </h3>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full w-full overflow-hidden">
                {originalMessage}
              </div>
            </div>
          )}

          {/* Voice Selection */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('reply.choose_voice')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setReplyVoice('dramatic')}
                variant={replyVoice === 'dramatic' ? 'default' : 'outline'}
                className={`w-full h-20 flex flex-col items-center justify-center ${
                  replyVoice === 'dramatic' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <MessageCircle className="w-6 h-6 mb-2" />
                <span className="font-semibold">{t('reply.dramatic_voice')}</span>
                <span className="text-sm opacity-80">{t('reply.dramatic_description')}</span>
              </Button>
              <Button
                onClick={() => setReplyVoice('legal')}
                variant={replyVoice === 'legal' ? 'default' : 'outline'}
                className={`w-full h-20 flex flex-col items-center justify-center ${
                  replyVoice === 'legal' 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Scale className="w-6 h-6 mb-2" />
                <span className="font-semibold">{t('reply.legal_voice')}</span>
                <span className="text-sm opacity-80">{t('reply.legal_description')}</span>
              </Button>
            </div>
          </div>

          {/* Main Content Area - Single Column Mobile-First */}
          <div className="space-y-8">
            {/* Generated Text Display */}
            {generatedText && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 max-w-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('ui.generated_response')}
                </h3>
                <div className="generated-text-container text-gray-800 dark:text-gray-200">
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

            {/* Input Form */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('reply.your_response')}
                </h3>

                <div className="space-y-4">
                  {/* Main Input */}
                  <div>
                    <textarea
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      placeholder={t('reply.type_your_response')}
                      className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      disabled={isGenerating || isDetecting || isLoading}
                    />
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('ui.reply_recipient_name_label')} ({t('common.optional')})
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder={t('ui.reply_recipient_name_placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    size="lg"
                    variant="gradient"
                    className={`w-full text-white hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      replyVoice === 'legal'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t('common.loading')}
                      </>
                    ) : (isDetecting || isLoading) ? (
                      <>
                        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Detecting language...
                      </>
                    ) : (
                      <>
                        {t('reply.generate_response')}
                        {replyVoice === 'legal' ? (
                          <Scale className="ml-3 h-5 w-5" />
                        ) : (
                          <MessageCircle className="ml-3 h-5 w-5" />
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <DonationModal
          isOpen={showDonationModal}
          onClose={() => setShowDonationModal(false)}
          generationCount={generationCount}
          language={currentLanguage.code}
        />
      )}
    </div>
  )
}

export default function ReplyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReplyPageContent />
    </Suspense>
  )
}
