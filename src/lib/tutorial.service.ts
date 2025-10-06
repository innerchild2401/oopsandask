import { TutorialConfig, TutorialStep } from './tutorial.types'

export class TutorialService {
  private static async generateTutorialText(step: string, language: string): Promise<{ title: string; description: string }> {
    try {
      const response = await fetch('/api/tutorial-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step,
          language,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.error('Failed to generate tutorial text:', error)
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

  static async getMainTutorial(language: string = 'en'): Promise<TutorialConfig> {
    const steps: TutorialStep[] = []

    // Step 1: Welcome
    const welcomeText = await this.generateTutorialText('main-welcome', language)
    steps.push({
      id: 'welcome',
      title: welcomeText.title,
      description: welcomeText.description,
      screenshot: '/tutorial-screenshots/main-welcome.png',
      highlight: { x: 50, y: 50, width: 300, height: 200 }
    })

    // Step 2: Mode Selection
    const modesText = await this.generateTutorialText('main-modes', language)
    steps.push({
      id: 'modes',
      title: modesText.title,
      description: modesText.description,
      targetElement: '[data-tutorial="mode-cards"]',
      position: 'bottom',
      action: 'tap'
    })

    // Step 3: Input Interface
    const inputText = await this.generateTutorialText('main-input', language)
    steps.push({
      id: 'input',
      title: inputText.title,
      description: inputText.description,
      targetElement: '[data-tutorial="input-form"]',
      position: 'top',
      action: 'tap'
    })

    // Step 4: Generated Output
    const outputText = await this.generateTutorialText('main-output', language)
    steps.push({
      id: 'output',
      title: outputText.title,
      description: outputText.description,
      targetElement: '[data-tutorial="generated-text"]',
      position: 'top',
      action: 'tap'
    })

    // Step 5: Share Button
    const shareText = await this.generateTutorialText('main-share', language)
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

  static async getReplyTutorial(language: string = 'en'): Promise<TutorialConfig> {
    const steps: TutorialStep[] = []

    // Step 1: Welcome to Reply Mode
    const welcomeText = await this.generateTutorialText('reply-welcome', language)
    steps.push({
      id: 'welcome',
      title: welcomeText.title,
      description: welcomeText.description,
      screenshot: '/tutorial-screenshots/reply-welcome.png',
      highlight: { x: 50, y: 50, width: 300, height: 200 }
    })

    // Step 2: Reply Interface
    const interfaceText = await this.generateTutorialText('reply-interface', language)
    steps.push({
      id: 'interface',
      title: interfaceText.title,
      description: interfaceText.description,
      targetElement: '[data-tutorial="reply-form"]',
      position: 'top',
      action: 'tap'
    })

    // Step 3: Generated Reply
    const outputText = await this.generateTutorialText('reply-output', language)
    steps.push({
      id: 'output',
      title: outputText.title,
      description: outputText.description,
      targetElement: '[data-tutorial="generated-text"]',
      position: 'top',
      action: 'tap'
    })

    // Step 4: Navigation
    const navText = await this.generateTutorialText('reply-navigation', language)
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
