'use client';

// ============================================
// ClientFlow CRM - Projects Page
// List and manage all projects
// ============================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { PageHeader } from '@/components/shared';
import { ProjectList, ProjectForm } from '@/components/projects';
import { useCreateProject, useUpdateProject } from '@/hooks/mutations/useProjectMutations';
import type { Project, CreateProjectDTO, UpdateProjectDTO } from '@/types';
import { type ProjectFormData, transformProjectFormToDTO } from '@/lib/validations/project';
import { X } from 'lucide-react';

export default function ProjectsPage() {
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Mutations
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  // Handlers
  const handleAddProject = useCallback(() => {
    setEditingProject(null);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const handleEditProject = useCallback((project: Project) => {
    setEditingProject(project);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingProject(null);
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(async (data: ProjectFormData) => {
    setFormError(null);

    // Transform form data to DTO format
    const dtoData = transformProjectFormToDTO(data);

    try {
      if (editingProject) {
        // Update existing project
        await updateProject.mutateAsync({
          id: editingProject.id,
          ...dtoData,
        } as unknown as UpdateProjectDTO);
      } else {
        // Create new project
        await createProject.mutateAsync(dtoData as unknown as CreateProjectDTO);
      }
      handleCloseForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [editingProject, createProject, updateProject, handleCloseForm]);

  const isSubmitting = createProject.isPending || updateProject.isPending;

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

      {/* Project Form Modal */}
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
              className="fixed inset-x-4 top-[2%] z-50 mx-auto max-w-3xl max-h-[96vh] overflow-auto rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur px-6 py-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
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
                <ProjectForm
                  project={editingProject || undefined}
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
