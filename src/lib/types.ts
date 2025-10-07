// Core types for the Oops & Ask application

export interface Language {
  id: string
  code: string
  name: string
  flag: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LocalizedString {
  id: string
  language_id: string
  key: string
  value: string
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  session_token: string
  device_fingerprint: string | null
  ip_address: string | null
  country_code: string | null
  language: string | null
  user_agent: string | null
  created_at: string
  updated_at: string
  last_active_at: string
}

export interface Persona {
  id: string
  name: string
  description: string
  system_prompt: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Relationship {
  id: string
  name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GeneratedMessage {
  id: string
  session_id: string
  mode: 'oops' | 'ask' | 'ask_attorney'
  persona_id: string
  relationship_id: string
  user_input: string
  ai_response: string
  language_detected: string
  country: string
  tokens_used?: number | null
  response_time_ms?: number | null
  created_at: string
  updated_at: string
}

export interface PromptTemplate {
  id: string
  mode: 'oops' | 'ask' | 'ask_attorney'
  persona_id?: string
  relationship_id?: string
  language_id?: string
  template: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  session_id: string
  donation_type: 'prompt_count' | 'actual_donation'
  amount_cents: number
  currency: string
  platform: string
  transaction_id?: string | null
  donor_email?: string | null
  anonymous: boolean
  created_at: string
}

export interface AnalyticsMetric {
  id: string
  metric_type: 'daily_generations' | 'language_detection' | 'mode_usage' | 'donation_tracking'
  value_json: Record<string, unknown>
  date: string
  created_at: string
}

export type GenerateMessageRequestMode = 'oops' | 'ask' | 'ask_attorney'

export interface GenerateMessageRequest {
  originalText: string
  mode: GenerateMessageRequestMode
  persona?: string
  relationship?: string
  recipientName?: string
  recipientRelationship?: string
  userId?: string
  sessionId?: string
  language?: string
  replyMode?: boolean
  replyContext?: string
  replyVoice?: 'dramatic' | 'legal'
  countryCode?: string
  // Conversation context for better replies
  originalSenderName?: string
  originalSenderRelationship?: string
  conversationId?: string
}

export interface GenerateMessageResponse {
  id: string
  generatedText: string
  tokensUsed: number
  processingTimeMs: number
  success?: boolean
  error?: string
  mode?: GenerateMessageRequestMode
  language?: string
  sessionId?: string
}

export interface LanguageOption {
  code: string
  name: string
  nativeName: string
  flag: string
}

export interface NavItem {
  title: string
  href: string
  icon?: string
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}