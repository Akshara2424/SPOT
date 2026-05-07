import { create } from 'zustand';
import { AuthSession, User } from 'types';

interface AuthState {
  // State
  session: AuthSession | null;
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;

  // Actions
  setSession: (session: AuthSession | null) => void;
  clearSession: () => void;
  setUser: (user: User) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsOnboarded: (isOnboarded: boolean) => void;

  // Helpers
  isAuthenticated: () => boolean;
  getAuthToken: () => string | null;
}

/**
 * Auth store using Zustand
 * Manages:
 * - Current user session (access token, etc.)
 * - User profile information
 * - Onboarding completion status
 * - Loading states for async operations
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  session: null,
  user: null,
  isLoading: false,
  isOnboarded: false,

  // Set session (typically after OTP verification)
  setSession: (session) => {
    set({ session });
    // In a real app, persist to AsyncStorage:
    // if (session) {
    //   await AsyncStorage.setItem('auth_session', JSON.stringify(session));
    // } else {
    //   await AsyncStorage.removeItem('auth_session');
    // }
  },

  // Clear session (on logout)
  clearSession: () => {
    set({
      session: null,
      user: null,
      isOnboarded: false,
    });
    // In a real app:
    // await AsyncStorage.multiRemove(['auth_session', 'user_profile']);
  },

  // Set user profile
  setUser: (user) => {
    set({ user });
    // In a real app:
    // await AsyncStorage.setItem('user_profile', JSON.stringify(user));
  },

  // Set loading state
  setIsLoading: (isLoading) => {
    set({ isLoading });
  },

  // Set onboarding status
  setIsOnboarded: (isOnboarded) => {
    set({ isOnboarded });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const { session } = get();
    if (!session) return false;

    // Check if token is expired
    if (session.expires_at) {
      return session.expires_at > Math.floor(Date.now() / 1000);
    }

    return true;
  },

  // Get access token for API requests
  getAuthToken: () => {
    const { session } = get();
    return session?.access_token || null;
  },
}));

export type AuthStore = typeof useAuthStore;
