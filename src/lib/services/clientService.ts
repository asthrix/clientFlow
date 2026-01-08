// ============================================
// ClientFlow CRM - Client Service
// Abstracted database operations for clients
// Following Single Responsibility Principle
// ============================================

import { getSupabaseClient } from '@/lib/supabase/client';
import type { 
  Client, 
  CreateClientDTO, 
  UpdateClientDTO, 
  ClientFilters,
  ClientSortField,
  SortOrder,
} from '@/types';

export interface ClientServiceResult<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

export interface PaginatedClientsResult {
  data: Client[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch all clients for the current user with filtering, sorting, and pagination
 */
export async function getClients(options?: {
  filters?: ClientFilters;
  sort?: { field: ClientSortField; order: SortOrder };
  page?: number;
  pageSize?: number;
}): Promise<ClientServiceResult<PaginatedClientsResult>> {
  const supabase = getSupabaseClient();
  const { filters, sort, page = 1, pageSize = 10 } = options || {};

  // Build base query
  let query = supabase.from('clients').select('*', { count: 'exact' });

  // Apply filters
  if (filters?.search) {
    query = query.or(
      `client_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`
    );
  }

  if (filters?.status && filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  if (filters?.client_type && filters.client_type.length > 0) {
    query = query.in('client_type', filters.client_type);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (filters?.dateRange) {
    query = query
      .gte('created_at', filters.dateRange.from.toISOString())
      .lte('created_at', filters.dateRange.to.toISOString());
  }

  // Apply sorting
  const sortField = sort?.field || 'created_at';
  const sortOrder = sort?.order === 'asc' ? true : false;
  query = query.order(sortField, { ascending: sortOrder });

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return {
    data: {
      data: data as Client[],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
    error: null,
  };
}

/**
 * Fetch a single client by ID
 */
export async function getClientById(
  id: string
): Promise<ClientServiceResult<Client>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: data as Client, error: null };
}

/**
 * Fetch client with project count and revenue stats
 */
export async function getClientWithStats(
  id: string
): Promise<ClientServiceResult<Client & { project_count: number; total_revenue: number }>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('clients_with_stats')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data, error: null };
}

/**
 * Create a new client
 */
export async function createClient(
  clientData: CreateClientDTO
): Promise<ClientServiceResult<Client>> {
  const supabase = getSupabaseClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'Not authenticated' } };
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({
      ...clientData,
      user_id: user.id,
      tags: clientData.tags || [],
      status: clientData.status || 'active',
    })
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: data as Client, error: null };
}

/**
 * Update an existing client
 */
export async function updateClient(
  clientData: UpdateClientDTO
): Promise<ClientServiceResult<Client>> {
  const supabase = getSupabaseClient();
  const { id, ...updates } = clientData;

  const { data, error } = await supabase
    .from('clients')
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

  return { data: data as Client, error: null };
}

/**
 * Delete a client
 */
export async function deleteClient(
  id: string
): Promise<ClientServiceResult<void>> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('clients')
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
 * Archive a client (soft delete)
 */
export async function archiveClient(
  id: string
): Promise<ClientServiceResult<Client>> {
  return updateClient({ id, status: 'archived' });
}

/**
 * Get all unique tags used by clients
 */
export async function getClientTags(): Promise<ClientServiceResult<string[]>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('clients')
    .select('tags');

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  // Flatten and deduplicate tags
  const allTags = data?.flatMap((c: { tags: string[] | null }) => c.tags || []) || [];
  const uniqueTags = [...new Set(allTags)].sort() as string[];

  return { data: uniqueTags, error: null };
}

/**
 * Get recent clients for dashboard
 */
export async function getRecentClients(
  limit: number = 5
): Promise<ClientServiceResult<Client[]>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: data as Client[], error: null };
}

/**
 * Get client count by status for dashboard stats
 */
export async function getClientStats(): Promise<ClientServiceResult<{
  total: number;
  active: number;
  inactive: number;
  archived: number;
}>> {
  const supabase = getSupabaseClient();

  const { data, error, count } = await supabase
    .from('clients')
    .select('status', { count: 'exact' });

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  type StatusRecord = { status: string };
  const stats = {
    total: count || 0,
    active: data?.filter((c: StatusRecord) => c.status === 'active').length || 0,
    inactive: data?.filter((c: StatusRecord) => c.status === 'inactive').length || 0,
    archived: data?.filter((c: StatusRecord) => c.status === 'archived').length || 0,
  };

  return { data: stats, error: null };
}
