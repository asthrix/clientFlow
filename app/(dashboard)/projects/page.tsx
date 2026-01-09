'use client';

// ============================================
// ClientFlow CRM - Projects Page
// List and manage all projects
// ============================================

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '@/lib/animations';
import { PageHeader, Modal } from '@/components/shared';
import { ProjectList, ProjectForm, UnifiedProjectWizard } from '@/components/projects';
import { useUpdateProject } from '@/hooks/mutations/useProjectMutations';
import type { Project, UpdateProjectDTO } from '@/types';
import { type ProjectFormData, transformProjectFormToDTO } from '@/lib/validations/project';

export default function ProjectsPage() {
  const router = useRouter();
  
  // Modal state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Mutations
  const updateProject = useUpdateProject();

  // Handlers
  const handleAddProject = useCallback(() => {
    setIsWizardOpen(true);
  }, []);

  const handleEditProject = useCallback((project: Project) => {
    setEditingProject(project);
    setFormError(null);
    setIsEditFormOpen(true);
  }, []);

  const handleCloseWizard = useCallback(() => {
    setIsWizardOpen(false);
  }, []);

  const handleCloseEditForm = useCallback(() => {
    setIsEditFormOpen(false);
    setEditingProject(null);
    setFormError(null);
  }, []);

  const handleWizardSuccess = useCallback((projectId: string) => {
    router.push(`/projects/${projectId}`);
  }, [router]);

  const handleEditSubmit = useCallback(async (data: ProjectFormData) => {
    setFormError(null);

    if (!editingProject) return;

    const dtoData = transformProjectFormToDTO(data);

    try {
      await updateProject.mutateAsync({
        id: editingProject.id,
        ...dtoData,
      } as unknown as UpdateProjectDTO);
      handleCloseEditForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [editingProject, updateProject, handleCloseEditForm]);

  const isSubmitting = updateProject.isPending;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <PageHeader
        title="Projects"
        description="Track and manage all your projects, deliverables, and payments."
      />

      <ProjectList
        onAddProject={handleAddProject}
        onEditProject={handleEditProject}
      />

      {/* Unified Project Wizard for new projects */}
      <AnimatePresence>
        {isWizardOpen && (
          <UnifiedProjectWizard
            isOpen={isWizardOpen}
            onClose={handleCloseWizard}
            onSuccess={handleWizardSuccess}
          />
        )}
      </AnimatePresence>

      {/* Edit Project Form Modal */}
      <Modal
        isOpen={isEditFormOpen && !!editingProject}
        onClose={handleCloseEditForm}
        title="Edit Project"
        size="xl"
      >
        {editingProject && (
          <ProjectForm
            project={editingProject}
            onSubmit={handleEditSubmit}
            onCancel={handleCloseEditForm}
            isLoading={isSubmitting}
            error={formError}
          />
        )}
      </Modal>
    </motion.div>
  );
}
