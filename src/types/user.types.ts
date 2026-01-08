// ============================================
// ClientFlow CRM - User Types
// User profile and settings types
// ============================================

import type { BaseEntity, Currency } from './common.types';

// ============================================
// User Profile Interface
// ============================================

export interface UserProfile extends BaseEntity {
  user_id: string;
  full_name?: string;
  business_name?: string;
  email: string; // From auth
  phone?: string;
  avatar_url?: string;
  timezone?: string;
  currency_preference: Currency;
  date_format?: string;
  theme?: 'light' | 'dark' | 'system';
}

// ============================================
// Notification Settings
// ============================================

export interface NotificationSettings {
  email_notifications: boolean;
  domain_renewal_reminders: boolean;
  hosting_renewal_reminders: boolean;
  payment_reminders: boolean;
  project_deadline_notifications: boolean;
  task_due_notifications: boolean;
}

// ============================================
// User Settings DTO
// ============================================

export interface UpdateProfileDTO {
  full_name?: string;
  business_name?: string;
  phone?: string;
  avatar_url?: string;
  timezone?: string;
  currency_preference?: Currency;
  date_format?: string;
  theme?: 'light' | 'dark' | 'system';
}

export interface UpdateNotificationSettingsDTO extends Partial<NotificationSettings> {}

// ============================================
// Auth Types
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  profile?: UserProfile;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
