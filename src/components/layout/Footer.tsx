'use client'

import Link from 'next/link'
import { Heart, Coffee, Github, Twitter, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

export function Footer() {
  const { t } = useTranslation()
  const buyMeACoffeeUrl = process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* App Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-primary animate-dramatic-appeal" />
              <h3 className="text-xl font-bold text-primary">Oops & Ask For</h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {t('nav.tagline')} Transform your messages into dramatic masterpieces, 
              multilingual apologies, and persuasive requests powered by AI.
            </p>
            
            {/* Support CTA */}
            {buyMeACoffeeUrl && (
              <Button asChild className="mb-4">
                <a 
                  href={buyMeACoffeeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <Coffee className="h-4 w-4" />
                  <span>{t('footer.buy_coffee')}</span>
                </a>
              </Button>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/oops" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  😬 Oops Mode
                </Link>
              </li>
              <li>
                <Link href="/ask" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  💌 Ask For Mode
                </Link>
              </li>
              <li>
                <Link href="/ask" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ⚖️ Attorney Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="mailto:support@oopsandask.com" aria-label="Email">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Oops & Ask For. Made with{' '}
              <Heart className="inline h-3 w-3 text-red-500" />{' '}
              for dramatic communication
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
