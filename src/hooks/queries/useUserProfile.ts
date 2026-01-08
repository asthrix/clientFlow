// ============================================
// ClientFlow CRM - User Profile Hooks
// TanStack Query hooks for user profile
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, saveUserPreferences } from '@/lib/services/userService';
import type { UpdateProfileDTO } from '@/types';

// Query key
export const userProfileKeys = {
  all: ['userProfile'] as const,
  current: () => [...userProfileKeys.all, 'current'] as const,
};

/**
 * Hook to fetch current user's profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: userProfileKeys.current(),
    queryFn: async () => {
      const result = await getUserProfile();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileDTO) => {
      const result = await updateUserProfile(data);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.all });
    },
  });
}

/**
 * Hook to save user preferences
 */
export function useSavePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: {
      currency_preference?: string;
      theme?: 'light' | 'dark' | 'system';
      notification_email?: boolean;
      notification_payments?: boolean;
      notification_renewals?: boolean;
      notification_deadlines?: boolean;
    }) => {
      const result = await saveUserPreferences(preferences);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.all });
    },
  });
}
