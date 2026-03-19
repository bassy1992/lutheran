import { apiClient } from '../client';
import type { PrayerRequest } from '@/types/models';

export const prayersService = {
  submitPrayerRequest: (data: {
    name: string;
    email: string;
    request: string;
    is_anonymous?: boolean;
  }) =>
    apiClient.request<PrayerRequest>({ method: 'POST', url: '/prayers/', data }),
};
