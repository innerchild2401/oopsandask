'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { TutorialContextType, TutorialType } from './tutorial.types'

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [tutorialType, setTutorialType] = useState<TutorialType | null>(null)

  const startTutorial = useCallback((type: TutorialType) => {
    setTutorialType(type)
    setCurrentStep(0)
    setIsActive(true)
    
    // Store tutorial state in localStorage
    localStorage.setItem('oops-ask-tutorial-active', 'true')
    localStorage.setItem('oops-ask-tutorial-type', type)
  }, [])

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
    localStorage.setItem('oops-ask-tutorial-completed', 'true')
    localStorage.removeItem('oops-ask-tutorial-active')
    localStorage.removeItem('oops-ask-tutorial-type')
  }, [])

  const closeTutorial = useCallback(() => {
    setIsActive(false)
    setCurrentStep(0)
    setTutorialType(null)
    
    // Mark tutorial as completed
    localStorage.setItem('oops-ask-tutorial-completed', 'true')
    localStorage.removeItem('oops-ask-tutorial-active')
    localStorage.removeItem('oops-ask-tutorial-type')
  }, [])

  // Check for tutorial state on mount
  useEffect(() => {
    const isTutorialActive = localStorage.getItem('oops-ask-tutorial-active') === 'true'
    const tutorialType = localStorage.getItem('oops-ask-tutorial-type') as TutorialType | null
    
    if (isTutorialActive && tutorialType) {
      setIsActive(true)
      setTutorialType(tutorialType)
    }
  }, [])

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
