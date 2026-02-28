import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Session,
  User,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { supabase } from '../server/supabase';
import { AuthService } from '../server/auth';
import { ProfileService } from '../server/profileService';
import { zustandStorage } from '../utils/zustandStorage';

interface AuthState {
  session: Session | null;
  user: User | null;
  isHydrated: boolean;
  isLoading: boolean;
  // null = not yet fetched, true/false = fetched from DB
  isOnboarded: boolean | null;
  setSession: (session: Session | null) => void;
  setHydrated: () => void;
  setIsOnboarded: (val: boolean) => void;
  fetchIsOnboarded: (userId: string) => Promise<void>;

  // Store Actions
  loginWithEmail: (credentials: SignInWithPasswordCredentials) => Promise<{ error: any }>;
  signupWithEmail: (credentials: SignUpWithPasswordCredentials) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      isHydrated: false,
      isLoading: false,
      isOnboarded: null,

      setSession: (session) => set({ session, user: session?.user || null }),
      setHydrated: () => set({ isHydrated: true }),
      setIsOnboarded: (val) => set({ isOnboarded: val }),

      fetchIsOnboarded: async (userId) => {
        try {
          const isOnboarded = await ProfileService.fetchIsOnboarded(userId);
          set({ isOnboarded });
        } catch {
          set({ isOnboarded: false });
        }
      },

      loginWithEmail: async (credentials) => {
        set({ isLoading: true });
        try {
          const result = await AuthService.loginWithEmail(credentials);
          if (!result.error && result.data.user) {
            const isOnboarded = await ProfileService.fetchIsOnboarded(result.data.user.id);
            set({ isOnboarded });
          }
          return result;
        } catch (error) {
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
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const res = await AuthService.logout();
          set({ session: null, user: null, isOnboarded: null });
          return res;
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      // Only persist isOnboarded — session is managed by Supabase's own storage
      partialize: (state) => ({ isOnboarded: state.isOnboarded }),
    },
  ),
);

// Initialize auth state on app start
supabase.auth.getSession().then(async ({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
  // If there's an active session but isOnboarded not in MMKV cache, fetch from DB
  if (session?.user && useAuthStore.getState().isOnboarded === null) {
    await useAuthStore.getState().fetchIsOnboarded(session.user.id);
  }
  useAuthStore.getState().setHydrated();
});

// Listen to auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});
