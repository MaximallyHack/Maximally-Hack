import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'participant' | 'organizer' | 'judge';
  bio?: string;
  skills: string[];
  location?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  supabaseUser: SupabaseUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, userData: {
    username: string;
    full_name: string;
    role?: 'participant' | 'organizer' | 'judge';
  }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  switchTestRole: (role: 'participant' | 'organizer' | 'judge') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        const authUser: AuthUser = {
          id: profile.id,
          username: profile.username,
          name: profile.full_name || profile.username,
          email: profile.email || '',
          avatar: profile.avatar_url,
          role: profile.role || 'participant',
          bio: profile.bio,
          skills: profile.skills || [],
          location: profile.location,
          github: profile.github,
          linkedin: profile.linkedin,
          twitter: profile.twitter,
          website: profile.website
        };
        setUser(authUser);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    username: string;
    full_name: string;
    role?: 'participant' | 'organizer' | 'judge';
  }) => {
    try {
      console.log('Starting signup process for:', email, userData.username);
      
      // First check if username is already taken
      try {
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', userData.username)
          .single();

        console.log('Username check result:', { existingUser, checkError });

        // Only return error if username exists (404 error means username is available)
        if (existingUser && !checkError) {
          return { success: false, error: 'Username is already taken' };
        }
      } catch (checkErr) {
        // Username check failed, but we can continue - this might just mean the table doesn't exist yet
        console.log('Username check failed, continuing with signup:', checkErr);
      }

      // Sign up with Supabase Auth
      console.log('Calling supabase.auth.signUp...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.full_name,
            role: userData.role || 'participant'
          }
        }
      });

      console.log('Supabase auth signup result:', { data, error });

      if (error) {
        console.error('Supabase signup error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('User created, attempting to create profile...');
        
        // Try to create profile, but don't fail the whole signup if this fails
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              username: userData.username,
              full_name: userData.full_name,
              email: email,
              role: userData.role || 'participant',
              skills: [],
              badges: [],
              expertise: []
            });

          if (profileError) {
            console.error('Error creating profile (non-fatal):', profileError);
          } else {
            console.log('Profile created successfully');
          }
        } catch (profileErr) {
          console.error('Profile creation failed (non-fatal):', profileErr);
        }

        console.log('Signup completed successfully');
        return { success: true };
      }

      console.error('No user returned from signup');
      return { success: false, error: 'Failed to create user' };
    } catch (error: any) {
      console.error('Signup process failed:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Don't set global isLoading for signin - let the component handle its own loading state
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Don't set global isLoading for Google signin - let the component handle its own loading state
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    setIsLoading(false);
  };

  const switchTestRole = (role: 'participant' | 'organizer' | 'judge') => {
    if (user) {
      setUser(prev => prev ? { ...prev, role } : null);
      console.log(`🎭 Test Mode: Switched to ${role} role`);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return { success: false, error: 'User not logged in' };

    try {
      const profileUpdates = {
        username: updates.username,
        full_name: updates.name,
        avatar_url: updates.avatar,
        role: updates.role,
        bio: updates.bio,
        skills: updates.skills,
        location: updates.location,
        github: updates.github,
        linkedin: updates.linkedin,
        twitter: updates.twitter,
        website: updates.website
      };

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    supabaseUser,
    isLoggedIn: !!user,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    switchTestRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}

export function useSupabaseUser() {
  const { supabaseUser } = useAuth();
  return supabaseUser;
}

export function useUser() {
  const { user } = useAuth();
  return user;
}

// Legacy exports for backward compatibility
export const AuthProvider = SupabaseAuthProvider;
export const useSupabaseAuth = useAuth;
