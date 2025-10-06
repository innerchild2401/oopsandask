'use client'

import React, { useEffect, useState, useCallback } from 'react'
import './TutorialHighlight.css'

interface SpotlightProps {
  targetElement?: string
  highlight?: {
    x: number
    y: number
    width: number
    height: number
  }
  isActive: boolean
}

export function Spotlight({ targetElement, highlight, isActive }: SpotlightProps) {
  const [position, setPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)

  const scrollToElement = useCallback((element: Element) => {
    setIsScrolling(true)
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'center'
    })
    
    // Wait for scroll to complete
    setTimeout(() => {
      setIsScrolling(false)
    }, 1000)
  }, [])

  const updatePosition = useCallback(() => {
    if (!isActive) {
      setPosition(null)
      setHighlightedElement(null)
      return
    }

    if (highlight) {
      setPosition(highlight)
      return
    }

    if (targetElement) {
      const element = document.querySelector(targetElement)
      if (element) {
        // Add highlight class to the element
        element.classList.add('tutorial-highlight')
        setHighlightedElement(element)
        
        // Scroll to element first
        scrollToElement(element)
        
        // Wait a bit for scroll to complete, then get position
        setTimeout(() => {
          const rect = element.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          const viewportWidth = window.innerWidth
          
          // Check if element is in viewport
          const isInViewport = rect.top >= 0 && 
            rect.left >= 0 && 
            rect.bottom <= viewportHeight && 
            rect.right <= viewportWidth
          
          if (!isInViewport) {
            // If not in viewport, scroll again
            scrollToElement(element)
          }
          
          setPosition({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
          })
        }, 500)
      }
    }
  }, [targetElement, highlight, isActive, scrollToElement])

  // Clean up highlight class when component unmounts or becomes inactive
  useEffect(() => {
    return () => {
      if (highlightedElement) {
        highlightedElement.classList.remove('tutorial-highlight')
      }
    }
  }, [highlightedElement])

  useEffect(() => {
    updatePosition()
    
    // Re-check position on window resize
    const handleResize = () => {
      if (isActive) {
        updatePosition()
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updatePosition, isActive])

  if (!isActive || !position || isScrolling) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Semi-transparent dark overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Playful spotlight cutout with hand-drawn effect */}
      <div
        className="absolute bg-transparent rounded-full"
        style={{
          left: Math.max(0, position.x - 20),
          top: Math.max(0, position.y - 20),
          width: Math.min(position.width + 40, window.innerWidth - 40),
          height: Math.min(position.height + 40, window.innerHeight - 40),
          background: 'radial-gradient(ellipse, transparent 0%, transparent 60%, rgba(0,0,0,0.1) 100%)',
          border: '4px solid #FF6B35',
          boxShadow: '0 0 20px rgba(255, 107, 53, 0.5), inset 0 0 20px rgba(255, 107, 53, 0.2)',
          animation: 'tutorial-pulse 2s infinite, tutorial-glow 2s infinite'
        }}
      />
      
      {/* Animated arrow pointing to element */}
      <div
        className="tutorial-arrow"
        style={{
          left: position.x + position.width / 2 - 15,
          top: Math.max(0, position.y - 30),
        }}
      />
      
      {/* Sparkle effects around the highlighted element */}
      <div
        className="tutorial-sparkle"
        style={{
          left: position.x + position.width * 0.2,
          top: position.y + position.height * 0.1,
        }}
      />
      <div
        className="tutorial-sparkle"
        style={{
          left: position.x + position.width * 0.8,
          top: position.y + position.height * 0.2,
        }}
      />
      <div
        className="tutorial-sparkle"
        style={{
          left: position.x + position.width * 0.1,
          top: position.y + position.height * 0.7,
        }}
      />
      <div
        className="tutorial-sparkle"
        style={{
          left: position.x + position.width * 0.75,
          top: position.y + position.height * 0.8,
        }}
      />
    </div>
  )
}
