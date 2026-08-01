import api from './api';
import { Order, OrderStatus, CreateOrderPayload } from '../types';

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const response = await api.post<Order>('/orders', payload);
    return response.data;
  },

  async getOrders(status?: OrderStatus): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  async acceptOrder(id: string): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/accept`);
    return response.data;
  },

  async deleteOrder(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/orders/${id}`);
    return response.data;
  },
};
