import { useAuthStore } from '@/lib/auth';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api';

export function useAuth() {
  const { token, user, isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
    }
  }, [token]);

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };
}
