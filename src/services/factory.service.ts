import api from './api';
import { Factory } from '../types';

export const factoryService = {
  async getFactories(): Promise<Factory[]> {
    const response = await api.get<Factory[]>('/factories');
    return response.data;
  },

  async getFactoryById(id: string): Promise<Factory> {
    const response = await api.get<Factory>(`/factories/${id}`);
    return response.data;
  },

  async createFactory(data: Omit<Factory, 'id' | 'createdAt' | 'updatedAt' | 'products'>): Promise<Factory> {
    const response = await api.post<Factory>('/factories', data);
    return response.data;
  },

  async updateFactory(id: string, data: Partial<Omit<Factory, 'id' | 'createdAt' | 'updatedAt' | 'products'>>): Promise<Factory> {
    const response = await api.patch<Factory>(`/factories/${id}`, data);
    return response.data;
  },

  async deleteFactory(id: string): Promise<Factory> {
    const response = await api.delete<Factory>(`/factories/${id}`);
    return response.data;
  }
};
