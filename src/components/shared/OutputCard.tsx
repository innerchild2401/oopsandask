'use client'

import { useState } from 'react'
import { Copy, RefreshCw, Star, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TypewriterText } from './TypewriterText'
import { useTranslation } from '@/lib/i18n'

interface OutputCardProps {
  generatedText: string
  originalText: string
  mode: 'oops' | 'ask' | 'ask_attorney'
  isGenerating: boolean
  isCopied: boolean
  isShared: boolean
  userRating: number | null
  onCopy: () => void
  onShare: () => void
  onRegenerate: () => void
  onTryAgain: () => void
  onRatingChange: (rating: number) => void
  className?: string
}

export function OutputCard({
  generatedText,
  mode,
  isGenerating,
  isCopied,
  userRating,
  onCopy,
  onShare,
  onRegenerate,
  onTryAgain,
  onRatingChange,
  className = ''
}: OutputCardProps) {
  const { t } = useTranslation()
  const [showTypewriter, setShowTypewriter] = useState(true)

  const getModeConfig = () => {
    switch (mode) {
      case 'oops':
        return {
          title: '😬 Dramatic Apology',
          icon: '😬',
          gradient: 'from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950',
          color: 'text-red-600'
        }
      case 'ask':
        return {
          title: '💌 Persuasive Request',
          icon: '💌',
          gradient: 'from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950',
          color: 'text-blue-600'
        }
      case 'ask_attorney':
        return {
          title: '⚖️ Legal Request',
          icon: '⚖️',
          gradient: 'from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950',
          color: 'text-purple-600'
        }
      default:
        return {
          title: 'Generated Text',
          icon: '✨',
          gradient: 'from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
          color: 'text-gray-600'
        }
    }
  }

  const config = getModeConfig()

  if (!generatedText) {
    return (
      <div className={`bg-card rounded-lg p-6 border shadow-sm ${className}`}>
        <div className="text-center py-12">
          <div className="text-4xl mb-4 opacity-50 animate-pulse">
            {config.icon}
          </div>
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {mode === 'oops' ? t('output.awaits_apology') : mode === 'ask_attorney' ? t('output.awaits_legal') : t('output.awaits_request')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {mode === 'oops'
              ? t('output.describe_mistake')
              : mode === 'ask_attorney'
              ? t('output.enable_legal')
              : t('output.craft_convincing')
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card rounded-lg p-6 border shadow-sm animate-fade-in ${className}`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">{config.icon}</span>
        {config.title}
      </h2>
      
      <div className={`bg-gradient-to-r ${config.gradient} rounded-lg p-6 mb-6 min-h-[200px] border`}>
        <div className="text-lg leading-relaxed font-medium">
          {showTypewriter && !isGenerating ? (
            <TypewriterText
              text={generatedText}
              speed={20}
              onComplete={() => setShowTypewriter(false)}
            />
          ) : (
            generatedText
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={onCopy}
          variant={isCopied ? 'default' : 'outline'}
          className={isCopied ? 'bg-green-500 hover:bg-green-600' : ''}
          disabled={isGenerating}
        >
          <Copy className="mr-2 h-4 w-4" />
          {isCopied ? 'Copied!' : t('common.copy')}
        </Button>
        
        <Button 
          onClick={onShare} 
          variant="outline"
          disabled={isGenerating}
          className="bg-green-500 hover:bg-green-600 text-white border-green-500"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
        
        <Button 
          onClick={onRegenerate} 
          variant="outline"
          disabled={isGenerating}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
        
        <Button 
          onClick={onTryAgain} 
          variant="outline"
          disabled={isGenerating}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('common.try_again')}
        </Button>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">
          {mode === 'oops' ? t('output.rate_apology') : t('output.rate_request')}
        </span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            disabled={isGenerating}
            className={`${userRating && star <= userRating 
              ? 'text-yellow-400' 
              : 'text-gray-300 hover:text-yellow-400'
            } transition-colors disabled:opacity-50`}
          >
            <Star className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  )
}
