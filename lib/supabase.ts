import { Database } from '@/types/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if we're running in a local development environment
const isLocalDev = __DEV__ && (
  supabaseUrl.includes('localhost') || 
  supabaseUrl.includes('127.0.0.1')
);

// Only log in development to avoid bundler issues
if (__DEV__) {
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
    console.log('\n🔄 For local development:');
    console.log('   EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321');
    console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');
  }

  // Validate URL format
  if (supabaseUrl && !supabaseUrl.includes('supabase.co') && !isLocalDev) {
    console.error('❌ Invalid Supabase URL format. Should be: https://your-project-id.supabase.co');
  }
  
  if (isLocalDev) {
    console.log('🔧 Using local Supabase instance at:', supabaseUrl);
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: AsyncStorage,
    // Disable email confirmation for development
    flowType: 'pkce',
  },
  // Adjust options for local development
  ...(isLocalDev ? {
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  } : {}),
});

// Enhanced connection test with detailed error reporting
export const testSupabaseConnection = async () => {
  try {
    if (__DEV__) {
      console.log('🔄 Testing Supabase connection...');
      console.log('📍 URL:', supabaseUrl);
      console.log('🔑 Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Missing');
      if (isLocalDev) {
        console.log('🔧 Environment: Local Development');
      } else {
        console.log('🔧 Environment: Production/Remote');
      }
    }

    // First test: Basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      if (__DEV__) {
        console.error('❌ Supabase connection error:', error);
        
        // Provide specific error guidance
        if (error.message.includes('relation "profiles" does not exist')) {
          console.log('💡 Solution: Run the database migration in your Supabase dashboard');
          console.log('   1. Go to SQL Editor in Supabase');
          console.log('   2. Copy the migration SQL from supabase/migrations/');
          console.log('   3. Paste and run it');
          
          if (isLocalDev) {
            console.log('   For local development:');
            console.log('   1. Run: supabase db reset');
            console.log('   2. Or manually run the migration from: supabase/migrations/');
          }
        } else if (error.message.includes('Invalid API key')) {
          console.log('💡 Solution: Check your EXPO_PUBLIC_SUPABASE_ANON_KEY');
          if (isLocalDev) {
            console.log('   For local development, make sure Supabase is running:');
            console.log('   Run: supabase start');
          }
        } else if (error.message.includes('Project not found')) {
          console.log('💡 Solution: Verify your EXPO_PUBLIC_SUPABASE_URL');
          console.log('   Make sure your Supabase project is fully set up (can take 2-3 minutes)');
          if (isLocalDev) {
            console.log('   For local development, make sure Supabase is running:');
            console.log('   Run: supabase start');
          }
        }
      }
      
      return false;
    }
    
    if (__DEV__) {
      console.log('✅ Supabase connection successful');
    }
    return true;
  } catch (error: any) {
    if (__DEV__) {
      console.error('❌ Supabase connection failed:', error);
      
      if (error.message?.includes('fetch')) {
        console.log('💡 This might be a network issue or the project is still setting up');
        if (isLocalDev) {
          console.log('   For local development:');
          console.log('   1. Make sure Supabase is running with: supabase start');
          console.log('   2. Check if you can access Supabase Studio at: http://localhost:54323');
        } else {
          console.log('   Wait a few minutes and try again');
        }
      }
    }
    
    return false;
  }
};

// Helper function to check if environment is properly configured
export const checkEnvironmentSetup = () => {
  const issues = [];
  
  if (!supabaseUrl) {
    issues.push('EXPO_PUBLIC_SUPABASE_URL is missing');
  } else if (!supabaseUrl.includes('supabase.co') && !isLocalDev) {
    issues.push('EXPO_PUBLIC_SUPABASE_URL format is invalid');
  }
  
  if (!supabaseAnonKey) {
    issues.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is missing');
  } else if (supabaseAnonKey.length < 100 && !isLocalDev) {
    issues.push('EXPO_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isLocalDev
  };
};