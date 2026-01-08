// ============================================
// ClientFlow CRM - Credential Queries
// TanStack Query hooks for credential data fetching
// ============================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCredentials,
  getCredentialById,
  getCredentialsByProjectId,
  getExpiringCredentials,
} from '@/lib/services/credentialService';
import type { CredentialFilters } from '@/types';

// Query keys for cache management
export const credentialKeys = {
  all: ['credentials'] as const,
  lists: () => [...credentialKeys.all, 'list'] as const,
  list: (filters?: CredentialFilters) => [...credentialKeys.lists(), { filters }] as const,
  details: () => [...credentialKeys.all, 'detail'] as const,
  detail: (id: string) => [...credentialKeys.details(), id] as const,
  byProject: (projectId: string) => [...credentialKeys.all, 'byProject', projectId] as const,
  expiring: (days?: number) => [...credentialKeys.all, 'expiring', days] as const,
};

/**
 * Hook to fetch credentials list
 */
export function useCredentials(options?: {
  filters?: CredentialFilters;
  enabled?: boolean;
}) {
  const { filters, enabled = true } = options || {};

  return useQuery({
    queryKey: credentialKeys.list(filters),
    queryFn: async () => {
      const result = await getCredentials({ filters });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch a single credential by ID
 */
export function useCredential(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: credentialKeys.detail(id),
    queryFn: async () => {
      const result = await getCredentialById(id);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    enabled: options?.enabled !== false && !!id,
  });
}

/**
 * Hook to fetch credentials for a specific project
 */
export function useCredentialsByProject(projectId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: credentialKeys.byProject(projectId),
    queryFn: async () => {
      const result = await getCredentialsByProjectId(projectId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    enabled: options?.enabled !== false && !!projectId,
  });
}

/**
 * Hook to fetch credentials expiring soon
 */
export function useExpiringCredentials(withinDays: number = 30) {
  return useQuery({
    queryKey: credentialKeys.expiring(withinDays),
    queryFn: async () => {
      const result = await getExpiringCredentials(withinDays);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to prefetch credential data
 */
export function usePrefetchCredential() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: credentialKeys.detail(id),
      queryFn: async () => {
        const result = await getCredentialById(id);
        if (result.error) throw new Error(result.error.message);
        return result.data!;
      },
    });
  };
}
