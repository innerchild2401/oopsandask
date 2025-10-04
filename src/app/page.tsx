'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Heart, Globe, Star, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 pt-24 pb-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Title */}
            <div className="mb-12">
              <h1 className="mb-8 animate-fade-in-up">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {t('home.welcome')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
                {t('home.subtitle')}
              </p>
            </div>

            {/* Language Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm rounded-full px-6 py-3 mb-12 animate-fade-in-up animate-delay-300 border border-primary/20">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                {currentLanguage.nativeName} {currentLanguage.flag}
              </span>
            </div>

            {/* Mode Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16 animate-fade-in-up animate-delay-400">
              {modes.map((mode, index) => (
                <div
                  key={mode.id}
                  className={`${mode.bgColor} rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl group cursor-pointer backdrop-blur-sm`}
                  style={{ 
                    animationDelay: `${500 + index * 100}ms`,
                    animation: 'fade-in-up 0.6s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <Link href={mode.href} className="block">
                    <div className="flex items-center justify-center mb-6">
                      <div className={`text-7xl group-hover:scale-110 transition-transform duration-300 ${mode.color} animate-float`}>
                        {mode.icon}
                      </div>
                    </div>
                    <h3 className={`text-3xl font-bold mb-4 ${mode.color}`}>
                      {mode.title}
                    </h3>
                    <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                      {mode.description}
                    </p>
                    <Button 
                      variant="gradient" 
                      size="lg" 
                      className="w-full group-hover:scale-105 transition-all duration-300"
                    >
                      {t('home.get_started')}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up animate-delay-600">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
                <p className="text-muted-foreground leading-relaxed">Powered by GPT-4o-mini for dramatic, contextual responses</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-success to-accent rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multilingual</h3>
                <p className="text-muted-foreground leading-relaxed">Available in 20+ languages with cultural adaptations</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-accent to-warning rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Dramatic</h3>
                <p className="text-muted-foreground leading-relaxed">Theatrical flair that turns any message into a masterpiece</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center animate-fade-in-up animate-delay-700">
              <p className="text-xl mb-8 text-muted-foreground font-medium">
                Ready to transform your communication? 
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="xl" variant="gradient" className="text-lg">
                  <Link href="/oops" className="flex items-center">
                    <span className="mr-3 text-2xl">😬</span>
                    Try Oops Mode
                    <Sparkles className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="text-lg">
                  <Link href="/ask" className="flex items-center">
                    <span className="mr-3 text-2xl">💌</span>
                    Try Ask Mode
                    <Heart className="ml-3 h-5 w-5" />
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