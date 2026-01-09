// ============================================
// ClientFlow CRM - Milestone Query Hook
// React Query hook for fetching project milestones
// ============================================

import { useQuery } from '@tanstack/react-query';
import {
  getProjectMilestones,
  calculateProjectProgress,
} from '@/lib/services/milestoneService';

/**
 * Hook for fetching project milestones with sub-tasks
 */
export function useProjectMilestones(projectId: string | undefined) {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const result = await getProjectMilestones(projectId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    enabled: !!projectId,
  });
}

/**
 * Hook for fetching calculated project progress
 */
export function useProjectProgress(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-progress', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const result = await calculateProjectProgress(projectId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    enabled: !!projectId,
  });
}
