'use client';

// ============================================
// ClientFlow CRM - Project Detail Page
// View and manage individual project
// ============================================

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeUpVariants, cardVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { PageHeader, StatusBadge, EmptyState, CardSkeleton } from '@/components/shared';
import { CredentialCard } from '@/components/credentials';
import { useProject } from '@/hooks/queries/useProjects';
import { useCredentialsByProject } from '@/hooks/queries/useCredentials';
import { useDeleteProject, useUpdateProjectProgress } from '@/hooks/mutations/useProjectMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type { ProjectStatus, DeliveryStatus, PaymentStatus } from '@/types';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Pencil,
  Trash2,
  FolderKanban,
  Plus,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Code,
  Key,
  User,
  Clock,
  TrendingUp,
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
  const updateProgress = useUpdateProjectProgress();

  // State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [progressValue, setProgressValue] = useState<number | null>(null);

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

  const handleProgressUpdate = useCallback(async () => {
    if (progressValue !== null) {
      await updateProgress.mutateAsync({ id: projectId, progress: progressValue });
      setProgressValue(null);
    }
  }, [projectId, progressValue, updateProgress]);

  // Format currency
  const formatCurrency = (amount: number | undefined, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
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
          <CardSkeleton className="lg:col-span-2" />
          <CardSkeleton />
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

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{project.project_name}</h1>
              <StatusBadge variant={currentStatus.variant}>
                {currentStatus.label}
              </StatusBadge>
            </div>
            {project.client_name && (
              <Link 
                href={`/clients/${project.client_id}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {project.client_name}
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/projects/${projectId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge variant={currentStatus.variant}>{currentStatus.label}</StatusBadge>
        <StatusBadge variant={currentDelivery.variant}>{currentDelivery.label}</StatusBadge>
        <StatusBadge variant={currentPayment.variant}>{currentPayment.label}</StatusBadge>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Progress</h2>
              <span className="text-2xl font-bold">{project.progress_percentage || 0}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden mb-4">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${project.progress_percentage || 0}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={100}
                placeholder={String(project.progress_percentage || 0)}
                value={progressValue ?? ''}
                onChange={(e) => setProgressValue(Number(e.target.value))}
                className="w-24"
              />
              <Button 
                size="sm" 
                onClick={handleProgressUpdate}
                disabled={progressValue === null || updateProgress.isPending}
              >
                {updateProgress.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
            </div>
          )}

          {/* Credentials */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Credentials</h2>
              <Button size="sm" asChild>
                <Link href={`/credentials?projectId=${projectId}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Link>
              </Button>
            </div>

            {credentialsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : credentials && credentials.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {credentials.map((cred) => (
                  <CredentialCard key={cred.id} credential={cred} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Key className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No credentials stored</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={fadeUpVariants} className="space-y-6">
          {/* Financial */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Financial</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="font-semibold">{formatCurrency(project.total_cost, project.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Outstanding</span>
                <span className="font-semibold text-amber-600">
                  {formatCurrency(project.outstanding_balance, project.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Structure</span>
                <span className="text-sm font-medium capitalize">{project.payment_structure}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium">{formatDate(project.start_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Expected Completion</p>
                  <p className="text-sm font-medium">{formatDate(project.expected_completion_date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          {(project.live_url || project.staging_url || project.repository_url) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground mb-4">Links</h2>
              <div className="space-y-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Site
                  </a>
                )}
                {project.staging_url && (
                  <a
                    href={project.staging_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Staging
                  </a>
                )}
                {project.repository_url && (
                  <a
                    href={project.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Code className="h-4 w-4" />
                    Repository
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {project.technology_stack && project.technology_stack.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.technology_stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

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
