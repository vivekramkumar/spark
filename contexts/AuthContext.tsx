import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  connectionError: boolean;
  signUp: (email: string, password: string, userData: { name: string; age: number }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  retryConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    initializeAuth();

    return () => {
      mounted.current = false;
    };
  }, []);

  const initializeAuth = async () => {
    try {
      // Test Supabase connection first
      const isConnected = await testSupabaseConnection();
      if (!mounted.current) return;

      if (!isConnected) {
        if (mounted.current) {
          setConnectionError(true);
          setLoading(false);
        }
        return;
      }

      if (mounted.current) {
        setConnectionError(false);
      }

      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!mounted.current) return;

      if (error) {
        console.error('Error getting session:', error);
        if (mounted.current) {
          setLoading(false);
        }
        return;
      }

      if (mounted.current) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        if (mounted.current) {
          setLoading(false);
        }
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          if (!mounted.current) return;

          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            if (mounted.current) {
              setProfile(null);
              setLoading(false);
            }
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error initializing auth:', error);
      if (mounted.current) {
        setConnectionError(true);
        setLoading(false);
      }
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!mounted.current) return;

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        if (mounted.current) {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; age: number }) => {
    try {
      if (mounted.current) {
        setLoading(true);
      }
      
      // Sign up the user with email confirmation disabled for development
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Skip email confirmation in development
          emailRedirectTo: undefined,
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        // User created but needs email confirmation
        return { 
          error: { 
            message: 'Please check your email and click the confirmation link to complete registration.',
            code: 'email_confirmation_required'
          } 
        };
      }

      // If we have both user and session, proceed with profile creation
      if (data.user && data.session) {
        // Set the session immediately so RLS policies work
        if (mounted.current) {
          setSession(data.session);
          setUser(data.user);
        }

        // Create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name: userData.name,
            age: userData.age,
            bio: '',
            location: '',
            photos: [],
            interests: [],
            level: 1,
            xp: 0,
            games_won: 0,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return { error: profileError };
        }

        // Fetch the created profile
        await fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      console.error('Signup catch error:', error);
      return { error };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (mounted.current) {
        setLoading(true);
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (!error && profile && mounted.current) {
      setProfile({ ...profile, ...updates });
    }

    return { error };
  };

  const retryConnection = async () => {
    if (mounted.current) {
      setLoading(true);
      setConnectionError(false);
    }
    await initializeAuth();
  };

  const value = {
    session,
    user,
    profile,
    loading,
    connectionError,
    signUp,
    signIn,
    signOut,
    updateProfile,
    retryConnection,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}