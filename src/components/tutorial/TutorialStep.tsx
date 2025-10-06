'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Tutorial Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Screenshot or Content */}
        {step.screenshot ? (
          <div className="mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                📱 App Screenshot
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <div className="text-center text-blue-600 dark:text-blue-400 text-sm">
                👆 {step.action === 'tap' ? 'Tap here' : step.action === 'swipe' ? 'Swipe here' : 'Look here'}
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-6">
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
        <div className="flex gap-3">
          {canGoBack && (
            <Button
              onClick={onPrev}
              variant="outline"
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          
          <Button
            onClick={onNext}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!canGoForward}
          >
            {canGoForward ? 'Next' : 'Finish'}
            {canGoForward && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>

        {/* Skip Button */}
        <div className="mt-4 text-center">
          <button
            onClick={onSkip}
            className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center justify-center mx-auto"
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
