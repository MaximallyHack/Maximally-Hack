import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/supabaseClient";
import type { User } from "@supabase/supabase-js";

type SupabaseAuthContextType = {
  user: User | null;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Record<string, any>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Listen for auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setUser(data.session.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ✅ Always sync username from profiles table
  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.username) {
            setUser({
              ...user,
              user_metadata: { ...user.user_metadata, username: data.username },
            });
          }
        });
    }
  }, [user?.id]);

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    if (data.user) setUser(data.user);
    return data;
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) setUser(data.user);
    return data;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updates: Record<string, any>) => {
    if (!user) return;
    const { data, error } = await supabase.auth.updateUser({ data: updates });
    if (error) throw error;
    if (data.user) setUser(data.user);
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });
    if (updateError) throw updateError;

    setUser({
      ...user,
      user_metadata: { ...user.user_metadata, avatar_url: publicUrl },
    });

    return publicUrl;
  };

  return (
    <SupabaseAuthContext.Provider
      value={{ user, signUp, signInWithPassword, signInWithGoogle, signOut, updateUser, uploadAvatar }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  return context;
}

export const useAuth = useSupabaseAuth;
