import { apiClient } from '../client';
import type { Ministry, PaginatedResponse } from '@/types/models';

export interface MinistryRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
}

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

  register: (id: number, data: MinistryRegistrationData) =>
    apiClient.request<{ message: string; member_id: number }>({ 
      method: 'POST', 
      url: `/members/ministries/${id}/register/`,
      data 
    }),
};
