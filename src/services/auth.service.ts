import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', response.data.accessToken);
    }
    return response.data;
  },

  async register(username: string, password: string, name: string, role: 'ADMIN' | 'MANAGER'): Promise<{ message: string; user: User }> {
    const response = await api.post('/auth/register', { username, password, name, role });
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/auth/users');
    return response.data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/auth/users/${id}`);
    return response.data;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }
};
