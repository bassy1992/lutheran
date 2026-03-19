import { apiClient } from '../client';
import type { Newsletter } from '@/types/models';

export const newsletterService = {
  subscribe: (email: string) =>
    apiClient.request<Newsletter>({ 
      method: 'POST', 
      url: '/newsletter/subscribe/', 
      data: { email } 
    }),

  unsubscribe: (token: string) =>
    apiClient.request<{ message: string }>({ 
      method: 'POST', 
      url: '/newsletter/unsubscribe/', 
      data: { token } 
    }),
};
