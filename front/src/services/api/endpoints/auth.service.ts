import { apiClient } from '../client';
import type { AuthTokens, User } from '@/types/models';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export const authService = {
  /**
   * Login with username and password
   * @param username - User's username
   * @param password - User's password
   * @returns JWT access and refresh tokens
   */
  login: (username: string, password: string) =>
    apiClient.request<AuthTokens>({ 
      method: 'POST', 
      url: '/auth/token/', 
      data: { username, password } 
    }),

  /**
   * Register a new user
   * @param data - Registration data including username, email, password, first_name, last_name
   * @returns Created user object
   */
  register: (data: RegisterData) =>
    apiClient.request<User>({ 
      method: 'POST', 
      url: '/auth/register/', 
      data 
    }),

  /**
   * Refresh access token using refresh token
   * @param refresh - Refresh token
   * @returns New access token
   */
  refreshToken: (refresh: string) =>
    apiClient.request<{ access: string }>({ 
      method: 'POST', 
      url: '/auth/token/refresh/', 
      data: { refresh } 
    }),

  /**
   * Logout and blacklist refresh token
   * @param refresh - Refresh token to blacklist
   */
  logout: (refresh: string) =>
    apiClient.request<void>({ 
      method: 'POST', 
      url: '/auth/logout/', 
      data: { refresh } 
    }),

  /**
   * Get current authenticated user
   * @returns Current user object
   */
  getCurrentUser: () =>
    apiClient.request<User>({ 
      method: 'GET', 
      url: '/auth/user/' 
    }),

  /**
   * Request password reset email
   * @param email - User's email address
   */
  requestPasswordReset: (email: string) =>
    apiClient.request<void>({ 
      method: 'POST', 
      url: '/auth/password-reset/', 
      data: { email } 
    }),

  /**
   * Confirm password reset with token
   * @param token - Password reset token from email
   * @param password - New password
   * @param uid - User ID (base64 encoded)
   */
  confirmPasswordReset: (token: string, password: string, uid?: string) =>
    apiClient.request<void>({ 
      method: 'POST', 
      url: '/auth/password-reset/confirm/', 
      data: { token, password, password2: password, uid } 
    }),
};
