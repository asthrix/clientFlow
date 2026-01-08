// ============================================
// ClientFlow CRM - Project Queries
// TanStack Query hooks for project data fetching
// ============================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProjects,
  getProjectById,
  getProjectsByClientId,
  getRecentProjects,
  getProjectStats,
} from '@/lib/services/projectService';
import type { ProjectFilters, ProjectSortField, SortOrder } from '@/types';

// Query keys for cache management
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: ProjectFilters, sort?: { field: ProjectSortField; order: SortOrder }, page?: number) =>
    [...projectKeys.lists(), { filters, sort, page }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  byClient: (clientId: string) => [...projectKeys.all, 'byClient', clientId] as const,
  stats: () => [...projectKeys.all, 'stats'] as const,
  recent: (limit?: number) => [...projectKeys.all, 'recent', limit] as const,
};

/**
 * Hook to fetch paginated projects list
 */
export function useProjects(options?: {
  filters?: ProjectFilters;
  sort?: { field: ProjectSortField; order: SortOrder };
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}) {
  const { filters, sort, page = 1, pageSize = 10, enabled = true } = options || {};

  return useQuery({
    queryKey: projectKeys.list(filters, sort, page),
    queryFn: async () => {
      const result = await getProjects({ filters, sort, page, pageSize });
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
 * Hook to fetch a single project by ID
 */
export function useProject(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const result = await getProjectById(id);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    enabled: options?.enabled !== false && !!id,
  });
}

/**
 * Hook to fetch projects for a specific client
 */
export function useProjectsByClient(clientId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: projectKeys.byClient(clientId),
    queryFn: async () => {
      const result = await getProjectsByClientId(clientId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    enabled: options?.enabled !== false && !!clientId,
  });
}

/**
 * Hook to fetch recent projects for dashboard
 */
export function useRecentProjects(limit: number = 5) {
  return useQuery({
    queryKey: projectKeys.recent(limit),
    queryFn: async () => {
      const result = await getRecentProjects(limit);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch project statistics
 */
export function useProjectStats() {
  return useQuery({
    queryKey: projectKeys.stats(),
    queryFn: async () => {
      const result = await getProjectStats();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to prefetch project data
 */
export function usePrefetchProject() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: projectKeys.detail(id),
      queryFn: async () => {
        const result = await getProjectById(id);
        if (result.error) throw new Error(result.error.message);
        return result.data!;
      },
    });
  };
}
