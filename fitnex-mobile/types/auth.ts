export interface AuthState {
  token: string | null;
  user: {
    id: number;
    email: string;
    role: string;
    tenantId: number;
  } | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
