// ============================================
// ClientFlow CRM - Credential Mutations
// TanStack Query mutations for credential operations
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCredential,
  updateCredential,
  deleteCredential,
} from '@/lib/services/credentialService';
import { credentialKeys } from '@/hooks/queries/useCredentials';
import type { CreateCredentialDTO, UpdateCredentialDTO, Credential } from '@/types';

/**
 * Hook to create a new credential
 */
export function useCreateCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCredentialDTO) => {
      const result = await createCredential(data);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    onSuccess: (newCredential) => {
      // Invalidate all credential lists
      queryClient.invalidateQueries({ queryKey: credentialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: credentialKeys.expiring() });
      
      // Invalidate project credentials if associated
      if (newCredential.project_id) {
        queryClient.invalidateQueries({ 
          queryKey: credentialKeys.byProject(newCredential.project_id) 
        });
      }

      // Add to cache
      queryClient.setQueryData(credentialKeys.detail(newCredential.id), newCredential);
    },
  });
}

/**
 * Hook to update an existing credential
 */
export function useUpdateCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCredentialDTO) => {
      const result = await updateCredential(data);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    onMutate: async (updatedCredential) => {
      await queryClient.cancelQueries({ queryKey: credentialKeys.detail(updatedCredential.id) });

      const previousCredential = queryClient.getQueryData<Credential>(
        credentialKeys.detail(updatedCredential.id)
      );

      if (previousCredential) {
        queryClient.setQueryData(credentialKeys.detail(updatedCredential.id), {
          ...previousCredential,
          ...updatedCredential,
        });
      }

      return { previousCredential };
    },
    onError: (_err, updatedCredential, context) => {
      if (context?.previousCredential) {
        queryClient.setQueryData(
          credentialKeys.detail(updatedCredential.id),
          context.previousCredential
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: credentialKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: credentialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: credentialKeys.expiring() });
    },
  });
}

/**
 * Hook to delete a credential
 */
export function useDeleteCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCredential(id);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.removeQueries({ queryKey: credentialKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: credentialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: credentialKeys.expiring() });
    },
  });
}
