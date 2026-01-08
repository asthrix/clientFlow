// ============================================
// ClientFlow CRM - Client Queries
// TanStack Query hooks for client data fetching
// ============================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getClients,
  getClientById,
  getClientWithStats,
  getClientTags,
  getRecentClients,
  getClientStats,
} from '@/lib/services/clientService';
import type { ClientFilters, ClientSortField, SortOrder } from '@/types';

// Query keys for cache management
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters?: ClientFilters, sort?: { field: ClientSortField; order: SortOrder }, page?: number) =>
    [...clientKeys.lists(), { filters, sort, page }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  stats: () => [...clientKeys.all, 'stats'] as const,
  tags: () => [...clientKeys.all, 'tags'] as const,
  recent: (limit?: number) => [...clientKeys.all, 'recent', limit] as const,
};

/**
 * Hook to fetch paginated clients list
 */
export function useClients(options?: {
  filters?: ClientFilters;
  sort?: { field: ClientSortField; order: SortOrder };
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}) {
  const { filters, sort, page = 1, pageSize = 10, enabled = true } = options || {};

  return useQuery({
    queryKey: clientKeys.list(filters, sort, page),
    queryFn: async () => {
      const result = await getClients({ filters, sort, page, pageSize });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single client by ID
 */
export function useClient(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: async () => {
      const result = await getClientById(id);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    enabled: options?.enabled !== false && !!id,
  });
}

/**
 * Hook to fetch client with stats (project count, revenue)
 */
export function useClientWithStats(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...clientKeys.detail(id), 'stats'],
    queryFn: async () => {
      const result = await getClientWithStats(id);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    enabled: options?.enabled !== false && !!id,
  });
}

/**
 * Hook to fetch all unique client tags
 */
export function useClientTags() {
  return useQuery({
    queryKey: clientKeys.tags(),
    queryFn: async () => {
      const result = await getClientTags();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch recent clients for dashboard
 */
export function useRecentClients(limit: number = 5) {
  return useQuery({
    queryKey: clientKeys.recent(limit),
    queryFn: async () => {
      const result = await getRecentClients(limit);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch client statistics
 */
export function useClientStats() {
  return useQuery({
    queryKey: clientKeys.stats(),
    queryFn: async () => {
      const result = await getClientStats();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to prefetch client data
 */
export function usePrefetchClient() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: clientKeys.detail(id),
      queryFn: async () => {
        const result = await getClientById(id);
        if (result.error) throw new Error(result.error.message);
        return result.data!;
      },
    });
  };
}
