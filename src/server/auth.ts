import { supabase } from './supabase';
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

/**
 * AuthService handles all authentication strategies and API interactions with Supabase.
 * It remains independent from the global state management (Zustand).
 */
export const AuthService = {
  
  // --- Email & Password Strategy ---
  loginWithEmail: async (credentials: SignInWithPasswordCredentials) => {
    return await supabase.auth.signInWithPassword(credentials);
  },
  
  signupWithEmail: async (credentials: SignUpWithPasswordCredentials) => {
    return await supabase.auth.signUp(credentials);
  },
  
  // --- Google OAuth Strategy ---
  // To be fully implemented in later phases
  // loginWithGoogle: async () => {
  //   return await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //   });
  // },
  
  // --- Apple OAuth Strategy ---
  // To be fully implemented in later phases
  // loginWithApple: async () => {
  //   return await supabase.auth.signInWithOAuth({
  //     provider: 'apple',
  //   });
  // },

  // --- Common ---
  logout: async () => {
    return await supabase.auth.signOut();
  },
};
