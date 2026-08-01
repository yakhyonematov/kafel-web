import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: Omit<User, 'password' | 'createdAt' | 'updatedAt'> | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: Omit<User, 'password' | 'createdAt' | 'updatedAt'>, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const isBrowser = typeof window !== 'undefined';

  const getInitialToken = () => {
    return isBrowser ? localStorage.getItem('admin_token') : null;
  };

  const getInitialUser = () => {
    if (isBrowser) {
      const user = localStorage.getItem('admin_user');
      try {
        return user ? JSON.parse(user) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const token = getInitialToken();
  const user = getInitialUser();

  return {
    user,
    token,
    isAuthenticated: !!token,
    setAuth: (user, token) => {
      if (isBrowser) {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
      }
      set({ user, token, isAuthenticated: true });
    },
    clearAuth: () => {
      if (isBrowser) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
