import { apiClient } from '../client';
import type { ChurchInfo, Pastor, ServiceTime, CoreValue, ContactMessage, PaginatedResponse } from '../../types/models';

export const churchService = {
  getChurchInfo: async () => {
    // The endpoint returns a paginated response, so we get the first item from results
    const response = await apiClient.request<PaginatedResponse<ChurchInfo>>({ method: 'GET', url: '/church/info/' });
    return response.results[0]; // Return the first (and typically only) church info record
  },

  getPastors: () => 
    apiClient.request<Pastor[]>({ method: 'GET', url: '/church/pastors/' }),

  getServiceTimes: () => 
    apiClient.request<ServiceTime[]>({ method: 'GET', url: '/church/service-times/' }),

  getCoreValues: () => 
    apiClient.request<CoreValue[]>({ method: 'GET', url: '/church/core-values/' }),

  submitContactMessage: (data: Omit<ContactMessage, 'id' | 'created_at' | 'is_read' | 'replied'>) =>
    apiClient.request<ContactMessage>({ method: 'POST', url: '/church/contact/', data }),
};
