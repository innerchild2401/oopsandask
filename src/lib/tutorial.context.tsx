'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { TutorialContextType, TutorialType } from './tutorial.types'
import { safeLocalStorage } from './safe-utils'

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [tutorialType, setTutorialType] = useState<TutorialType | null>(null)
  
  // Tutorial feature flag - set to false to disable tutorial functionality
  const TUTORIAL_ENABLED = process.env.NEXT_PUBLIC_TUTORIAL_ENABLED === 'true'

  const startTutorial = useCallback((type: TutorialType) => {
    if (!TUTORIAL_ENABLED) return
    
    setTutorialType(type)
    setCurrentStep(0)
    setIsActive(true)
    
    // Store tutorial state in localStorage
    safeLocalStorage.setItem('oops-ask-tutorial-active', 'true')
    safeLocalStorage.setItem('oops-ask-tutorial-type', type)
  }, [TUTORIAL_ENABLED])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1)
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }, [])

  const skipTutorial = useCallback(() => {
    setIsActive(false)
    setCurrentStep(0)
    setTutorialType(null)
    
    // Mark tutorial as completed
    safeLocalStorage.setItem('oops-ask-tutorial-completed', 'true')
    safeLocalStorage.removeItem('oops-ask-tutorial-active')
    safeLocalStorage.removeItem('oops-ask-tutorial-type')
  }, [])

  const closeTutorial = useCallback(() => {
    setIsActive(false)
    setCurrentStep(0)
    setTutorialType(null)
    
    // Mark tutorial as completed
    safeLocalStorage.setItem('oops-ask-tutorial-completed', 'true')
    safeLocalStorage.removeItem('oops-ask-tutorial-active')
    safeLocalStorage.removeItem('oops-ask-tutorial-type')
  }, [])

  // Check for tutorial state on mount
  useEffect(() => {
    if (!TUTORIAL_ENABLED) return
    
    const isTutorialActive = safeLocalStorage.getItem('oops-ask-tutorial-active') === 'true'
    const tutorialType = safeLocalStorage.getItem('oops-ask-tutorial-type') as TutorialType | null
    
    if (isTutorialActive && tutorialType) {
      setIsActive(true)
      setTutorialType(tutorialType)
    }
  }, [TUTORIAL_ENABLED])

  const value: TutorialContextType = {
    isActive,
    currentStep,
    tutorialType,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    closeTutorial
  }

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}

export function useTutorial() {
  const context = useContext(TutorialContext)
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}
