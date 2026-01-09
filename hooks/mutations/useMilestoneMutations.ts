// ============================================
// ClientFlow CRM - Milestone Mutation Hooks
// React Query hooks for milestone operations
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  initializeProjectMilestones,
  updateMilestone,
  toggleSubTask,
  syncProjectProgress,
  deleteProjectMilestones,
} from '@/lib/services/milestoneService';
import type {
  UpdateProjectMilestoneDTO,
  InitializeMilestonesDTO,
} from '@/types';

/**
 * Hook for initializing milestones when creating a project
 */
export function useInitializeMilestones() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: InitializeMilestonesDTO) => initializeProjectMilestones(dto),
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ['milestones', variables.project_id] });
        queryClient.invalidateQueries({ queryKey: ['project', variables.project_id] });
      }
    },
  });
}

/**
 * Hook for updating a milestone
 */
export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateProjectMilestoneDTO & { project_id: string }) => {
      const result = await updateMilestone(dto);
      if (result.data) {
        // Sync project progress after milestone update
        await syncProjectProgress(dto.project_id);
      }
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ['milestones', variables.project_id] });
        queryClient.invalidateQueries({ queryKey: ['project', variables.project_id] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    },
  });
}

/**
 * Hook for toggling sub-task completion
 */
export function useToggleSubTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      subTaskId, 
      isCompleted, 
      projectId 
    }: { 
      subTaskId: string; 
      isCompleted: boolean; 
      projectId: string;
    }) => {
      const result = await toggleSubTask(subTaskId, isCompleted);
      if (result.data) {
        // Sync project progress after sub-task update
        await syncProjectProgress(projectId);
      }
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ['milestones', variables.projectId] });
        queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    },
  });
}

/**
 * Hook for deleting all project milestones
 */
export function useDeleteProjectMilestones() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProjectMilestones(projectId),
    onSuccess: (result, projectId) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
      }
    },
  });
}
