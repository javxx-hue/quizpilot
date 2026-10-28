import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { UserProfile } from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toProfile(user: User): UserProfile {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    name: meta.full_name || meta.name || user.email?.split('@')[0] || '',
    email: user.email ?? '',
    avatar: meta.avatar_url,
    provider: user.app_metadata?.provider === 'google' ? 'google' : 'email',
    createdAt: user.created_at,
  };
}

function requireClient() {
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED');
  return supabase;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(supabase !== null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session ? toProfile(data.session.user) : null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? toProfile(session.user) : null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    async signUp(email, password, name) {
      const { data, error } = await requireClient().auth.signUp({
        email,
        password,
        options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      // With email confirmation on, Supabase returns a user but no session
      return { needsConfirmation: !data.session };
    },
    async signIn(email, password) {
      const { error } = await requireClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async signInWithGoogle() {
      const { error } = await requireClient().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/dashboard' },
      });
      if (error) throw error;
    },
    async signOut() {
      const { error } = await requireClient().auth.signOut();
      if (error) throw error;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
