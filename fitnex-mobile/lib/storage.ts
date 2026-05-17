export const storage = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fitnex-token');
    }
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitnex-token', token);
    }
  },

  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitnex-token');
    }
  },

  getUser: (): any => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('fitnex-user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  setUser: (user: any): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitnex-user', JSON.stringify(user));
    }
  },

  removeUser: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitnex-user');
    }
  },
};
