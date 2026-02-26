import { create } from 'zustand';
import { Session, User, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../server/supabase';
import { AuthService } from '../server/auth';

interface AuthState {
  session: Session | null;
  user: User | null;
  isHydrated: boolean;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setHydrated: () => void;
  
  // Store Actions
  loginWithEmail: (credentials: SignInWithPasswordCredentials) => Promise<{ error: any }>;
  signupWithEmail: (credentials: SignUpWithPasswordCredentials) => Promise<{ error: any }>;
  // loginWithGoogle: () => Promise<{ error: any }>;
  // loginWithApple: () => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isHydrated: false,
  isLoading: false,
  setSession: (session) => set({ session, user: session?.user || null }),
  setHydrated: () => set({ isHydrated: true }),
  
  loginWithEmail: async (credentials) => {
    set({ isLoading: true });
    try {
      return await AuthService.loginWithEmail(credentials);
    }catch(error){
      console.log(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  signupWithEmail: async (credentials) => {
    set({ isLoading: true });
    try {
      return await AuthService.signupWithEmail(credentials);
    }catch(error){
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // loginWithGoogle: async () => {
  //   return await AuthService.loginWithGoogle();
  // },
  
  // loginWithApple: async () => {
  //   return await AuthService.loginWithApple();
  // },
  
  logout: async () => {
    set({ isLoading: true });
    try{
      const res = await AuthService.logout();
      set({ session: null, user: null }); // explicitly clear
      return res;
    }catch(error){
      console.log(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
  useAuthStore.getState().setHydrated();
});

// Listen to auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});
