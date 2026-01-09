'use client';

// ============================================
// ClientFlow CRM - Project Detail Page
// View and manage individual project
// ============================================

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeUpVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { StatusBadge, EmptyState, CardSkeleton, Modal } from '@/components/shared';
import { CredentialAccordion, MultiCredentialForm } from '@/components/credentials';
import { MilestoneTracker, ProjectForm } from '@/components/projects';
import { useProject } from '@/hooks/queries/useProjects';
import { useCredentialsByProject } from '@/hooks/queries/useCredentials';
import { useDeleteProject, useUpdateProject } from '@/hooks/mutations/useProjectMutations';
import { Button } from '@/components/ui/button';
import type { ProjectStatus, DeliveryStatus, PaymentStatus, UpdateProjectDTO } from '@/types';
import { type ProjectFormData, transformProjectFormToDTO } from '@/lib/validations/project';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Pencil,
  Trash2,
  FolderKanban,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Code,
  User,
  Clock,
  X,
  CreditCard,
  FileText,
  Globe,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  // Fetch project data
  const { data: project, isLoading, isError, error } = useProject(projectId);
  
  // Fetch project's credentials
  const { data: credentials, isLoading: credentialsLoading } = useCredentialsByProject(projectId);

  // Mutations
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  // State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addCredentialsModalOpen, setAddCredentialsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Status configs
  const statusConfig: Record<ProjectStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    planning: { variant: 'info', label: 'Planning' },
    in_progress: { variant: 'warning', label: 'In Progress' },
    under_review: { variant: 'info', label: 'Under Review' },
    pending_feedback: { variant: 'warning', label: 'Pending Feedback' },
    completed: { variant: 'success', label: 'Completed' },
    on_hold: { variant: 'default', label: 'On Hold' },
    cancelled: { variant: 'error', label: 'Cancelled' },
  };

  const deliveryConfig: Record<DeliveryStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    not_started: { variant: 'default', label: 'Not Started' },
    in_development: { variant: 'info', label: 'In Development' },
    testing: { variant: 'warning', label: 'Testing' },
    deployed: { variant: 'success', label: 'Deployed' },
    delivered: { variant: 'success', label: 'Delivered' },
  };

  const paymentConfig: Record<PaymentStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    unpaid: { variant: 'error', label: 'Unpaid' },
    partially_paid: { variant: 'warning', label: 'Partial' },
    paid: { variant: 'success', label: 'Paid' },
    overdue: { variant: 'error', label: 'Overdue' },
  };

  // Handlers
  const handleDelete = useCallback(async () => {
    await deleteProject.mutateAsync(projectId);
    router.push('/projects');
  }, [projectId, deleteProject, router]);

  const handleEditSubmit = useCallback(async (data: ProjectFormData) => {
    setFormError(null);
    const dtoData = transformProjectFormToDTO(data);
    try {
      await updateProject.mutateAsync({
        id: projectId,
        ...dtoData,
      } as unknown as UpdateProjectDTO);
      setEditModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [projectId, updateProject]);

  // Format currency
  const formatCurrency = (amount: number | undefined, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-24 rounded bg-muted animate-pulse" />
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton className="h-64" />
            <CardSkeleton className="h-48" />
          </div>
          <CardSkeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <EmptyState
        title="Project not found"
        description={error?.message || 'The requested project could not be found.'}
        icon={FolderKanban}
        actionLabel="Back to Projects"
        onAction={() => router.push('/projects')}
      />
    );
  }

  const currentStatus = statusConfig[project.status] || statusConfig.planning;
  const currentDelivery = deliveryConfig[project.delivery_status] || deliveryConfig.not_started;
  const currentPayment = paymentConfig[project.payment_status] || paymentConfig.unpaid;

  // Calculate payment progress
  const paidPercentage = project.total_cost ? 
    Math.round(((project.total_cost - (project.outstanding_balance || 0)) / project.total_cost) * 100) : 0;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Button variant="ghost" size="icon" asChild className="mt-0.5 shrink-0">
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{project.project_name}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                {project.client_name && (
                  <Link 
                    href={`/clients/${project.client_id}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <User className="h-3 w-3" />
                    {project.client_name}
                  </Link>
                )}
                <span className="text-sm text-muted-foreground capitalize">
                  {project.project_type?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-10 sm:pl-0">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
              <Pencil className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Sticky Sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Overview Card */}
          <motion.div variants={fadeUpVariants}>
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6">
                {/* Status */}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Status</p>
                  <StatusBadge variant={currentStatus.variant}>
                    {currentStatus.label}
                  </StatusBadge>
                </div>
                {/* Delivery */}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Delivery</p>
                  <StatusBadge variant={currentDelivery.variant}>
                    {currentDelivery.label}
                  </StatusBadge>
                </div>
                {/* Payment */}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Payment</p>
                  <StatusBadge variant={currentPayment.variant}>
                    {currentPayment.label}
                  </StatusBadge>
                </div>
                {/* Progress */}
                <div className="min-w-0 col-span-2 sm:col-span-1 sm:flex-1 sm:min-w-[140px]">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${project.progress_percentage || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{project.progress_percentage || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          {project.description && (
            <motion.div variants={fadeUpVariants}>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold text-foreground">Description</h2>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Milestone Tracker */}
          <motion.div variants={fadeUpVariants}>
            <MilestoneTracker projectId={projectId} projectType={project.project_type} />
          </motion.div>

          {/* Credentials */}
          <motion.div variants={fadeUpVariants}>
            {credentialsLoading ? (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-12 bg-muted rounded" />
                </div>
              </div>
            ) : (
              <CredentialAccordion
                credentials={credentials || []}
                onAdd={() => setAddCredentialsModalOpen(true)}
              />
            )}
          </motion.div>
        </div>

        {/* Right Column - Sticky Sidebar */}
        <div className="lg:sticky lg:top-20 lg:self-start space-y-4 sm:space-y-5">
          {/* Financial Summary */}
          <motion.div variants={fadeUpVariants}>
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Financial</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Total Value */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {formatCurrency(project.total_cost, project.currency)}
                  </p>
                </div>

                {/* Payment Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Payment Progress</span>
                    <span>{paidPercentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all" 
                      style={{ width: `${paidPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Outstanding */}
                {(project.outstanding_balance ?? 0) > 0 && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Outstanding</span>
                    <span className="font-semibold">
                      {formatCurrency(project.outstanding_balance, project.currency)}
                    </span>
                  </div>
                )}

                {/* Payment Structure */}
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Structure:</span>
                  <span className="font-medium capitalize">{project.payment_structure?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={fadeUpVariants}>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Timeline</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="text-sm font-medium">{formatDate(project.start_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expected End</span>
                  <span className="text-sm font-medium">{formatDate(project.expected_completion_date)}</span>
                </div>
                {project.actual_completion_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="text-sm font-medium">{formatDate(project.actual_completion_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Links */}
          {(project.live_url || project.staging_url || project.repository_url) && (
            <motion.div variants={fadeUpVariants}>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold text-foreground">Links</h2>
                </div>
                
                <div className="space-y-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-sm hover:bg-muted transition-colors"
                    >
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate">Live Site</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  )}
                  {project.staging_url && (
                    <a
                      href={project.staging_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-sm hover:bg-muted transition-colors"
                    >
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate">Staging</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  )}
                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-sm hover:bg-muted transition-colors"
                    >
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate">Repository</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Credentials Modal */}
      <Modal
        isOpen={addCredentialsModalOpen}
        onClose={() => setAddCredentialsModalOpen(false)}
        title="Add Credentials"
        size="lg"
      >
        <MultiCredentialForm
          projectId={projectId}
          onSuccess={() => setAddCredentialsModalOpen(false)}
          onCancel={() => setAddCredentialsModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen && !!project}
        onClose={() => setEditModalOpen(false)}
        title="Edit Project"
        size="xl"
      >
        {project && (
          <ProjectForm
            project={project}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditModalOpen(false)}
            isLoading={updateProject.isPending}
            error={formError}
          />
        )}
      </Modal>

      {/* Delete Dialog */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setDeleteDialogOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
            >
              <div className="mx-4 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
                <div className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="mb-2 text-center text-lg font-semibold">Delete Project</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Delete &ldquo;{project.project_name}&rdquo;? This also removes all credentials.
                  </p>
                </div>
                <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteProject.isPending}>
                    {deleteProject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
