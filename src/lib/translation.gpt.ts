/**
 * GPT-powered translation service with cultural adaptation
 */

// Translation types are imported but not used in this file

export class GPTTranslationService {
  private static openaiApiKey = process.env.OPENAI_API_KEY

  static async translateText(
    text: string,
    targetLanguage: string,
    context: 'oops' | 'ask' | 'attorney' | 'ui' = 'ui',
    tone: 'dramatic' | 'humorous' | 'formal' | 'casual' = 'dramatic'
  ): Promise<string> {
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not available, returning original text')
      return text
    }

    try {
      // Request parameters are used in the fetch call below

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(targetLanguage, context, tone)
            },
            {
              role: 'user',
              content: `Translate and culturally adapt this text: "${text}"`
            }
          ],
          max_tokens: 200,
          temperature: 0.8,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const translatedText = data.choices[0]?.message?.content?.trim()

      if (!translatedText) {
        throw new Error('No translation generated')
      }

      return translatedText
    } catch (error) {
      console.error('GPT translation failed:', error)
      return text // Fallback to original text
    }
  }

  private static getSystemPrompt(
    targetLanguage: string, 
    context: string, 
    tone: string
  ): string {
    const languageName = this.getLanguageName(targetLanguage)
    
    const basePrompt = `You are a master translator specializing in dramatic, humorous, and culturally-appropriate translations for the "Oops & Ask" app. Your translations must maintain the app's over-the-top, theatrical tone while being culturally relevant for ${languageName} speakers.

CRITICAL REQUIREMENTS:
- Maintain the dramatic, humorous, over-the-top tone of the original
- Use culturally appropriate references and humor for ${languageName} speakers
- Keep the theatrical flair that makes the app entertaining
- Ensure the translation feels natural and engaging in ${targetLanguage}
- Preserve any emojis, special characters, or formatting
- Make it sound like it was originally written in ${targetLanguage} by a native speaker`

    const contextPrompts: Record<string, string> = {
      oops: `This is for the "Oops" mode - dramatic apologies. Use theatrical language, fake historical references, and over-the-top expressions of regret that would make a Victorian drama queen proud.`,
      ask: `This is for the "Ask" mode - persuasive requests. Use flowery, romantic language, grand gestures, and manifesto-style requests that sound like they're from a romantic novel.`,
      attorney: `This is for the "Attorney" mode - fake legal language. Use absurd legal terminology, fake citations, and courtroom drama that sounds hilariously convincing but completely made-up.`,
      ui: `This is for UI elements - buttons, labels, instructions. Keep the playful, dramatic tone while being clear and user-friendly.`
    }

    const tonePrompts: Record<string, string> = {
      dramatic: `Use the most dramatic, theatrical language possible. Think Shakespeare meets a soap opera.`,
      humorous: `Make it funny and entertaining while maintaining the core meaning. Use wordplay and cultural humor.`,
      formal: `Keep it professional but still maintain the app's playful character.`,
      casual: `Make it conversational and friendly while keeping the dramatic flair.`
    }

    return `${basePrompt}

${contextPrompts[context] || contextPrompts.ui}

${tonePrompts[tone] || tonePrompts.dramatic}

RESPOND ONLY WITH THE TRANSLATED TEXT, NO EXPLANATIONS OR META-COMMENTARY.`
  }

  private static getLanguageName(languageCode: string): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'no': 'Norwegian',
      'da': 'Danish',
      'fi': 'Finnish',
      'pl': 'Polish',
      'tr': 'Turkish'
    }
    return languageNames[languageCode] || 'English'
  }

  // Batch translate multiple keys
  static async translateBatch(
    translations: Array<{ key: string; text: string; context?: string; tone?: string }>,
    targetLanguage: string
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {}
    
    // Process in parallel with rate limiting
    const batchSize = 5
    for (let i = 0; i < translations.length; i += batchSize) {
      const batch = translations.slice(i, i + batchSize)
      
      const promises = batch.map(async (translation) => {
        const translated = await this.translateText(
          translation.text,
          targetLanguage,
          (translation.context as 'oops' | 'ask' | 'attorney' | 'ui') || 'ui',
          (translation.tone as 'dramatic' | 'humorous' | 'formal' | 'casual') || 'dramatic'
        )
        return { key: translation.key, value: translated }
      })

      const batchResults = await Promise.all(promises)
      batchResults.forEach(({ key, value }) => {
        results[key] = value
      })

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < translations.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return results
  }
}
