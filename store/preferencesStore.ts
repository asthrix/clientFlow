// ============================================
// ClientFlow CRM - Preferences Store
// Global app preferences: theme, currency, notifications
// Persisted to localStorage and synced with backend
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD';
export type Theme = 'light' | 'dark' | 'system';

interface NotificationSettings {
  email_notifications: boolean;
  payment_reminders: boolean;
  credential_expiry_alerts: boolean;
  project_deadline_alerts: boolean;
}

interface PreferencesState {
  // Preferences
  currency: Currency;
  theme: Theme;
  notifications: NotificationSettings;
  
  // Profile info
  fullName: string;
  businessName: string;
  phone: string;
  
  // Actions
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: Theme) => void;
  setNotifications: (settings: Partial<NotificationSettings>) => void;
  setProfile: (profile: { fullName?: string; businessName?: string; phone?: string }) => void;
  loadFromProfile: (profile: {
    currency_preference?: Currency;
    theme?: Theme;
    full_name?: string;
    business_name?: string;
    phone?: string;
    notification_email?: boolean;
    notification_payments?: boolean;
    notification_renewals?: boolean;
    notification_deadlines?: boolean;
  }) => void;
  reset: () => void;
}

const defaultNotifications: NotificationSettings = {
  email_notifications: true,
  payment_reminders: true,
  credential_expiry_alerts: true,
  project_deadline_alerts: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      // Default values - India focused
      currency: 'INR',
      theme: 'system',
      notifications: defaultNotifications,
      fullName: '',
      businessName: '',
      phone: '',

      setCurrency: (currency) => set({ currency }),
      
      setTheme: (theme) => set({ theme }),
      
      setNotifications: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),
      
      setProfile: (profile) =>
        set((state) => ({
          fullName: profile.fullName ?? state.fullName,
          businessName: profile.businessName ?? state.businessName,
          phone: profile.phone ?? state.phone,
        })),
      
      loadFromProfile: (profile) =>
        set({
          currency: profile.currency_preference || 'INR',
          theme: profile.theme || 'system',
          fullName: profile.full_name || '',
          businessName: profile.business_name || '',
          phone: profile.phone || '',
          notifications: {
            email_notifications: profile.notification_email ?? true,
            payment_reminders: profile.notification_payments ?? true,
            credential_expiry_alerts: profile.notification_renewals ?? true,
            project_deadline_alerts: profile.notification_deadlines ?? true,
          },
        }),
      
      reset: () =>
        set({
          currency: 'INR',
          theme: 'system',
          notifications: defaultNotifications,
          fullName: '',
          businessName: '',
          phone: '',
        }),
    }),
    {
      name: 'clientflow-preferences',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Currency formatting helper that uses the store
export const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string }> = {
  INR: { symbol: '₹', locale: 'en-IN' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  AUD: { symbol: 'A$', locale: 'en-AU' },
  CAD: { symbol: 'C$', locale: 'en-CA' },
};
