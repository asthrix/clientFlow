'use client';

// ============================================
// ClientFlow CRM - Clients Page
// List and manage all clients
// ============================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { PageHeader } from '@/components/shared';
import { ClientList, ClientForm } from '@/components/clients';
import { useCreateClient, useUpdateClient } from '@/hooks/mutations/useClientMutations';
import type { Client, CreateClientDTO, UpdateClientDTO } from '@/types';
import { type ClientFormData, transformFormToDTO } from '@/lib/validations/client';
import { X } from 'lucide-react';

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
      <AnimatePresence>
        {isFormOpen && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseForm}
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-x-4 top-[5%] z-50 mx-auto max-w-2xl max-h-[90vh] overflow-auto rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur px-6 py-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <ClientForm
                  client={editingClient || undefined}
                  onSubmit={handleSubmit}
                  onCancel={handleCloseForm}
                  isLoading={isSubmitting}
                  error={formError}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
