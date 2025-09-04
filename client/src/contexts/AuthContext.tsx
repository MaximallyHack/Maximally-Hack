import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User, AuthState } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { username: string; email: string; fullName: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  registerForEvent: (eventId: string) => Promise<{ success: boolean; error?: string }>;
  unregisterFromEvent: (eventId: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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

  const register = async (userData: { username: string; email: string; fullName: string; password: string }) => {
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
    const result = await authService.unregisterFromEvent(eventId);
    if (result.success) {
      // Refresh user data
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    return result;
  };

  const updateProfile = async (updates: Partial<User>) => {
    const result = await authService.updateProfile(updates);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
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