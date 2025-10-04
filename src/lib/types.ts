// Database types for Supabase integration
export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  country_codes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  session_token: string;
  device_fingerprint?: string;
  ip_address?: string;
  user_agent?: string;
  country_code?: string;
  preferred_language_id?: string;
  timezone?: string;
  first_session_at: string;
  last_active_at: string;
  is_active: boolean;
  total_generations: number;
  created_at: string;
  updated_at: string;
}

export interface Persona {
  id: string;
  name: string;
  description?: string;
  personality_traits?: string[];
  example_inputs?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Relationship {
  id: string;
  name: string;
  description?: string;
  formality_level?: number;
  context_hints?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneratedMessage {
  id: string;
  session_id?: string;
  mode: 'oops' | 'ask' | 'attorney_ask';
  persona_id?: string;
  relationship_id?: string;
  language_id: string;
  original_text: string;
  ai_generated_text: string;
  ai_model?: string;
  tokens_used?: number;
  processing_time_ms?: number;
  context_metadata?: Record<string, any>;
  user_feedback?: number;
  is_shared: boolean;
  created_at: string;
}

export interface LocalizedString {
  id: string;
  key: string;
  language_id: string;
  value: string;
  context?: string;
  created_at: string;
  updated_at: string;
}

// UI Component interfaces
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

// Application state interfaces
export interface AppState {
  currentLanguage: LanguageOption;
  isLoading: boolean;
  error?: string;
  userSession?: UserSession;
}

// API request/response interfaces
export interface GenerateMessageRequest {
  mode: 'oops' | 'ask' | 'attorney_ask';
  originalText: string;
  persona?: string;
  relationship?: string;
  language: string;
  sessionId?: string;
}

export interface GenerateMessageResponse {
  id: string;
  generatedText: string;
  tokensUsed: number;
  processingTimeMs: number;
  persona?: Persona;
  relationship?: Relationship;
}

// Form interfaces
export interface MessageFormData {
  originalText: string;
  persona?: string;
  relationship?: string;
  mode: 'oops' | 'ask' | 'attorney_ask';
}

// Navigation interfaces
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Error interfaces
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Donation interfaces
export interface DonationInfo {
  url: string;
  isEnabled: boolean;
}
