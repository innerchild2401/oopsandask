'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, SkipForward, ArrowDown } from 'lucide-react'
import { TutorialStep as TutorialStepType } from '@/lib/tutorial.types'

interface TutorialStepProps {
  step: TutorialStepType
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  onClose: () => void
  canGoBack: boolean
  canGoForward: boolean
}

export function TutorialStep({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onClose,
  canGoBack,
  canGoForward
}: TutorialStepProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [modalPosition, setModalPosition] = useState<'bottom' | 'top' | 'center'>('bottom')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (step.targetElement) {
      const element = document.querySelector(step.targetElement)
      if (element) {
        const rect = element.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        
        // Position modal based on element location
        if (rect.top < viewportHeight / 2) {
          setModalPosition('bottom')
        } else {
          setModalPosition('top')
        }
      }
    }
  }, [step.targetElement])

  const getModalClasses = () => {
    if (isMobile) {
      return modalPosition === 'bottom' 
        ? 'fixed bottom-0 left-0 right-0 z-50 transform translate-y-0'
        : 'fixed top-0 left-0 right-0 z-50 transform translate-y-0'
    }
    
    return 'fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2'
  }

  const getArrowClasses = () => {
    if (isMobile) {
      return modalPosition === 'bottom' 
        ? 'absolute -top-2 left-1/2 transform -translate-x-1/2'
        : 'absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-180'
    }
    
    return 'hidden'
  }

  return (
    <>
      {/* Backdrop - only on desktop */}
      {!isMobile && <div className="fixed inset-0 bg-black/20 z-40" />}
      
      {/* Tutorial Card */}
      <div className={`${getModalClasses()} bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl p-4 md:p-6 max-w-sm md:max-w-md w-full mx-auto md:mx-4 shadow-2xl border`}>
        {/* Arrow pointing to element */}
        <div className={getArrowClasses()}>
          <ArrowDown className="w-6 h-6 text-white drop-shadow-lg" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step Content */}
        <div className="text-center mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-4 md:mb-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-blue-500'
                  : index < currentStep
                  ? 'bg-blue-300'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 md:gap-3">
          {canGoBack && (
            <Button
              onClick={onPrev}
              variant="outline"
              className="flex-1 text-sm md:text-base"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          
          <Button
            onClick={onNext}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base"
            size="sm"
          >
            {canGoForward ? 'Next' : 'Finish'}
            {canGoForward && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>

        {/* Skip Button */}
        <div className="mt-3 md:mt-4 text-center">
          <button
            onClick={onSkip}
            className="text-gray-500 dark:text-gray-400 text-xs md:text-sm hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center justify-center mx-auto"
          >
            <SkipForward className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            Skip Tutorial
          </button>
        </div>
      </div>
    </>
  )
}
