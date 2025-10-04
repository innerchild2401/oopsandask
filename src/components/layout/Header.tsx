'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Coffee, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { LanguageSelector } from './LanguageSelector'
import { NavItem } from '@/lib/types'

export function Header() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const navigation: NavItem[] = [
    { title: t('nav.home'), href: '/' },
    { title: t('nav.oops'), href: '/oops' },
    { title: t('nav.ask'), href: '/ask' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and App Title */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-primary animate-dramatic-appeal" />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-primary">{t('nav.app_title')}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">{t('nav.tagline')}</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={isActive(item.href) ? 'default' : 'ghost'}
                className="relative"
              >
                <Link href={item.href} className="flex items-center space-x-2">
                  {item.href === '/oops' && <span className="text-lg">😬</span>}
                  {item.href === '/ask' && <span className="text-lg">💌</span>}
                  <span>{item.title}</span>
                </Link>
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            {/* Support link */}
            <Button variant="outline" size="sm" asChild>
              <a 
                href={process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1"
              >
                <Coffee className="h-4 w-4" />
                <span className="hidden sm:inline">{t('footer.buy_coffee')}</span>
              </a>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t py-4 animate-fade-in">
            <div className="flex flex-col space-y-2 mb-4 sm:hidden">
              <LanguageSelector />
            </div>
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={item.href} className="flex items-center space-x-2">
                    {item.href === '/oops' && <span className="text-lg">😬</span>}
                    {item.href === '/ask' && <span className="text-lg">💌</span>}
                    <span>{item.title}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}