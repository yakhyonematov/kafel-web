import api from './api';
import { Product, PaginatedResponse, FilterProductParams } from '../types';

export const productService = {
  async getProducts(params?: FilterProductParams): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  async getAdminProducts(params?: FilterProductParams): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/products/admin/all', { params });
    return response.data;
  },

  async getProductById(id: string): Promise<Product | null> {
    const response = await api.get<Product>(`/products/${id}`, {
      validateStatus: (status) => status < 500,
    });
    if (response.status === 404) {
      return null;
    }
    return response.data;
  },

  async getProductByCode(code: string): Promise<Product | null> {
    const response = await api.get<Product>(`/products/code/${code}`, {
      validateStatus: (status) => status < 500,
    });
    if (response.status === 404) {
      return null;
    }
    return response.data;
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'factory'>): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'factory'>>): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<Product> {
    const response = await api.delete<Product>(`/products/${id}`);
    return response.data;
  }
};
