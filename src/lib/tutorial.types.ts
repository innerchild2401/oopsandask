export type TutorialType = 'main' | 'reply'

export interface TutorialStep {
  id: string
  title: string
  description: string
  targetElement?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  action?: 'tap' | 'swipe' | 'scroll'
  screenshot?: string
  highlight?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface TutorialConfig {
  type: TutorialType
  steps: TutorialStep[]
  showProgress: boolean
  allowSkip: boolean
  autoAdvance?: boolean
  autoAdvanceDelay?: number
}

export interface TutorialContextType {
  isActive: boolean
  currentStep: number
  tutorialType: TutorialType | null
  startTutorial: (type: TutorialType) => void
  nextStep: () => void
  prevStep: () => void
  skipTutorial: () => void
  closeTutorial: () => void
}
