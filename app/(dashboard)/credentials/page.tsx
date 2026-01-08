'use client';

// ============================================
// ClientFlow CRM - Credentials Vault Page
// Secure storage for passwords and API keys
// ============================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { PageHeader } from '@/components/shared';
import { CredentialList, CredentialForm } from '@/components/credentials';
import { useCreateCredential, useUpdateCredential } from '@/hooks/mutations/useCredentialMutations';
import type { Credential, CreateCredentialDTO, UpdateCredentialDTO } from '@/types';
import { type CredentialFormData, transformCredentialFormToDTO } from '@/lib/validations/credential';
import { X } from 'lucide-react';

export default function CredentialsPage() {
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Mutations
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();

  // Handlers
  const handleAddCredential = useCallback(() => {
    setEditingCredential(null);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const handleEditCredential = useCallback((credential: Credential) => {
    setEditingCredential(credential);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingCredential(null);
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(async (data: CredentialFormData) => {
    setFormError(null);

    // Transform form data to DTO
    const dtoData = transformCredentialFormToDTO(data);

    try {
      if (editingCredential) {
        await updateCredential.mutateAsync({
          id: editingCredential.id,
          ...dtoData,
        } as unknown as UpdateCredentialDTO);
      } else {
        await createCredential.mutateAsync(dtoData as unknown as CreateCredentialDTO);
      }
      handleCloseForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [editingCredential, createCredential, updateCredential, handleCloseForm]);

  const isSubmitting = createCredential.isPending || updateCredential.isPending;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <PageHeader
        title="Credentials Vault"
        description="Securely store and manage passwords, API keys, and access credentials."
      />

      <CredentialList
        onAddCredential={handleAddCredential}
        onEditCredential={handleEditCredential}
      />

      {/* Credential Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseForm}
            />

            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-x-4 top-[5%] z-50 mx-auto max-w-xl max-h-[90vh] overflow-auto rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur px-6 py-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {editingCredential ? 'Edit Credential' : 'Add New Credential'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <CredentialForm
                  credential={editingCredential || undefined}
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
