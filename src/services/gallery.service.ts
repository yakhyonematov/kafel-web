import api from './api';
import { GalleryImage } from '../types';

export const galleryService = {
  async getGalleryByProduct(productId: string): Promise<GalleryImage[]> {
    const response = await api.get<GalleryImage[]>(`/gallery/product/${productId}`);
    return response.data;
  },

  async addGalleryImage(productId: string, imageUrl: string, roomType?: string): Promise<GalleryImage> {
    const response = await api.post<GalleryImage>('/gallery', { productId, imageUrl, roomType });
    return response.data;
  },

  async deleteGalleryImage(id: string): Promise<GalleryImage> {
    const response = await api.delete<GalleryImage>(`/gallery/${id}`);
    return response.data;
  }
};
