'use client'

import React from 'react'
import { Zap, ArrowRight, Coffee, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { useGeneration } from '@/hooks/useGeneration'
import { OutputCard } from '@/components/shared/OutputCard'
import { DonationModal } from '@/components/shared/DonationModal'
import Link from 'next/link'

export default function OopsPage() {
  const { t, currentLanguage } = useTranslation()
  
  const {
    originalText,
    setOriginalText,
    generatedText,
    isGenerating,
    isCopied,
    isShared,
    userRating,
    setUserRating,
    generationCount,
    showDonationModal,
    handleGenerate,
    handleCopy,
    handleShare,
    handleRegenerate,
    handleTryAgain,
    handleDonationModalClose,
  } = useGeneration({ 
    mode: 'oops'
  })

  const examples = [
    "I forgot to call you back",
    "I accidentally deleted your important file",
    "I was late to our dinner date",
    "I broke your favorite mug",
    "I forgot your birthday"
  ]

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
            
            {/* Language indicator */}
            <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-900 rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {currentLanguage.flag} {currentLanguage.nativeName}
              </span>
            </div>
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
                  className="w-full min-h-[200px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  disabled={isGenerating}
                />
                
                <div className="mt-4">
                  <Button 
                    onClick={handleGenerate}
                    disabled={!originalText.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {isGenerating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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

              {/* Example Apologies */}
                     <div className="bg-card rounded-lg p-6 border shadow-sm">
                       <h3 className="text-lg font-semibold mb-4">💡 {t('oops.example_title')}</h3>
                       <div className="space-y-3">
                         {examples.map((example, index) => (
                           <button
                             key={index}
                             onClick={() => setOriginalText(example)}
                             className="w-full text-left p-3 border rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors duration-200 text-sm"
                             disabled={isGenerating}
                           >
                             &ldquo;{example}&rdquo;
                           </button>
                         ))}
                       </div>
                     </div>

                     {/* Generation Stats */}
                     {generatedText && (
                       <div className="bg-card rounded-lg p-6 border shadow-sm">
                         <h3 className="text-lg font-semibold mb-4 flex items-center">
                           <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                           {t('oops.stats_title')}
                         </h3>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                           <div>
                             <span className="text-muted-foreground">Language:</span>
                             <span className="ml-2 font-medium">{currentLanguage.nativeName}</span>
                           </div>
                           <div>
                             <span className="text-muted-foreground">Mode:</span>
                             <span className="ml-2 font-medium">😬 Oops</span>
                           </div>
                           <div>
                             <span className="text-muted-foreground">Style:</span>
                             <span className="ml-2 font-medium">Dramatic</span>
                           </div>
                           <div>
                             <span className="text-muted-foreground">Count:</span>
                             <span className="ml-2 font-medium">{generationCount}</span>
                           </div>
                         </div>
                       </div>
                     )}

                     {/* Switch Mode */}
                     <div className="bg-card rounded-lg p-6 border shadow-sm">
                       <h3 className="text-lg font-semibold mb-4">{t('oops.switch_mode_title')}</h3>
                       <p className="text-sm text-muted-foreground mb-4">
                         {t('oops.switch_mode_description')}
                       </p>
                       <Button asChild variant="outline" className="w-full">
                         <Link href="/ask" className="flex items-center justify-center">
                           <span className="mr-2">💌</span>
                           {t('oops.switch_mode_button')}
                           <ArrowRight className="ml-2 h-4 w-4" />
                         </Link>
                       </Button>
                     </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <OutputCard
                generatedText={generatedText}
                originalText={originalText}
                mode="oops"
                isGenerating={isGenerating}
                isCopied={isCopied}
                isShared={isShared}
                userRating={userRating}
                onCopy={handleCopy}
                onShare={handleShare}
                onRegenerate={handleRegenerate}
                onTryAgain={handleTryAgain}
                onRatingChange={setUserRating}
              />

                     {/* Tips */}
                     <div className="bg-card rounded-lg p-6 border shadow-sm">
                       <h3 className="text-lg font-semibold mb-4">💡 {t('oops.tips_title')}</h3>
                       <ul className="space-y-2 text-sm text-muted-foreground">
                         <li>• {t('oops.tip_1')}</li>
                         <li>• {t('oops.tip_2')}</li>
                         <li>• {t('oops.tip_3')}</li>
                         <li>• {t('oops.tip_4')}</li>
                         <li>• {t('oops.tip_5')}</li>
                       </ul>
                     </div>

                     {/* Buy Me a Coffee */}
                     <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                       <div className="text-center">
                         <Coffee className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                         <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                           {t('footer.buy_coffee')}
                         </h3>
                         <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                           {t('footer.support_message')} ☕
                         </p>
                         <Button
                           asChild
                           className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                         >
                           <a 
                             href={process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL || '#'} 
                             target="_blank" 
                             rel="noopener noreferrer"
                           >
                             <Coffee className="mr-2 h-4 w-4" />
                             {t('footer.buy_coffee')}
                           </a>
                         </Button>
                       </div>
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
