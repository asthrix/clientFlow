'use client';

// ============================================
// ClientFlow CRM - Projects Page
// List and manage all projects
// ============================================

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { PageHeader } from '@/components/shared';
import { ProjectList, ProjectForm, UnifiedProjectWizard } from '@/components/projects';
import { useUpdateProject } from '@/hooks/mutations/useProjectMutations';
import type { Project, UpdateProjectDTO } from '@/types';
import { type ProjectFormData, transformProjectFormToDTO } from '@/lib/validations/project';
import { X } from 'lucide-react';

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
    // Navigate to the new project's detail page
    router.push(`/projects/${projectId}`);
  }, [router]);

  const handleEditSubmit = useCallback(async (data: ProjectFormData) => {
    setFormError(null);

    if (!editingProject) return;

    // Transform form data to DTO format
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
      <AnimatePresence>
        {isEditFormOpen && editingProject && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseEditForm}
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-x-4 top-[2%] z-50 mx-auto max-w-3xl max-h-[96vh] overflow-auto rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur px-6 py-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Edit Project
                </h2>
                <button
                  onClick={handleCloseEditForm}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <ProjectForm
                  project={editingProject}
                  onSubmit={handleEditSubmit}
                  onCancel={handleCloseEditForm}
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

