import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthUser } from '@/lib/auth';

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { 
    username: string; 
    email: string; 
    fullName: string; 
    password: string;
    role?: "user" | "organizer";
    organizationName?: string;
    website?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  registerForEvent: (eventId: string) => Promise<{ success: boolean; error?: string }>;
  unregisterFromEvent: (eventId: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const result = await authService.login(username, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsLoggedIn(true);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = async (userData: { 
    username: string; 
    email: string; 
    fullName: string; 
    password: string;
    role?: "user" | "organizer";
    organizationName?: string;
    website?: string;
  }) => {
    const result = await authService.register(userData);
    if (result.success && result.user) {
      setUser(result.user);
      setIsLoggedIn(true);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const registerForEvent = async (eventId: string) => {
    const result = await authService.registerForEvent(eventId);
    if (result.success) {
      // Refresh user data
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    return result;
  };

  const unregisterFromEvent = async (eventId: string) => {
    // TODO: Add unregister method to auth service
    const result = { success: true };
    if (result.success) {
      // Refresh user data
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    return result;
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    // TODO: Add update profile method to auth service
    const result = { success: true, user: { ...user, ...updates } as AuthUser };
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: 'Failed to update profile' };
  };

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      register,
      logout,
      registerForEvent,
      unregisterFromEvent,
      updateProfile,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}