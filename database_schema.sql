-- =================================================================
-- OOPS & ASK - AI-POWERED WEB APP DATABASE SCHEMA
-- =================================================================
-- Schema designed for:
-- - Multi-language localization with caching
-- - AI-powered message generation (Oops/Ask modes)
-- - User session tracking without explicit signups
-- - Donation/subscription features
-- - Scalable structure for future features

-- =================================================================
-- 1. LANGUAGES & LOCALIZATION
-- =================================================================

-- Supported languages in the app
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(5) NOT NULL UNIQUE, -- ISO 639-1 codes like 'en', 'es', 'fr', 'ja'
  name VARCHAR(100) NOT NULL, -- Human readable name like 'English', 'Spanish'
  native_name VARCHAR(100) NOT NULL, -- Native name like 'English', 'Español', '日本語'
  country_codes TEXT[] NOT NULL, -- Array of applicable country codes like ['US', 'GB', 'AU']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Localized UI strings cache
CREATE TABLE localized_strings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL, -- UI element key like 'welcome_title', 'button_submit'
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  context VARCHAR(500), -- Optional context about where/how this string is used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(key, language_id)
);

-- Country-specific language preferences
CREATE TABLE country_language_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2 codes like 'US', 'MX', 'JP'
  country_name VARCHAR(100) NOT NULL,
  primary_language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  supported_language_ids UUID[] NOT NULL DEFAULT '{}', -- Array of supported language IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country_code)
);

-- =================================================================
-- 2. USER SESSIONS & DEVICE TRACKING
-- =================================================================

-- User sessions (device-based, no explicit signup required)
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) NOT NULL UNIQUE, -- Generated session identifier
  device_fingerprint VARCHAR(255), -- Browser/device fingerprint for analytics
  ip_address INET,
  user_agent TEXT,
  country_code VARCHAR(2), -- Detected from IP
  preferred_language_id UUID REFERENCES languages(id),
  timezone VARCHAR(100),
  first_session_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  total_generations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- 3. AI MESSAGE GENERATION
-- =================================================================

-- Personas/Characters for AI generation
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- 'Dramatic', 'Professional', 'Casual', 'Flirty'
  description TEXT,
  personality_traits TEXT[], -- Array of traits
  example_inputs TEXT[], -- Example input texts that work well with this persona
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relationship types for AI context
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- 'Spouse', 'Boss', 'Friend', 'Parent', 'Colleague'
  description TEXT,
  formality_level INTEGER CHECK (formality_level >= 1 AND formality_level <= 5), -- 1=casual, 5=very formal
  context_hints TEXT[], -- Array of context hints for AI
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated messages (Oops/Ask modes)
CREATE TABLE generated_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('oops', 'ask', 'attorney_ask')),
  persona_id UUID REFERENCES personas(id),
  relationship_id UUID REFERENCES relationships(id),
  language_id UUID REFERENCES languages(id) NOT NULL,
  original_text TEXT NOT NULL,
  ai_generated_text TEXT NOT NULL,
  ai_model VARCHAR(50) DEFAULT 'gpt-4', -- Track which AI model was used
  tokens_used INTEGER, -- Cost tracking
  processing_time_ms INTEGER, -- Performance tracking
  context_metadata JSONB, -- Store additional context like tone, urgency level
  user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5), -- Optional rating
  is_shared BOOLEAN DEFAULT false, -- Whether user shared this generation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cached prompt templates for different modes/languages
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('oops', 'ask', 'attorney_ask')),
  language_id UUID REFERENCES languages(id) NOT NULL,
  persona_id UUID REFERENCES personas(id),
  template TEXT NOT NULL,
  variables TEXT[], -- List of template variables like ['{original_text}', '{relationship}', '{persona}']
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mode, language_id, persona_id)
);

-- =================================================================
-- 4. DONATION & SUBSCRIPTION FEATURES
-- =================================================================

-- Donation tracking
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  donation_type VARCHAR(50) NOT NULL, -- 'buy_me_a_coffee', 'stripe_one_time', 'stripe_monthly'
  platform VARCHAR(50) NOT NULL, -- 'buymeacoffee', 'stripe', 'other'
  external_donation_id VARCHAR(255), -- External platform's transaction ID
  amount_cents INTEGER NOT NULL, -- Amount in cents for currency consistency
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  expires_at TIMESTAMP WITH TIME ZONE, -- For subscription donations
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB -- Store additional platform-specific data
);

-- Usage limits tracking
CREATE TABLE usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  daily_generations_count INTEGER DEFAULT 0,
  daily_limit INTEGER DEFAULT 10, -- Default free tier limit
  weekly_generations_count INTEGER DEFAULT 0,
  weekly_limit INTEGER DEFAULT 100,
  monthly_generations_count INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 500,
  reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, reset_date)
);

-- =================================================================
-- 5. ANALYTICS & REPORTING
-- =================================================================

