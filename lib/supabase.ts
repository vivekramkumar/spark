import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Enhanced validation with detailed logging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('📋 Current environment variables:');
  console.log('   EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.log('\n🔧 To fix this:');
  console.log('1. Create a .env file in your project root');
  console.log('2. Add your Supabase credentials:');
  console.log('   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here');
}

// Validate URL format
if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
  console.error('❌ Invalid Supabase URL format. Should be: https://your-project-id.supabase.co');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Enhanced connection test with detailed error reporting
export const testSupabaseConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    console.log('📍 URL:', supabaseUrl);
    console.log('🔑 Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Missing');

    // First test: Basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
      
      // Provide specific error guidance
      if (error.message.includes('relation "profiles" does not exist')) {
        console.log('💡 Solution: Run the database migration in your Supabase dashboard');
        console.log('   1. Go to SQL Editor in Supabase');
        console.log('   2. Copy the migration SQL from supabase/migrations/');
        console.log('   3. Paste and run it');
      } else if (error.message.includes('Invalid API key')) {
        console.log('💡 Solution: Check your EXPO_PUBLIC_SUPABASE_ANON_KEY');
      } else if (error.message.includes('Project not found')) {
        console.log('💡 Solution: Verify your EXPO_PUBLIC_SUPABASE_URL');
        console.log('   Make sure your Supabase project is fully set up (can take 2-3 minutes)');
      }
      
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error: any) {
    console.error('❌ Supabase connection failed:', error);
    
    if (error.message?.includes('fetch')) {
      console.log('💡 This might be a network issue or the project is still setting up');
      console.log('   Wait a few minutes and try again');
    }
    
    return false;
  }
};

// Helper function to check if environment is properly configured
export const checkEnvironmentSetup = () => {
  const issues = [];
  
  if (!supabaseUrl) {
    issues.push('EXPO_PUBLIC_SUPABASE_URL is missing');
  } else if (!supabaseUrl.includes('supabase.co')) {
    issues.push('EXPO_PUBLIC_SUPABASE_URL format is invalid');
  }
  
  if (!supabaseAnonKey) {
    issues.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is missing');
  } else if (supabaseAnonKey.length < 100) {
    issues.push('EXPO_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey
  };
};