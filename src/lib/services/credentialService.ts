// ============================================
// ClientFlow CRM - Credential Service
// Abstracted database operations for credentials vault
// ============================================

import { getSupabaseClient } from '@/lib/supabase/client';
import type { 
  Credential, 
  CreateCredentialDTO, 
  UpdateCredentialDTO, 
  CredentialFilters,
  CredentialType,
} from '@/types';

export interface CredentialServiceResult<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

/**
 * Fetch all credentials for the current user with filtering
 */
export async function getCredentials(options?: {
  filters?: CredentialFilters;
}): Promise<CredentialServiceResult<Credential[]>> {
  const supabase = getSupabaseClient();
  const { filters } = options || {};

  let query = supabase
    .from('credentials_vault')
    .select('*, projects(project_name)')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.search) {
    query = query.or(
      `service_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`
    );
  }

  if (filters?.credential_type && filters.credential_type.length > 0) {
    query = query.in('credential_type', filters.credential_type);
  }

  if (filters?.project_id) {
    query = query.eq('project_id', filters.project_id);
  }

  const { data, error } = await query;

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  // Transform to include project_name at top level
  type CredentialWithProject = Credential & { projects: { project_name: string } | null };
  const transformed = (data as CredentialWithProject[]).map((cred) => ({
    ...cred,
    project_name: cred.projects?.project_name,
    projects: undefined,
  })) as Credential[];

  return { data: transformed, error: null };
}

/**
 * Fetch a single credential by ID
 */
export async function getCredentialById(
  id: string
): Promise<CredentialServiceResult<Credential>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('credentials_vault')
    .select('*, projects(project_name)')
    .eq('id', id)
    .single();

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  type CredentialWithProject = Credential & { projects: { project_name: string } | null };
  const cred = data as CredentialWithProject;
  const transformed = {
    ...cred,
    project_name: cred.projects?.project_name,
    projects: undefined,
  } as Credential;

  return { data: transformed, error: null };
}

/**
 * Create a new credential
 */
export async function createCredential(
  credentialData: CreateCredentialDTO
): Promise<CredentialServiceResult<Credential>> {
  const supabase = getSupabaseClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'Not authenticated' } };
  }

  const { data, error } = await supabase
    .from('credentials_vault')
    .insert({
      ...credentialData,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: data as Credential, error: null };
}

/**
 * Update an existing credential
 */
export async function updateCredential(
  credentialData: UpdateCredentialDTO
): Promise<CredentialServiceResult<Credential>> {
  const supabase = getSupabaseClient();
  const { id, ...updates } = credentialData;

  const { data, error } = await supabase
    .from('credentials_vault')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: data as Credential, error: null };
}

/**
 * Delete a credential
 */
export async function deleteCredential(
  id: string
): Promise<CredentialServiceResult<void>> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('credentials_vault')
    .delete()
    .eq('id', id);

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: null, error: null };
}

/**
 * Get credentials for a specific project
 */
export async function getCredentialsByProjectId(
  projectId: string
): Promise<CredentialServiceResult<Credential[]>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('credentials_vault')
    .select('*')
    .eq('project_id', projectId)
    .order('credential_type', { ascending: true });

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: data as Credential[], error: null };
}

/**
 * Get credentials expiring soon (within N days)
 */
export async function getExpiringCredentials(
  withinDays: number = 30
): Promise<CredentialServiceResult<Credential[]>> {
  const supabase = getSupabaseClient();
  
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + withinDays);

  const { data, error } = await supabase
    .from('credentials_vault')
    .select('*, projects(project_name)')
    .not('expiry_date', 'is', null)
    .lte('expiry_date', futureDate.toISOString())
    .order('expiry_date', { ascending: true });

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  type CredentialWithProject = Credential & { projects: { project_name: string } | null };
  const transformed = (data as CredentialWithProject[]).map((cred) => ({
    ...cred,
    project_name: cred.projects?.project_name,
    projects: undefined,
  })) as Credential[];

  return { data: transformed, error: null };
}
