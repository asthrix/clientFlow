// ============================================
// ClientFlow CRM - Client Mutations
// TanStack Query mutations for client operations
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createClient,
  updateClient,
  deleteClient,
  archiveClient,
} from '@/lib/services/clientService';
import { clientKeys } from '@/hooks/queries/useClients';
import type { CreateClientDTO, UpdateClientDTO, Client } from '@/types';

/**
 * Hook to create a new client
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClientDTO) => {
      const result = await createClient(data);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    onSuccess: (newClient) => {
      // Invalidate all client lists
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.stats() });
      queryClient.invalidateQueries({ queryKey: clientKeys.tags() });
      queryClient.invalidateQueries({ queryKey: clientKeys.recent() });

      // Add new client to cache
      queryClient.setQueryData(clientKeys.detail(newClient.id), newClient);
    },
  });
}

/**
 * Hook to update an existing client
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateClientDTO) => {
      const result = await updateClient(data);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    onMutate: async (updatedClient) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: clientKeys.detail(updatedClient.id) });

      // Snapshot the previous value
      const previousClient = queryClient.getQueryData<Client>(
        clientKeys.detail(updatedClient.id)
      );

      // Optimistically update to the new value
      if (previousClient) {
        queryClient.setQueryData(clientKeys.detail(updatedClient.id), {
          ...previousClient,
          ...updatedClient,
        });
      }

      return { previousClient };
    },
    onError: (_err, updatedClient, context) => {
      // Rollback on error
      if (context?.previousClient) {
        queryClient.setQueryData(
          clientKeys.detail(updatedClient.id),
          context.previousClient
        );
      }
    },
    onSettled: (_, __, variables) => {
      // Refetch to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.tags() });
    },
  });
}

/**
 * Hook to delete a client
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteClient(id);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: clientKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.stats() });
      queryClient.invalidateQueries({ queryKey: clientKeys.recent() });
    },
  });
}

/**
 * Hook to archive a client (soft delete)
 */
export function useArchiveClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await archiveClient(id);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data!;
    },
    onSuccess: (archivedClient) => {
      queryClient.setQueryData(clientKeys.detail(archivedClient.id), archivedClient);
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.stats() });
    },
  });
}
