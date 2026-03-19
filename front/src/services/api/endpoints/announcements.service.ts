import { apiClient } from '../client';
import type { Announcement, PaginatedResponse } from '@/types/models';

export const announcementsService = {
  getAnnouncements: (params?: {
    page?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }) =>
    apiClient.request<PaginatedResponse<Announcement>>({ 
      method: 'GET', 
      url: '/announcements/', 
      params 
    }),
};
