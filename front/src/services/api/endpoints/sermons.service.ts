import { apiClient } from '../client';
import type { Sermon, SermonSeries, PaginatedResponse } from '../../types/models';

export const sermonsService = {
  getSermons: (params?: {
    page?: number;
    pastor?: number;
    series?: number;
    search?: string;
    date_from?: string;
    date_to?: string;
    is_featured?: boolean;
  }) =>
    apiClient.request<PaginatedResponse<Sermon>>({ 
      method: 'GET', 
      url: '/sermons/sermons/', 
      params 
    }),

  getSermon: (id: number) =>
    apiClient.request<Sermon>({ method: 'GET', url: `/sermons/sermons/${id}/` }),

  incrementViewCount: (id: number) =>
    apiClient.request<void>({ method: 'POST', url: `/sermons/sermons/${id}/increment-view/` }),

  incrementDownloadCount: (id: number) =>
    apiClient.request<void>({ method: 'POST', url: `/sermons/sermons/${id}/increment-download/` }),

  getSeries: () =>
    apiClient.request<SermonSeries[]>({ method: 'GET', url: '/sermons/series/' }),

  getSeriesDetail: (id: number) =>
    apiClient.request<SermonSeries>({ method: 'GET', url: `/sermons/series/${id}/` }),

  // Weekly Bulletin endpoints
  getBulletins: (params?: { is_active?: boolean }) =>
    apiClient.request<PaginatedResponse<any>>({ 
      method: 'GET', 
      url: '/sermons/bulletins/', 
      params 
    }),

  getCurrentBulletin: () =>
    apiClient.request<any>({ 
      method: 'GET', 
      url: '/sermons/bulletins/', 
      params: { is_active: true } 
    }),
};
