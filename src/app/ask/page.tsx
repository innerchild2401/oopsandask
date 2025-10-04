'use client'

import { useState } from 'react'
import { Heart, ArrowRight, Coffee, Scale, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { useGeneration } from '@/hooks/useGeneration'
import { OutputCard } from '@/components/shared/OutputCard'
import { DonationModal } from '@/components/shared/DonationModal'
import Link from 'next/link'

export default function AskPage() {
  const { t, currentLanguage } = useTranslation()
  const [attorneyMode, setAttorneyMode] = useState(false)
  
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
    mode: attorneyMode ? 'ask_attorney' : 'ask'
  })

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
    },
    {
      text: "Can you cover my shift tomorrow?",
      category: "Work Request",
      attorney: "Pursuant to the workplace accommodation statutes..."
    },
    {
      text: "Can I borrow your car for the weekend?",
      category: "Personal Favor",
      attorney: "In accordance with the vehicular lending protocols..."
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
            
            {/* Language indicator */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {currentLanguage.flag} {currentLanguage.nativeName}
              </span>
            </div>
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
                  className="w-full min-h-[200px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  disabled={isGenerating}
                />
                
                <div className="mt-4">
                  <Button 
                    onClick={handleGenerate}
                    disabled={!originalText.trim() || isGenerating}
                    className={`w-full text-white hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                      attorneyMode 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
                       <h3 className="text-lg font-semibold mb-4">💡 {t('ask.example_title')}</h3>
                <div className="space-y-3">
                  {examples.map((example, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors duration-200">
                      <p className="text-sm font-medium text-muted-foreground mb-2">{example.category}</p>
                      <p className="text-sm mb-2">{example.text}</p>
                      {attorneyMode && (
                        <p className="text-xs italic text-purple-600 mb-2">{example.attorney}</p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOriginalText(example.text)}
                        className="w-full"
                        disabled={isGenerating}
                      >
                        Use This Example
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

                     {/* Generation Stats */}
                     {generatedText && (
                       <div className="bg-card rounded-lg p-6 border shadow-sm">
                         <h3 className="text-lg font-semibold mb-4 flex items-center">
                           <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                           {t('ask.stats_title')}
                         </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Language:</span>
                      <span className="ml-2 font-medium">{currentLanguage.nativeName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mode:</span>
                      <span className="ml-2 font-medium">{attorneyMode ? '⚖️ Attorney' : '💌 Ask'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Style:</span>
                      <span className="ml-2 font-medium">Persuasive</span>
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
                       <h3 className="text-lg font-semibold mb-4">{t('ask.switch_mode_title')}</h3>
                       <p className="text-sm text-muted-foreground mb-4">
                         {t('ask.switch_mode_description')}
                       </p>
                       <Button asChild variant="outline" className="w-full">
                         <Link href="/oops" className="flex items-center justify-center">
                           <span className="mr-2">😬</span>
                           {t('ask.switch_mode_button')}
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
                mode={attorneyMode ? 'ask_attorney' : 'ask'}
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
                       <h3 className="text-lg font-semibold mb-4">
                         💡 {t('ask.tips_title')}
                       </h3>
                       <ul className="space-y-2 text-sm text-muted-foreground">
                         <li>• {t('ask.tip_1')}</li>
                         <li>• {t('ask.tip_2')}</li>
                         <li>• {t('ask.tip_3')}</li>
                         <li>• {t('ask.tip_4')}</li>
                         <li>• {t('ask.tip_5')}</li>
                         {attorneyMode && (
                           <li>• ⚖️ {t('ask.tip_6')}</li>
                         )}
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
