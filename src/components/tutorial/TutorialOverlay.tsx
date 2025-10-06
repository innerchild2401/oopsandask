'use client'

import React, { useState, useEffect } from 'react'
import { TutorialStep } from './TutorialStep'
import { Spotlight } from './Spotlight'
import { useTutorial } from '@/lib/tutorial.context'
import { TutorialService } from '@/lib/tutorial.service'
import { TutorialConfig } from '@/lib/tutorial.types'
import { useTranslation } from '@/lib/i18n'

export function TutorialOverlay() {
  const { isActive, currentStep, tutorialType, nextStep, prevStep, skipTutorial, closeTutorial } = useTutorial()
  const { currentLanguage } = useTranslation()
  const [config, setConfig] = useState<TutorialConfig | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isActive && tutorialType) {
      loadTutorialConfig()
    }
  }, [isActive, tutorialType])

  const loadTutorialConfig = async () => {
    if (!tutorialType) return

    setIsLoading(true)
    try {
      const tutorialConfig = tutorialType === 'main' 
        ? await TutorialService.getMainTutorial(currentLanguage.code)
        : await TutorialService.getReplyTutorial(currentLanguage.code)
      
      setConfig(tutorialConfig)
    } catch (error) {
      console.error('Failed to load tutorial config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isActive || !config || isLoading) {
    return null
  }

  const currentStepData = config.steps[currentStep]
  const canGoBack = currentStep > 0
  const canGoForward = currentStep < config.steps.length - 1

  const handleNext = () => {
    if (canGoForward) {
      nextStep()
    } else {
      closeTutorial()
    }
  }

  const handlePrev = () => {
    if (canGoBack) {
      prevStep()
    }
  }

  return (
    <>
      {/* Spotlight Effect - Lower z-index so it doesn't block modal */}
      <Spotlight
        targetElement={currentStepData.targetElement}
        highlight={currentStepData.highlight}
        isActive={isActive}
      />
      
      {/* Tutorial Step - Higher z-index */}
      <TutorialStep
        step={currentStepData}
        currentStep={currentStep}
        totalSteps={config.steps.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={skipTutorial}
        onClose={closeTutorial}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
    </>
  )
}
