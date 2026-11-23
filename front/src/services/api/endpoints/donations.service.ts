import { apiClient } from '../client';
import type { Donation, DonationCategory } from '@/types/models';

export const donationsService = {
  getCategories: () => 
    apiClient.request<DonationCategory[]>({ method: 'GET', url: '/donations/categories/' }),

  createDonation: (data: {
    donor_name: string;
    donor_email: string;
    donor_phone: string;
    category: number;
    amount: string;
    currency?: string;
    payment_method: 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'check' | 'other';
    is_anonymous?: boolean;
    notes?: string;
  }) =>
    apiClient.request<Donation>({ method: 'POST', url: '/donations/', data }),
};
