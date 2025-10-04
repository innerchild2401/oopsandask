// Temporary types for development - will be generated from Supabase schema later
export interface Database {
  public: {
    Tables: {
      languages: {
        Row: {
          id: string
          code: string
          name: string
          flag: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          flag: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          flag?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      localized_strings: {
        Row: {
          id: string
          language_id: string
          key: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          language_id: string
          key: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          language_id?: string
          key?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_sessions: {
        Row: {
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
        Insert: {
          id?: string
          session_token: string
          weapon_fingerprint?: string | null
          ip_address?: string | null
          country_code?: string | null
          language?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
        }
        Update: {
          id?: string
          session_token?: string
          device_fingerprint?: string | null
          ip_address?: string | null
          country_code?: string | null
          language?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
        }
      }
      personas: {
        Row: {
          id: string
          name: string
          description: string
          system_prompt: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          system_prompt: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          system_prompt?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      relationships: {
        Row: {
          id: string
          name: string
          description: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      generated_messages: {
        Row: {
          id: string
          session_id: string
          mode: string
          persona_id: string
          relationship_id: string
          user_input: string
          ai_response: string
          language: string
          country: string
          tokens_used?: number | null
          response_time_ms?: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          mode: string
          persona_id: string
          relationship_id: string
          user_input: string
          ai_response: string
          language: string
          country: string
          tokens_used?: number | null
          response_time_ms?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          mode?: string
          persona_id?: string
          relationship_id?: string
          user_input?: string
          ai_response?: string
          language?: string
          country?: string
          tokens_used?: number | null
          response_time_ms?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}