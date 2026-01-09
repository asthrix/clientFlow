'use client';

// ============================================
// ClientFlow CRM - Credentials Vault Page
// Secure storage for passwords and API keys
// ============================================

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';
import { PageHeader, Modal } from '@/components/shared';
import { CredentialForm, GroupedCredentialsList, MultiCredentialForm } from '@/components/credentials';
import { useCreateCredential, useUpdateCredential } from '@/hooks/mutations/useCredentialMutations';
import type { Credential, CreateCredentialDTO, UpdateCredentialDTO } from '@/types';
import { type CredentialFormData, transformCredentialFormToDTO } from '@/lib/validations/credential';

export default function CredentialsPage() {
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMultiFormOpen, setIsMultiFormOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Mutations
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();

  // Handlers
  const handleAddCredential = useCallback((projectId?: string | null) => {
    setSelectedProjectId(projectId || null);
    setEditingCredential(null);
    setFormError(null);
    
    if (projectId) {
      setIsMultiFormOpen(true);
    } else {
      setIsFormOpen(true);
    }
  }, []);

  const handleEditCredential = useCallback((credential: Credential) => {
    setEditingCredential(credential);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setIsMultiFormOpen(false);
    setEditingCredential(null);
    setFormError(null);
    setSelectedProjectId(null);
  }, []);

  const handleSubmit = useCallback(async (data: CredentialFormData) => {
    setFormError(null);

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
        description="Securely store and manage passwords, API keys, and access credentials — grouped by project."
      />

      {/* Project-Grouped Credentials List */}
      <GroupedCredentialsList
        onAddCredential={handleAddCredential}
        onEditCredential={handleEditCredential}
      />

      {/* Single Credential Form Modal (for editing) */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingCredential ? 'Edit Credential' : 'Add New Credential'}
        size="md"
      >
        <CredentialForm
          credential={editingCredential || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={isSubmitting}
          error={formError}
        />
      </Modal>

      {/* Multi Credential Form Modal (for adding to project) */}
      <Modal
        isOpen={isMultiFormOpen && !!selectedProjectId}
        onClose={handleCloseForm}
        title="Add Credentials"
        size="lg"
      >
        {selectedProjectId && (
          <MultiCredentialForm
            projectId={selectedProjectId}
            onSuccess={handleCloseForm}
            onCancel={handleCloseForm}
          />
        )}
      </Modal>
    </motion.div>
  );
}
