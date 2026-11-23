import { apiClient } from '../client';
import type { Member, Donation, EventRegistration, PaginatedResponse } from '@/types/models';

export const membersService = {
  /**
   * Get authenticated member's profile
   */
  getProfile: (): Promise<Member> =>
    apiClient.request<Member>({
      method: 'GET',
      url: '/members/profile/',
    }),

  /**
   * Update authenticated member's profile
   */
  updateProfile: (data: Partial<Member>): Promise<Member> =>
    apiClient.request<Member>({
      method: 'PUT',
      url: '/members/profile/update/',
      data,
    }),

  /**
   * Get authenticated member's donation history
   */
  getDonations: (params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<Donation>> =>
    apiClient.request<PaginatedResponse<Donation>>({
      method: 'GET',
      url: '/members/donations/',
      params,
    }),

  /**
   * Get authenticated member's event registrations
   */
  getEvents: (params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<EventRegistration>> =>
    apiClient.request<PaginatedResponse<EventRegistration>>({
      method: 'GET',
      url: '/members/events/',
      params,
    }),

  /**
   * Get authenticated member's ministries
   */
  getMinistries: (): Promise<any[]> =>
    apiClient.request<any[]>({
      method: 'GET',
      url: '/members/ministries-list/',
    }),

  /**
   * Change authenticated member's password
   */
  changePassword: (data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<{ message: string }> =>
    apiClient.request<{ message: string }>({
      method: 'POST',
      url: '/members/change-password/',
      data,
    }),
};
