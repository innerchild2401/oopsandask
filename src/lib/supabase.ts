import { createClient } from '@supabase/supabase-js'
import { UserSession, Persona, Relationship, GeneratedMessage, Language, LocalizedString, Donation, AnalyticsMetric } from '@/lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations
export const supabaseHelpers = {
  // Get or create user session
  async getOrCreateSession(sessionToken: string, userAgent?: string): Promise<UserSession | null> {
    const { data: existingSession }: { data: UserSession | null } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    if (existingSession) {
      // Update last active
      await supabase
        .from('user_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', existingSession.id)
      
      return existingSession
    }

    // Create new session
    const { data: newSession } = await supabase
      .from('user_sessions')
      .insert({
        session_token: sessionToken,
        user_agent: userAgent,
        country_code: 'US', // Will be enhanced with IP detection
      })
      .select()
      .single()

    return newSession
  },

  // Save generated message
  async saveGeneratedMessage(messageData: Partial<GeneratedMessage>): Promise<GeneratedMessage | null> {
    const { data, error } = await supabase
      .from('generated_messages')
      .insert(messageData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get localized strings for a language
  async getLocalizedStrings(languageCode: string): Promise<Record<string, string>> {
    const { data, error } = await supabase
      .from('localized_strings')
      .select('key, value')
      .eq('language_id', languageCode)

    if (error) throw error

    return data?.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>) || {}
  },

  // Get active languages
  async getActiveLanguages(): Promise<Language[]> {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get personas
  async getPersonas(): Promise<Persona[]> {
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get relationships
  async getRelationships(): Promise<Relationship[]> {
    const { data, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  },

  // Track donation
  async trackDonation(donationData: Partial<Donation>): Promise<Donation | null> {
    const { data, error } = await supabase
      .from('donations')
      .insert(donationData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get analytics data
  async getAnalytics(): Promise<AnalyticsMetric[]> {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30)

    if (error) throw error
    return data || []
  }
}