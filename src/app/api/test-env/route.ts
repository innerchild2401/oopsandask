import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envVars = {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
      buyMeACoffeeUrl: process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL,
    };

    // Test Supabase connection
    let supabaseStatus = '❌ Not tested';
    if (envVars.supabaseUrl && envVars.supabaseAnonKey) {
      try {
        const response = await fetch(`${envVars.supabaseUrl}/rest/v1/`, {
          headers: {
            'apikey': envVars.supabaseAnonKey,
            'Authorization': `Bearer ${envVars.supabaseAnonKey}`,
          },
        });
        supabaseStatus = response.ok ? '✅ Connected' : '❌ Connection failed';
      } catch {
        supabaseStatus = '❌ Connection error';
      }
    }

    // Test OpenAI key format (don't make actual API call to avoid charges)
    let openaiStatus = '❌ Not tested';
    if (envVars.openaiApiKey) {
      openaiStatus = envVars.openaiApiKey.startsWith('sk-') ? '✅ Valid format' : '❌ Invalid format';
    }

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environmentVariables: {
        SUPABASE_URL: envVars.supabaseUrl ? '✅ Present' : '❌ Missing',
        SUPABASE_ANON_KEY: envVars.supabaseAnonKey ? '✅ Present' : '❌ Missing',
        OPENAI_API_KEY: envVars.openaiApiKey ? '✅ Present' : '❌ Missing',
        NEXT_PUBLIC_BUYMEACOFFEE_URL: envVars.buyMeACoffeeUrl ? '✅ Present' : '❌ Missing',
      },
      serviceStatuses: {
        supabase: supabaseStatus,
        openai: openaiStatus,
        buyMeACoffee: envVars.buyMeACoffeeUrl ? '✅ URL present' : '❌ URL missing',
      },
      note: 'Environment variables are loaded and accessible!'
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test environment variables',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
