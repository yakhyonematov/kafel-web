import api from './api';

export interface UploadResponse {
  filename: string;
  url: string;
  size: number;
  mimetype: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<UploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
