'use client';

// ============================================
// ClientFlow CRM - Clients Page
// List and manage all clients
// ============================================

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';
import { PageHeader, Modal } from '@/components/shared';
import { ClientList, ClientForm } from '@/components/clients';
import { useCreateClient, useUpdateClient } from '@/hooks/mutations/useClientMutations';
import type { Client, CreateClientDTO, UpdateClientDTO } from '@/types';
import { type ClientFormData, transformFormToDTO } from '@/lib/validations/client';

export default function ClientsPage() {
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Mutations
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  // Handlers
  const handleAddClient = useCallback(() => {
    setEditingClient(null);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const handleEditClient = useCallback((client: Client) => {
    setEditingClient(client);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingClient(null);
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(async (data: ClientFormData) => {
    setFormError(null);

    // Transform form data to DTO format (converts empty strings to undefined)
    const dtoData = transformFormToDTO(data);

    try {
      if (editingClient) {
        // Update existing client
        await updateClient.mutateAsync({
          id: editingClient.id,
          ...dtoData,
        } as unknown as UpdateClientDTO);
      } else {
        // Create new client
        await createClient.mutateAsync(dtoData as unknown as CreateClientDTO);
      }
      handleCloseForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [editingClient, createClient, updateClient, handleCloseForm]);

  const isSubmitting = createClient.isPending || updateClient.isPending;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <PageHeader
        title="Clients"
        description="Manage your client database and relationships."
      />

      <ClientList
        onAddClient={handleAddClient}
        onEditClient={handleEditClient}
      />

      {/* Client Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        size="lg"
      >
        <ClientForm
          client={editingClient || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={isSubmitting}
          error={formError}
        />
      </Modal>
    </motion.div>
  );
}
