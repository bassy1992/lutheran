import { apiClient } from '../client';
import type { Event, EventRegistration, PaginatedResponse } from '@/types/models';

export const eventsService = {
  getEvents: (params?: {
    page?: number;
    event_type?: string;
    ministry?: number;
    search?: string;
    is_featured?: boolean;
  }) =>
    apiClient.request<PaginatedResponse<Event>>({ 
      method: 'GET', 
      url: '/events/', 
      params 
    }),

  getEvent: (id: number) =>
    apiClient.request<Event>({ method: 'GET', url: `/events/${id}/` }),

  registerForEvent: (data: Omit<EventRegistration, 'id' | 'registered_at' | 'status'>) =>
    apiClient.request<EventRegistration>({ method: 'POST', url: '/events/register/', data }),

  getCalendar: (year: number, month: number) =>
    apiClient.request<Record<string, Event[]>>({ 
      method: 'GET', 
      url: '/events/calendar/', 
      params: { year, month } 
    }),
};
