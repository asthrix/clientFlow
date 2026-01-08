// ============================================
// ClientFlow CRM - Project Mutations
// TanStack Query mutations for project operations
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  updateProject,
  deleteProject,
  updateProjectProgress,
  updateProjectStatus,
} from '@/lib/services/projectService';
import { projectKeys } from '@/hooks/queries/useProjects';
import { clientKeys } from '@/hooks/queries/useClients';
import type { CreateProjectDTO, UpdateProjectDTO, Project } from '@/types';

/**
 * Hook to create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectDTO) => {
      const result = await createProject(data);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    onSuccess: (newProject) => {
      // Invalidate all project lists
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
      queryClient.invalidateQueries({ queryKey: projectKeys.recent() });
      
      // Invalidate client's projects list
      queryClient.invalidateQueries({ 
        queryKey: projectKeys.byClient(newProject.client_id) 
      });
      
      // Invalidate client stats (project count)
      queryClient.invalidateQueries({ queryKey: clientKeys.stats() });

      // Add new project to cache
      queryClient.setQueryData(projectKeys.detail(newProject.id), newProject);
    },
  });
}

/**
 * Hook to update an existing project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProjectDTO) => {
      const result = await updateProject(data);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    onMutate: async (updatedProject) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: projectKeys.detail(updatedProject.id) });

      // Snapshot the previous value
      const previousProject = queryClient.getQueryData<Project>(
        projectKeys.detail(updatedProject.id)
      );

      // Optimistically update to the new value
      if (previousProject) {
        queryClient.setQueryData(projectKeys.detail(updatedProject.id), {
          ...previousProject,
          ...updatedProject,
        });
      }

      return { previousProject };
    },
    onError: (_err, updatedProject, context) => {
      // Rollback on error
      if (context?.previousProject) {
        queryClient.setQueryData(
          projectKeys.detail(updatedProject.id),
          context.previousProject
        );
      }
    },
    onSettled: (_, __, variables) => {
      // Refetch to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    },
  });
}

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProject(id);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
      queryClient.invalidateQueries({ queryKey: projectKeys.recent() });
      // Also invalidate client stats
      queryClient.invalidateQueries({ queryKey: clientKeys.stats() });
    },
  });
}

/**
 * Hook to update project progress
 */
export function useUpdateProjectProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      const result = await updateProjectProgress(id, progress);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    onMutate: async ({ id, progress }) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.detail(id) });

      const previousProject = queryClient.getQueryData<Project>(projectKeys.detail(id));

      if (previousProject) {
        queryClient.setQueryData(projectKeys.detail(id), {
          ...previousProject,
          progress_percentage: progress,
        });
      }

      return { previousProject };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(projectKeys.detail(id), context.previousProject);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Hook to update project status
 */
export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Project['status'] }) => {
      const result = await updateProjectStatus(id, status);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    },
  });
}
