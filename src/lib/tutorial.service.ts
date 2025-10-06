import { TutorialConfig, TutorialStep } from './tutorial.types'
import { TranslationKey } from './translation.types'

export class TutorialService {
  private static getTutorialText(step: string, t: (key: TranslationKey, fallback?: string) => string): { title: string; description: string } {
    const stepMap: Record<string, { titleKey: TranslationKey; descriptionKey: TranslationKey }> = {
      'main-welcome': {
        titleKey: 'tutorial.main_welcome_title',
        descriptionKey: 'tutorial.main_welcome_description'
      },
      'main-modes': {
        titleKey: 'tutorial.main_modes_title',
        descriptionKey: 'tutorial.main_modes_description'
      },
      'main-input': {
        titleKey: 'tutorial.main_input_title',
        descriptionKey: 'tutorial.main_input_description'
      },
      'main-output': {
        titleKey: 'tutorial.main_output_title',
        descriptionKey: 'tutorial.main_output_description'
      },
      'main-share': {
        titleKey: 'tutorial.main_share_title',
        descriptionKey: 'tutorial.main_share_description'
      },
      'reply-welcome': {
        titleKey: 'tutorial.reply_welcome_title',
        descriptionKey: 'tutorial.reply_welcome_description'
      },
      'reply-interface': {
        titleKey: 'tutorial.reply_interface_title',
        descriptionKey: 'tutorial.reply_interface_description'
      },
      'reply-output': {
        titleKey: 'tutorial.reply_output_title',
        descriptionKey: 'tutorial.reply_output_description'
      },
      'reply-navigation': {
        titleKey: 'tutorial.reply_navigation_title',
        descriptionKey: 'tutorial.reply_navigation_description'
      }
    }

    const stepConfig = stepMap[step]
    if (stepConfig) {
      return {
        title: t(stepConfig.titleKey),
        description: t(stepConfig.descriptionKey)
      }
    }

    // Fallback to English
    return this.getFallbackText(step)
  }

  private static getFallbackText(step: string): { title: string; description: string } {
    const fallbacks: Record<string, { title: string; description: string }> = {
      'main-welcome': {
        title: 'Welcome! 👋',
        description: 'Create dramatic messages for life\'s awkward moments. Let\'s get started!'
      },
      'main-modes': {
        title: 'Choose Your Mode 🎭',
        description: 'Tap "Ask" for requests or "Oops" for apologies. Each has its own dramatic style!'
      },
      'main-input': {
        title: 'Tell Us What You Need ✍️',
        description: 'Type your message, add a name, and select relationship. AI will make it dramatic!'
      },
      'main-output': {
        title: 'Your Dramatic Message ✨',
        description: 'Here\'s your generated message! Copy it or regenerate for a different style.'
      },
      'main-share': {
        title: 'Share Your Message 📤',
        description: 'Tap share to open your phone\'s sharing options. Send via any app you prefer!'
      },
      'reply-welcome': {
        title: 'Reply Mode 💬',
        description: 'You\'re replying to a dramatic message! Choose your voice and craft your response.'
      },
      'reply-interface': {
        title: 'Reply Interface 🎯',
        description: 'Select dramatic or legal voice, then type your reply. AI will match the style!'
      },
      'reply-output': {
        title: 'Your Reply 🎪',
        description: 'Here\'s your dramatic reply! Copy it or regenerate for a different approach.'
      },
      'reply-navigation': {
        title: 'Back to Home 🏠',
        description: 'When done, tap "Back to Home" to create new messages for other friends!'
      }
    }

    return fallbacks[step] || { title: 'Tutorial Step', description: 'Follow the instructions to continue.' }
  }

  static getMainTutorial(t: (key: TranslationKey, fallback?: string) => string): TutorialConfig {
    const steps: TutorialStep[] = []

    // Step 1: Welcome
    const welcomeText = this.getTutorialText('main-welcome', t)
    steps.push({
      id: 'welcome',
      title: welcomeText.title,
      description: welcomeText.description,
      screenshot: '/tutorial-screenshots/main-welcome.png',
      highlight: { x: 50, y: 50, width: 300, height: 200 }
    })

    // Step 2: Mode Selection
    const modesText = this.getTutorialText('main-modes', t)
    steps.push({
      id: 'modes',
      title: modesText.title,
      description: modesText.description,
      targetElement: '[data-tutorial="mode-cards"]',
      position: 'bottom',
      action: 'tap'
    })

    // Step 3: Input Interface
    const inputText = this.getTutorialText('main-input', t)
    steps.push({
      id: 'input',
      title: inputText.title,
      description: inputText.description,
      targetElement: '[data-tutorial="input-form"]',
      position: 'top',
      action: 'tap'
    })

    // Step 4: Generated Output
    const outputText = this.getTutorialText('main-output', t)
    steps.push({
      id: 'output',
      title: outputText.title,
      description: outputText.description,
      targetElement: '[data-tutorial="generated-text"]',
      position: 'top',
      action: 'tap'
    })

    // Step 5: Share Button
    const shareText = this.getTutorialText('main-share', t)
    steps.push({
      id: 'share',
      title: shareText.title,
      description: shareText.description,
      targetElement: '[data-tutorial="share-button"]',
      position: 'top',
      action: 'tap'
    })

    return {
      type: 'main',
      steps,
      showProgress: true,
      allowSkip: true,
      autoAdvance: false
    }
  }

  static getReplyTutorial(t: (key: TranslationKey, fallback?: string) => string): TutorialConfig {
    const steps: TutorialStep[] = []

    // Step 1: Welcome to Reply Mode
    const welcomeText = this.getTutorialText('reply-welcome', t)
    steps.push({
      id: 'welcome',
      title: welcomeText.title,
      description: welcomeText.description,
      screenshot: '/tutorial-screenshots/reply-welcome.png',
      highlight: { x: 50, y: 50, width: 300, height: 200 }
    })

    // Step 2: Reply Interface
    const interfaceText = this.getTutorialText('reply-interface', t)
    steps.push({
      id: 'interface',
      title: interfaceText.title,
      description: interfaceText.description,
      targetElement: '[data-tutorial="reply-form"]',
      position: 'top',
      action: 'tap'
    })

    // Step 3: Generated Reply
    const outputText = this.getTutorialText('reply-output', t)
    steps.push({
      id: 'output',
      title: outputText.title,
      description: outputText.description,
      targetElement: '[data-tutorial="generated-text"]',
      position: 'top',
      action: 'tap'
    })

    // Step 4: Navigation
    const navText = this.getTutorialText('reply-navigation', t)
    steps.push({
      id: 'navigation',
      title: navText.title,
      description: navText.description,
      targetElement: '[data-tutorial="back-home"]',
      position: 'top',
      action: 'tap'
    })

    return {
      type: 'reply',
      steps,
      showProgress: true,
      allowSkip: true,
      autoAdvance: false
    }
  }
}
