'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { generateSessionToken } from '@/lib/utils'

export default function HomePage() {
  const { t, currentLanguage } = useTranslation()
  const [, setSessionToken] = useState<string>('')

  // Initialize session token
  useEffect(() => {
    let token = localStorage.getItem('oops-ask-session')
    if (!token) {
      token = generateSessionToken()
      localStorage.setItem('oops-ask-session', token)
    }
    setSessionToken(token)
  }, [])

  const modes = [
    {
      id: 'oops',
      title: t('home.oops_title'),
      description: t('home.oops_description'),
      href: '/oops',
      icon: '😬',
      gradient: 'from-red-500 to-pink-600',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      id: 'ask',
      title: t('home.ask_title'),
      description: t('home.ask_description'),
      href: '/ask',
      icon: '💌',
      gradient: 'from-blue-500 to-purple-600',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-full overflow-hidden">
        <div className="max-w-full text-center overflow-hidden">
          {/* Main Title - Smaller and darker */}
            <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('home.welcome')}
              </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('home.subtitle')}
              </p>
            </div>

            {/* Language Badge */}
          <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 mb-12">
            <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentLanguage.nativeName} {currentLanguage.flag}
              </span>
            </div>

          {/* Mode Selection Cards - Cleaner design */}
          <div className="grid md:grid-cols-2 gap-6 mb-16" data-tutorial="mode-cards">
            {modes.map((mode) => (
              <Link
                  key={mode.id}
                href={mode.href}
                className={`${mode.bgColor} rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg group`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-200">
                        {mode.icon}
                      </div>
                  <h3 className={`text-2xl font-bold mb-3 ${mode.color}`}>
                      {mode.title}
                    </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {mode.description}
                    </p>
                    <Button 
                    variant="outline" 
                      size="lg" 
                    className={`w-full border-2 ${mode.color} hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white`}
                    >
                      {t('home.get_started')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
              </Link>
              ))}
            </div>

          {/* Simple CTA */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('ui.choose_mode_to_start')}
            </p>
          </div>
        </div>
      </div>

      {/* Tutorial Components */}
    </div>
  )
}