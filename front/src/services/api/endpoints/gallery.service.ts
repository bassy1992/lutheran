import { apiClient } from '../client';
import type { GalleryAlbum, GalleryPhoto, PaginatedResponse } from '@/types/models';

export const galleryService = {
  getAlbums: (params?: {
    page?: number;
    search?: string;
    is_featured?: boolean;
    year?: number;
  }) =>
    apiClient.request<PaginatedResponse<GalleryAlbum>>({ 
      method: 'GET', 
      url: '/gallery/albums/', 
      params 
    }),

  getAlbum: (id: number) =>
    apiClient.request<GalleryAlbum>({ method: 'GET', url: `/gallery/albums/${id}/` }),

  getYears: () =>
    apiClient.request<{ years: number[] }>({ method: 'GET', url: '/gallery/albums/years/' }),

  getPhotos: (params?: {
    album?: number;
    is_featured?: boolean;
  }) =>
    apiClient.request<PaginatedResponse<GalleryPhoto>>({ 
      method: 'GET', 
      url: '/gallery/photos/', 
      params 
    }),

  getPhoto: (id: number) =>
    apiClient.request<GalleryPhoto>({ method: 'GET', url: `/gallery/photos/${id}/` }),
};
