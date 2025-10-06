-- Database schema updates for theboss dashboard analytics
-- Run this in Supabase SQL Editor

-- Create analytics tables for tracking usage
CREATE TABLE IF NOT EXISTS analytics_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  session_id TEXT,
  mode TEXT NOT NULL, -- 'oops', 'ask', 'ask_attorney'
  language_code TEXT NOT NULL,
  country_code TEXT,
  tokens_used INTEGER DEFAULT 0,
  cost_estimate DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_users table for user tracking
CREATE TABLE IF NOT EXISTS analytics_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE,
  session_id TEXT,
  country_code TEXT,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_generations INTEGER DEFAULT 0,
  is_donor BOOLEAN DEFAULT FALSE,
  donation_amount DECIMAL(10, 2) DEFAULT 0
);

-- Create analytics_api_calls table for API tracking
CREATE TABLE IF NOT EXISTS analytics_api_calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT,
  tokens_used INTEGER DEFAULT 0,
  cost_estimate DECIMAL(10, 6) DEFAULT 0,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_donations table for donation tracking
CREATE TABLE IF NOT EXISTS analytics_donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  session_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create theboss user with hardcoded credentials
-- This will create a user in Supabase Auth
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'afilip.mme@gmail.com',
  crypt('shoricica01', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create theboss profile
INSERT INTO public.profiles (
  id,
  username,
  full_name,
  avatar_url,
  website,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'afilip.mme@gmail.com'),
  'theboss',
  'The Boss',
  '',
  '',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_generations_created_at ON analytics_generations(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_generations_mode ON analytics_generations(mode);
CREATE INDEX IF NOT EXISTS idx_analytics_generations_country ON analytics_generations(country_code);
CREATE INDEX IF NOT EXISTS idx_analytics_generations_language ON analytics_generations(language_code);

CREATE INDEX IF NOT EXISTS idx_analytics_users_country ON analytics_users(country_code);
CREATE INDEX IF NOT EXISTS idx_analytics_users_first_seen ON analytics_users(first_seen);
CREATE INDEX IF NOT EXISTS idx_analytics_users_is_donor ON analytics_users(is_donor);

CREATE INDEX IF NOT EXISTS idx_analytics_api_calls_created_at ON analytics_api_calls(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_api_calls_endpoint ON analytics_api_calls(endpoint);

CREATE INDEX IF NOT EXISTS idx_analytics_donations_created_at ON analytics_donations(created_at);

-- Create RLS policies for theboss access
ALTER TABLE analytics_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_api_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_donations ENABLE ROW LEVEL SECURITY;

-- Policy for theboss to access all analytics data
CREATE POLICY "theboss_full_access" ON analytics_generations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'afilip.mme@gmail.com'
    )
  );

CREATE POLICY "theboss_full_access" ON analytics_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'afilip.mme@gmail.com'
    )
  );

CREATE POLICY "theboss_full_access" ON analytics_api_calls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'afilip.mme@gmail.com'
    )
  );

CREATE POLICY "theboss_full_access" ON analytics_donations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'afilip.mme@gmail.com'
    )
  );

-- Grant necessary permissions
GRANT ALL ON analytics_generations TO authenticated;
GRANT ALL ON analytics_users TO authenticated;
GRANT ALL ON analytics_api_calls TO authenticated;
GRANT ALL ON analytics_donations TO authenticated;

-- Create views for easier analytics queries
CREATE OR REPLACE VIEW analytics_dashboard AS
SELECT 
  -- Total users
  (SELECT COUNT(*) FROM analytics_users) as total_users,
  
  -- Users by country
  (SELECT json_agg(json_build_object('country', country_code, 'count', count))
   FROM (SELECT country_code, COUNT(*) as count FROM analytics_users GROUP BY country_code) t) as users_by_country,
  
  -- Total generations
  (SELECT COUNT(*) FROM analytics_generations) as total_generations,
  
  -- Generations by country
  (SELECT json_agg(json_build_object('country', country_code, 'count', count))
   FROM (SELECT country_code, COUNT(*) as count FROM analytics_generations GROUP BY country_code) t) as generations_by_country,
  
  -- Generations by mode
  (SELECT json_agg(json_build_object('mode', mode, 'count', count))
   FROM (SELECT mode, COUNT(*) as count FROM analytics_generations GROUP BY mode) t) as generations_by_mode,
  
  -- Total API calls
  (SELECT COUNT(*) FROM analytics_api_calls) as total_api_calls,
  
  -- Total tokens consumed
  (SELECT COALESCE(SUM(tokens_used), 0) FROM analytics_api_calls) as total_tokens,
  
  -- Total cost estimate
  (SELECT COALESCE(SUM(cost_estimate), 0) FROM analytics_api_calls) as total_cost,
  
  -- Number of donors
  (SELECT COUNT(*) FROM analytics_users WHERE is_donor = true) as total_donors,
  
  -- Total donation amount
  (SELECT COALESCE(SUM(amount), 0) FROM analytics_donations) as total_donations;

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
  
  -- Update or insert user record
  INSERT INTO analytics_users (
    user_id, session_id, country_code, total_generations
  ) VALUES (
    p_user_id, p_session_id, p_country_code, 1
  ) ON CONFLICT (user_id) DO UPDATE SET
    last_seen = NOW(),
    total_generations = analytics_users.total_generations + 1,
    country_code = COALESCE(p_country_code, analytics_users.country_code);
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
  -- Insert donation record
  INSERT INTO analytics_donations (
    user_id, session_id, amount, currency, payment_method
  ) VALUES (
    p_user_id, p_session_id, p_amount, p_currency, p_payment_method
  );
  
  -- Update user as donor
  UPDATE analytics_users 
  SET is_donor = true, donation_amount = COALESCE(donation_amount, 0) + p_amount
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
