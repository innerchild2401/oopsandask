'use client'

import React, { useEffect, useState } from 'react'

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

  useEffect(() => {
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
        const rect = element.getBoundingClientRect()
        setPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height
        })
      }
    }
  }, [targetElement, highlight, isActive])

  if (!isActive || !position) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Spotlight cutout */}
      <div
        className="absolute bg-transparent border-4 border-white rounded-lg shadow-2xl animate-pulse"
        style={{
          left: position.x - 8,
          top: position.y - 8,
          width: position.width + 16,
          height: position.height + 16,
        }}
      />
      
      {/* Animated ring */}
      <div
        className="absolute border-2 border-blue-400 rounded-lg animate-ping"
        style={{
          left: position.x - 12,
          top: position.y - 12,
          width: position.width + 24,
          height: position.height + 24,
        }}
      />
    </div>
  )
}
