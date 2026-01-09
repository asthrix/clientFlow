'use client';

// ============================================
// ClientFlow CRM - Client Detail Page
// View and manage individual client
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeUpVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { EmptyState, CardSkeleton, StatusBadge } from '@/components/shared';
import { ClientHero, ClientStats, ClientForm } from '@/components/clients';
import { useClient } from '@/hooks/queries/useClients';
import { useProjectsByClient } from '@/hooks/queries/useProjects';
import { useDeleteClient, useArchiveClient, useUpdateClient } from '@/hooks/mutations/useClientMutations';
import { Button } from '@/components/ui/button';
import type { Client, ProjectStatus, UpdateClientDTO } from '@/types';
import { type ClientFormData, transformFormToDTO } from '@/lib/validations/client';
import {
  Building2,
  FolderKanban,
  Plus,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Calendar,
  MapPin,
  Tag,
  X,
} from 'lucide-react';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  // Fetch client data
  const { data: client, isLoading, isError, error } = useClient(clientId);
  
  // Fetch client's projects
  const { data: projects, isLoading: projectsLoading } = useProjectsByClient(clientId);

  // Mutations
  const deleteClient = useDeleteClient();
  const archiveClient = useArchiveClient();
  const updateClient = useUpdateClient();

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    if (!projects) return { total: 0, active: 0, completed: 0, revenue: 0 };
    
    const active = projects.filter(p => 
      ['planning', 'in_progress'].includes(p.status)
    ).length;
    
    const completed = projects.filter(p => p.status === 'completed').length;
    
    const revenue = projects.reduce((sum, p) => sum + (p.total_cost || 0), 0);
    
    return { total: projects.length, active, completed, revenue };
  }, [projects]);

  // Project status config
  const statusConfig: Record<ProjectStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    planning: { variant: 'info', label: 'Planning' },
    in_progress: { variant: 'warning', label: 'In Progress' },
    under_review: { variant: 'info', label: 'Under Review' },
    pending_feedback: { variant: 'warning', label: 'Pending Feedback' },
    completed: { variant: 'success', label: 'Completed' },
    on_hold: { variant: 'default', label: 'On Hold' },
    cancelled: { variant: 'error', label: 'Cancelled' },
  };

  // Handlers
  const handleDelete = useCallback(async () => {
    await deleteClient.mutateAsync(clientId);
    router.push('/clients');
  }, [clientId, deleteClient, router]);

  const handleArchive = useCallback(async () => {
    await archiveClient.mutateAsync(clientId);
  }, [clientId, archiveClient]);

  const handleEditSubmit = useCallback(async (data: ClientFormData) => {
    setFormError(null);
    const dtoData = transformFormToDTO(data);
    try {
      await updateClient.mutateAsync({
        id: clientId,
        ...dtoData,
      } as unknown as UpdateClientDTO);
      setEditModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [clientId, updateClient]);

  // Format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton className="h-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} className="h-20" />
          ))}
        </div>
        <CardSkeleton className="h-64" />
      </div>
    );
  }

  if (isError || !client) {
    return (
      <EmptyState
        title="Client not found"
        description={error?.message || 'The requested client could not be found.'}
        icon={Building2}
        actionLabel="Back to Clients"
        onAction={() => router.push('/clients')}
      />
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Hero Section */}
      <ClientHero
        client={client}
        onBack={() => router.push('/clients')}
        onEdit={() => setEditModalOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
        onArchive={handleArchive}
      />

      {/* Stats */}
      <ClientStats
        totalProjects={stats.total}
        activeProjects={stats.active}
        completedProjects={stats.completed}
        totalRevenue={stats.revenue}
        currency="INR"
      />

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects List */}
        <motion.div
          variants={fadeUpVariants}
          className="lg:col-span-2"
        >
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">
                  Projects ({projects?.length || 0})
                </h2>
              </div>
              <Button size="sm" asChild>
                <Link href="/projects">
                  <Plus className="mr-2 h-3 w-3" />
                  New
                </Link>
              </Button>
            </div>

            {projectsLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="divide-y divide-border">
                {projects.map((project) => {
                  const projectStatus = statusConfig[project.status] || statusConfig.planning;
                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {project.project_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {project.project_type} • Started {formatDate(project.start_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge variant={projectStatus.variant}>
                          {projectStatus.label}
                        </StatusBadge>
                        {project.progress_percentage !== undefined && (
                          <div className="w-16 hidden sm:block">
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${project.progress_percentage}%` }} 
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-0.5">
                              {project.progress_percentage}%
                            </p>
                          </div>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No projects yet
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href="/projects">
                    <Plus className="mr-2 h-3 w-3" />
                    Create First Project
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar Info */}
        <motion.div variants={fadeUpVariants} className="space-y-6">
          {/* Additional Details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Details</h2>
            <div className="space-y-3">
              {client.client_type && (
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Client Type</p>
                    <p className="text-sm font-medium capitalize">{client.client_type}</p>
                  </div>
                </div>
              )}
              {client.client_source && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Source</p>
                    <p className="text-sm font-medium capitalize">{client.client_source}</p>
                  </div>
                </div>
              )}
              {(client.city || client.country) && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">
                      {[client.city, client.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Added</p>
                  <p className="text-sm font-medium">{formatDate(client.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {client.tags && client.tags.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {client.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {client.notes}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setEditModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-x-4 top-[2%] z-50 mx-auto max-w-2xl max-h-[96vh] overflow-auto rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur px-6 py-4">
                <h2 className="text-xl font-semibold text-foreground">Edit Client</h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <ClientForm
                  client={client}
                  onSubmit={handleEditSubmit}
                  onCancel={() => setEditModalOpen(false)}
                  isLoading={updateClient.isPending}
                  error={formError}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
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
                  <h3 className="mb-2 text-center text-lg font-semibold">Delete Client</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Are you sure you want to delete &ldquo;{client.client_name}&rdquo;? This will also delete all associated projects and credentials.
                  </p>
                </div>
                <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeleteDialogOpen(false)}
                    disabled={deleteClient.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDelete}
                    disabled={deleteClient.isPending}
                  >
                    {deleteClient.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
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
