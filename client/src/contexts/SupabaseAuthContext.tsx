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
      setIsLoading(true);
      
      // First check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', userData.username)
        .single();

      if (existingUser) {
        return { success: false, error: 'Username is already taken' };
      }

      // Sign up with Supabase Auth
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

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // The profile will be created automatically by the trigger
        // But let's also insert it manually to be sure
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
          console.error('Error creating profile:', profileError);
        }

        return { success: true };
      }

      return { success: false, error: 'Failed to create user' };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    setIsLoading(false);
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
    updateProfile
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
