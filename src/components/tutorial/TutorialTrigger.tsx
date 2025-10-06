'use client'

import React, { useEffect, useState } from 'react'
import { useTutorial } from '@/lib/tutorial.context'
import { useTranslation } from '@/lib/i18n'

interface TutorialTriggerProps {
  type: 'main' | 'reply'
  trigger?: 'auto' | 'manual'
  delay?: number
}

export function TutorialTrigger({ type, trigger = 'auto', delay = 1000 }: TutorialTriggerProps) {
  const { startTutorial } = useTutorial()
  const { currentLanguage } = useTranslation()

  useEffect(() => {
    if (trigger === 'auto') {
      // Check if tutorial was already completed
      const tutorialCompleted = localStorage.getItem('oops-ask-tutorial-completed')
      if (tutorialCompleted) {
        return
      }

      // Check if this is the first visit
      const firstVisit = !localStorage.getItem('oops-ask-first-visit')
      if (firstVisit) {
        localStorage.setItem('oops-ask-first-visit', 'true')
        
        // Start tutorial after delay
        const timer = setTimeout(() => {
          startTutorial(type)
        }, delay)

        return () => clearTimeout(timer)
      }
    }
  }, [type, trigger, delay, startTutorial])

  const handleManualStart = () => {
    startTutorial(type)
  }

  // Add touch gesture support
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // If it's a tap (small movement), start tutorial
    if (distance < 10) {
      handleManualStart()
    }

    setTouchStart(null)
  }

  if (trigger === 'manual') {
    return (
      <button
        onClick={handleManualStart}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-3 rounded-full shadow-lg z-40 transition-colors touch-manipulation"
        title="Start Tutorial"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    )
  }

  return null
}
