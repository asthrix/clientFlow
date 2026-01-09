// ============================================
// ClientFlow CRM - Create Multiple Credentials Hook
// Batch creation of credentials with optimistic updates
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCredential } from '@/lib/services/credentialService';
import type { CreateCredentialDTO, Credential } from '@/types';

interface CreateMultipleCredentialsParams {
  projectId: string;
  credentials: Omit<CreateCredentialDTO, 'project_id'>[];
}

/**
 * Hook for creating multiple credentials at once
 * Useful for batch operations when setting up a new project
 */
export function useCreateMultipleCredentials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, credentials }: CreateMultipleCredentialsParams) => {
      const results: { data: Credential | null; error: { message: string } | null }[] = [];
      
      // Process credentials sequentially to avoid race conditions
      for (const credential of credentials) {
        const result = await createCredential({
          ...credential,
          project_id: projectId,
        });
        results.push(result);
        
        // If any credential fails, throw to trigger error handling
        if (result.error) {
          throw new Error(`Failed to create credential "${credential.service_name}": ${result.error.message}`);
        }
      }

      // Return all successful credentials
      return results
        .filter((r) => r.data !== null)
        .map((r) => r.data as Credential);
    },
    onSuccess: (data, variables) => {
      // Invalidate credentials queries
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
      queryClient.invalidateQueries({ 
        queryKey: ['credentials', 'project', variables.projectId] 
      });
    },
    onError: (error) => {
      console.error('Failed to create credentials:', error);
    },
  });
}
