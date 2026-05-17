import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthContextType } from '@/types/auth';
import { apiClient } from './api';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const response = await apiClient.login({ email, password });
        if (response.success && response.data) {
          apiClient.setToken(response.data.token);
          set({
            token: response.data.token,
            user: response.data.user,
            isAuthenticated: true,
          });
        } else {
          throw new Error(response.error || 'Login failed');
        }
      },
      logout: () => {
        apiClient.clearToken();
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'fitnex-auth-storage',
    }
  )
);
