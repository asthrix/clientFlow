// ============================================
// ClientFlow CRM - Auth Service
// Supabase authentication functions
// ============================================

import { getSupabaseClient } from '@/lib/supabase/client';

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResult<T = void> {
  data: T | null;
  error: AuthError | null;
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Sign up with email, password, and full name
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResult> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = getSupabaseClient();
  return await supabase.auth.getSession();
}

/**
 * Get current user
 */
export async function getUser() {
  const supabase = getSupabaseClient();
  return await supabase.auth.getUser();
}
