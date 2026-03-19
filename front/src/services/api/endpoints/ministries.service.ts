import { apiClient } from '../client';
import type { Ministry, PaginatedResponse } from '@/types/models';

export const ministriesService = {
  getMinistries: (params?: { search?: string }) => 
    apiClient.request<PaginatedResponse<Ministry>>({ 
      method: 'GET', 
      url: '/members/ministries/',
      params 
    }),

  getMinistry: (id: number) =>
    apiClient.request<Ministry>({ method: 'GET', url: `/members/ministries/${id}/` }),

  expressInterest: (id: number) =>
    apiClient.request<{ message: string }>({ 
      method: 'POST', 
      url: `/members/ministries/${id}/express_interest/` 
    }),
};
