'use client'

import React, { useEffect, useState, useCallback } from 'react'

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
      return
    }

    if (highlight) {
      setPosition(highlight)
      return
    }

    if (targetElement) {
      const element = document.querySelector(targetElement)
      if (element) {
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
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Spotlight cutout with better visibility */}
      <div
        className="absolute bg-transparent border-4 border-white rounded-xl shadow-2xl"
        style={{
          left: Math.max(0, position.x - 12),
          top: Math.max(0, position.y - 12),
          width: Math.min(position.width + 24, window.innerWidth - 24),
          height: Math.min(position.height + 24, window.innerHeight - 24),
        }}
      />
      
      {/* Pulsing ring for attention */}
      <div
        className="absolute border-2 border-blue-400 rounded-xl animate-ping"
        style={{
          left: Math.max(0, position.x - 16),
          top: Math.max(0, position.y - 16),
          width: Math.min(position.width + 32, window.innerWidth - 32),
          height: Math.min(position.height + 32, window.innerHeight - 32),
        }}
      />
      
      {/* Additional attention ring */}
      <div
        className="absolute border border-yellow-400 rounded-xl animate-pulse"
        style={{
          left: Math.max(0, position.x - 20),
          top: Math.max(0, position.y - 20),
          width: Math.min(position.width + 40, window.innerWidth - 40),
          height: Math.min(position.height + 40, window.innerHeight - 40),
        }}
      />
    </div>
  )
}
