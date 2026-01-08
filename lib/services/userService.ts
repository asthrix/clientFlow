// ============================================
// ClientFlow CRM - User Profile Service
// CRUD operations for user_profiles table
// ============================================

import { getSupabaseClient } from '@/lib/supabase/client';
import type { UserProfile, UpdateProfileDTO } from '@/types';

export interface UserProfileResult<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

/**
 * Get the current user's profile
 */
export async function getUserProfile(): Promise<UserProfileResult<UserProfile>> {
  const supabase = getSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'Not authenticated' } };
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    // If no profile exists, return null without error (will be created on first save)
    if (error.code === 'PGRST116') {
      return { data: null, error: null };
    }
    return { data: null, error: { message: error.message, code: error.code } };
  }

  return { data: data as UserProfile, error: null };
}

/**
 * Update or create user profile
 */
export async function updateUserProfile(
  profileData: UpdateProfileDTO
): Promise<UserProfileResult<UserProfile>> {
  const supabase = getSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'Not authenticated' } };
  }

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (existingProfile) {
    // Update existing profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: { message: error.message, code: error.code } };
    }

    return { data: data as UserProfile, error: null };
  } else {
    // Create new profile
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        full_name: profileData.full_name || 'User',
        ...profileData,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: { message: error.message, code: error.code } };
    }

    return { data: data as UserProfile, error: null };
  }
}

/**
 * Save user preferences to profile
 */
export async function saveUserPreferences(preferences: {
  currency_preference?: string;
  theme?: 'light' | 'dark' | 'system';
  notification_email?: boolean;
  notification_payments?: boolean;
  notification_renewals?: boolean;
  notification_deadlines?: boolean;
}): Promise<UserProfileResult<UserProfile>> {
  return updateUserProfile(preferences as UpdateProfileDTO);
}
