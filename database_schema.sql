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

-- Conversations table for UUID-based message sharing
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_text TEXT NOT NULL,
    generated_text TEXT NOT NULL,
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('oops', 'ask', 'ask_attorney')),
    recipient_name VARCHAR(100),
    recipient_relationship VARCHAR(50),
    language VARCHAR(10) NOT NULL,
    reply_voice VARCHAR(20) DEFAULT 'dramatic' CHECK (reply_voice IN ('dramatic', 'legal')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for fast lookups
CREATE INDEX idx_conversations_id ON conversations(id);
CREATE INDEX idx_conversations_expires_at ON conversations(expires_at);

-- Comments
COMMENT ON TABLE conversations IS 'Stores conversation data for UUID-based sharing';
COMMENT ON COLUMN conversations.id IS 'UUID for sharing - short, clean links';
COMMENT ON COLUMN conversations.original_text IS 'User input text';
COMMENT ON COLUMN conversations.generated_text IS 'AI generated response';
COMMENT ON COLUMN conversations.mode IS 'Message type: oops, ask, or ask_attorney';
COMMENT ON COLUMN conversations.recipient_name IS 'Name of the person the message is for';
COMMENT ON COLUMN conversations.recipient_relationship IS 'Relationship to recipient';
COMMENT ON COLUMN conversations.language IS 'Language code for the conversation';
COMMENT ON COLUMN conversations.reply_voice IS 'Voice for replies: dramatic or legal';
COMMENT ON COLUMN conversations.expires_at IS 'Auto-cleanup after 30 days';
COMMENT ON COLUMN conversations.is_active IS 'Soft delete flag';

-- =================================================================
-- ANALYTICS TABLES FOR ADMIN DASHBOARD
-- =================================================================

-- Analytics tables for theboss dashboard
CREATE TABLE IF NOT EXISTS analytics_generations (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  language_code TEXT NOT NULL,
  country_code TEXT,
  tokens_used INTEGER DEFAULT 0,
  cost_estimate DECIMAL(10,6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_users (
  user_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  country_code TEXT,
  total_generations INTEGER DEFAULT 1,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_api_calls (
  id SERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_estimate DECIMAL(10,6) DEFAULT 0,
  response_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_donations (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to track generation
CREATE OR REPLACE FUNCTION track_generation(
  p_user_id TEXT,
  p_session_id TEXT,
  p_mode TEXT,
  p_language_code TEXT,
  p_country_code TEXT DEFAULT NULL,
  p_tokens_used INTEGER DEFAULT 0,
  p_cost_estimate DECIMAL DEFAULT 0
) RETURNS VOID AS $$
BEGIN
  -- Insert generation record
  INSERT INTO analytics_generations (
    user_id, session_id, mode, language_code, country_code, 
    tokens_used, cost_estimate
  ) VALUES (
    p_user_id, p_session_id, p_mode, p_language_code, p_country_code,
    p_tokens_used, p_cost_estimate
  );
  
  -- Update or insert user record using UPSERT logic
  INSERT INTO analytics_users (
    user_id, session_id, country_code, total_generations
  ) VALUES (
    p_user_id, p_session_id, p_country_code, 1
  );
  
  -- If the insert failed due to unique constraint, update instead
  EXCEPTION WHEN unique_violation THEN
    UPDATE analytics_users 
    SET 
      last_seen = NOW(),
      total_generations = total_generations + 1,
      country_code = COALESCE(p_country_code, country_code)
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to track API calls
CREATE OR REPLACE FUNCTION track_api_call(
  p_endpoint TEXT,
  p_user_id TEXT,
  p_session_id TEXT,
  p_tokens_used INTEGER DEFAULT 0,
  p_cost_estimate DECIMAL DEFAULT 0,
  p_response_time_ms INTEGER DEFAULT 0
) RETURNS VOID AS $$
BEGIN
  INSERT INTO analytics_api_calls (
    endpoint, user_id, session_id, tokens_used, cost_estimate, response_time_ms
  ) VALUES (
    p_endpoint, p_user_id, p_session_id, p_tokens_used, p_cost_estimate, p_response_time_ms
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to track donations
CREATE OR REPLACE FUNCTION track_donation(
  p_user_id TEXT,
  p_session_id TEXT,
  p_amount DECIMAL,
  p_currency TEXT DEFAULT 'USD',
  p_payment_method TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO analytics_donations (
    user_id, session_id, amount, currency, payment_method
  ) VALUES (
    p_user_id, p_session_id, p_amount, p_currency, p_payment_method
  );
END;
$$ LANGUAGE plpgsql;

-- Create analytics dashboard view
CREATE OR REPLACE VIEW analytics_dashboard AS
SELECT 
  (SELECT COUNT(DISTINCT user_id) FROM analytics_users) as total_users,
  (SELECT COUNT(*) FROM analytics_generations) as total_generations,
  (SELECT COUNT(*) FROM analytics_api_calls) as total_api_calls,
  (SELECT COALESCE(SUM(tokens_used), 0) FROM analytics_api_calls) as total_tokens,
  (SELECT COALESCE(SUM(cost_estimate), 0) FROM analytics_api_calls) as total_cost,
  (SELECT COUNT(DISTINCT user_id) FROM analytics_donations) as total_donors,
  (SELECT COALESCE(SUM(amount), 0) FROM analytics_donations) as total_donations,
  (SELECT COUNT(*) FROM analytics_generations WHERE created_at >= NOW() - INTERVAL '24 hours') as generations_today,
  (SELECT COUNT(*) FROM analytics_generations WHERE created_at >= NOW() - INTERVAL '7 days') as generations_this_week,
  (SELECT COUNT(*) FROM analytics_generations WHERE created_at >= NOW() - INTERVAL '30 days') as generations_this_month;

-- Create theboss user for admin access
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'theboss') THEN
    CREATE ROLE theboss;
  END IF;
END
$$;

-- Grant permissions for theboss user
GRANT ALL ON analytics_generations TO theboss;
GRANT ALL ON analytics_users TO theboss;
GRANT ALL ON analytics_api_calls TO theboss;
GRANT ALL ON analytics_donations TO theboss;
GRANT EXECUTE ON FUNCTION track_generation TO theboss;
GRANT EXECUTE ON FUNCTION track_api_call TO theboss;
GRANT EXECUTE ON FUNCTION track_donation TO theboss;
GRANT SELECT ON analytics_dashboard TO theboss;