-- Generation analytics
CREATE TABLE generation_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  message_id UUID REFERENCES generated_messages(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL, -- 'generation_started', 'generation_completed', 'user_rated', 'user_shared'
  event_data JSONB, -- Additional event-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App performance metrics
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  metric_name VARCHAR(100) NOT NULL, -- 'page_load_time', 'api_response_time', 'ai_generation_time'
  metric_value DECIMAL(10,3) NOT NULL,
  unit VARCHAR(20) DEFAULT 'ms', -- Time unit: ms, seconds, etc.
  context JSONB, -- Additional context about the metric
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- 6. SYSTEM CONFIGURATION
-- =================================================================

-- App configuration settings
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Whether this setting can be exposed to clients
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- 7. INDEXES FOR PERFORMANCE
-- =================================================================

-- Foreign key indexes
CREATE INDEX idx_localized_strings_language_id ON localized_strings(language_id);
CREATE INDEX idx_localized_strings_key ON localized_strings(key);
CREATE INDEX idx_user_sessions_language_id ON user_sessions(preferred_language_id);
CREATE INDEX idx_user_sessions_country_code ON user_sessions(country_code);
CREATE INDEX idx_user_sessions_last_active ON user_sessions(last_active_at);
CREATE INDEX idx_generated_messages_session_id ON generated_messages(session_id);
CREATE INDEX idx_generated_messages_mode ON generated_messages(mode);
CREATE INDEX idx_generated_messages_created_at ON generated_messages(created_at);
CREATE INDEX idx_generated_messages_language_id ON generated_messages(language_id);
CREATE INDEX idx_donations_session_id ON donations(session_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_usage_limits_session_id ON usage_limits(session_id);
CREATE INDEX idx_usage_limits_reset_date ON usage_limits(reset_date);
CREATE INDEX idx_generation_analytics_session_id ON generation_analytics(session_id);
CREATE INDEX idx_generation_analytics_event_type ON generation_analytics(event_type);
CREATE INDEX idx_generation_analytics_created_at ON generation_analytics(created_at);
CREATE INDEX idx_performance_metrics_session_id ON performance_metrics(session_id);
CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);

-- Composite indexes for common queries
CREATE INDEX idx_generated_messages_session_mode_language ON generated_messages(session_id, mode, language_id);
CREATE INDEX idx_localized_strings_key_language ON localized_strings(key, language_id);
CREATE INDEX idx_country_language_mappings_country ON country_language_mappings(country_code);
CREATE INDEX idx_prompt_templates_mode_language_persona ON prompt_templates(mode, language_id, persona_id);

-- =================================================================
-- 8. UPDATED_AT TRIGGERS
-- =================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_languages_updated_at BEFORE UPDATE ON languages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_localized_strings_updated_at BEFORE UPDATE ON localized_strings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_country_language_mappings_updated_at BEFORE UPDATE ON country_language_mappings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_relationships_updated_at BEFORE UPDATE ON relationships FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_prompt_templates_updated_at BEFORE UPDATE ON prompt_templates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_usage_limits_updated_at BEFORE UPDATE ON usage_limits FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =================================================================
-- 9. COMMENTS FOR DOCUMENTATION
-- =================================================================

-- Table comments
COMMENT ON TABLE languages IS 'Supported languages with ISO codes and country mappings';
COMMENT ON TABLE localized_strings IS 'Cached UI strings per language for performance';
COMMENT ON TABLE country_language_mappings IS 'Default language preferences by country';
COMMENT ON TABLE user_sessions IS 'Device-based user sessions without explicit signup';
COMMENT ON TABLE personas IS 'AI personas/characters for message generation';
COMMENT ON TABLE relationships IS 'Relationship types for AI context';
COMMENT ON TABLE generated_messages IS 'All AI-generated Oops/Ask messages';
COMMENT ON TABLE prompt_templates IS 'Cached AI prompt templates by mode/language/persona';
COMMENT ON TABLE donations IS 'All donations/subscriptions from users';
COMMENT ON TABLE usage_limits IS 'Daily/weekly/monthly generation limits per session';
COMMENT ON TABLE generation_analytics IS 'Event tracking for AI generation analytics';
COMMENT ON TABLE performance_metrics IS 'App performance and timing metrics';
COMMENT ON TABLE app_settings IS 'Application configuration settings';

-- Column comments for key fields
COMMENT ON COLUMN languages.country_codes IS 'Array of applicable country codes for this language';
COMMENT ON COLUMN localized_strings.key IS 'UI element identifier for internationalization';
COMMENT ON COLUMN user_sessions.device_fingerprint IS 'Browser fingerprint for anonymous user tracking';
COMMENT ON COLUMN generated_messages.mode IS 'Message type: oops, ask, or attorney_ask';
COMMENT ON COLUMN donations.amount_cents IS 'Donation amount in cents for currency precision';
COMMENT ON COLUMN usage_limits.reset_date IS 'Date when limits reset for this session';
