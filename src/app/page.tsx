'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Heart, Globe, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { generateSessionToken } from '@/lib/utils'

export default function HomePage() {
  const { t, currentLanguage } = useTranslation()
  const [sessionToken, setSessionToken] = useState<string>('')

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-glow">
                  {t('home.welcome')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-100">
                {t('home.subtitle')}
              </p>
            </div>

            {/* Language Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-8 animate-fade-in delay-200">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {currentLanguage.nativeName} {currentLanguage.flag}
              </span>
            </div>

            {/* Mode Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 animate-fade-in delay-300">
              {modes.map((mode, index) => (
                <div
                  key={mode.id}
                  className={`${mode.bgColor} rounded-2xl p-8 border border-border/50 hover:border-border transition-all duration-300 hover:shadow-xl group cursor-pointer`}
                  style={{ 
                    animationDelay: `${400 + index * 100}ms`,
                    animation: 'fade-in 0.6s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <Link href={mode.href} className="block">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`text-6xl group-hover:scale-110 transition-transform duration-300 ${mode.color}`}>
                        {mode.icon}
                      </div>
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 ${mode.color}`}>
                      {mode.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {mode.description}
                    </p>
                    <Button className={`w-full bg-gradient-to-r ${mode.gradient} text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                      {t('home.get_started')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in delay-500">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">Powered by GPT-4o-mini for dramatic, contextual responses</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multilingual</h3>
                <p className="text-sm text-muted-foreground">Available in 20+ languages with cultural adaptations</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Dramatic</h3>
                <p className="text-sm text-muted-foreground">Theatrical flair that turns any message into a masterpiece</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center animate-fade-in delay-600">
              <p className="text-lg mb-6 text-muted-foreground">
                Ready to transform your communication? 
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/oops" className="flex items-center">
                    <span className="mr-2">😬</span>
                    Try Oops Mode
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg">
                  <Link href="/ask" className="flex items-center">
                    <span className="mr-2">💌</span>
                    Try Ask Mode
                    <Heart className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}