'use client';

// ============================================
// ClientFlow CRM - Client Detail Page
// Clean minimal design based on reference
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeUpVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { EmptyState, CardSkeleton, StatusBadge, Modal } from '@/components/shared';
import { ClientForm } from '@/components/clients';
import { useClient } from '@/hooks/queries/useClients';
import { useProjectsByClient } from '@/hooks/queries/useProjects';
import { useDeleteClient, useUpdateClient } from '@/hooks/mutations/useClientMutations';
import { Button } from '@/components/ui/button';
import type { Client, ProjectStatus, UpdateClientDTO } from '@/types';
import { type ClientFormData, transformFormToDTO } from '@/lib/validations/client';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
  FolderKanban,
  ChevronRight,
  X,
  Calendar,
  DollarSign,
  Check,
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
  const updateClient = useUpdateClient();

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate totals
  const totals = useMemo(() => {
    if (!projects) return { totalSpend: 0, projectCount: 0 };
    const totalSpend = projects.reduce((sum, p) => sum + (p.total_cost || 0), 0);
    return { totalSpend, projectCount: projects.length };
  }, [projects]);

  // Project status config
  const statusConfig: Record<ProjectStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    planning: { variant: 'info', label: 'Planning' },
    in_progress: { variant: 'warning', label: 'Active' },
    under_review: { variant: 'info', label: 'Review' },
    pending_feedback: { variant: 'warning', label: 'Pending' },
    completed: { variant: 'success', label: 'Completed' },
    on_hold: { variant: 'default', label: 'On Hold' },
    cancelled: { variant: 'error', label: 'Cancelled' },
  };

  // Handlers
  const handleDelete = useCallback(async () => {
    await deleteClient.mutateAsync(clientId);
    router.push('/clients');
  }, [clientId, deleteClient, router]);

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  // Generate avatar color
  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <CardSkeleton className="h-32" />
        <CardSkeleton className="h-48" />
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

  // Separate paid and unpaid projects for payment history
  const paidProjects = projects?.filter(p => p.payment_status === 'paid') || [];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="lg:max-w-7xl max-w-4xl mx-auto space-y-6"
    >
      {/* Back Link */}
      <Link
        href="/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      {/* Header Card */}
      <motion.div variants={fadeUpVariants} className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full text-white text-lg sm:text-xl font-semibold shrink-0 ${getAvatarColor(client.client_name)}`}>
              {getInitials(client.client_name)}
            </div>
            
            {/* Name & Contact */}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{client.client_name}</h1>
              {client.company_name && (
                <p className="text-muted-foreground text-sm sm:text-base truncate">{client.company_name}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-none">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </a>
                {client.phone && (
                  <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 shrink-0" />
                    {client.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex sm:block items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Client Since</p>
            <p className="text-base sm:text-lg font-semibold text-foreground sm:mt-1">{formatDate(client.created_at)}</p>
          </div>
          <div className="flex sm:block items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Projects</p>
            <p className="text-base sm:text-lg font-semibold text-primary sm:mt-1">{totals.projectCount}</p>
          </div>
          <div className="flex sm:block items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Spend</p>
            <p className="text-base sm:text-lg font-semibold text-emerald-500 sm:mt-1">{formatCurrency(totals.totalSpend)}</p>
          </div>
        </div>
      </motion.div>

      {/* Two Column Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects List */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Projects</h2>
            </div>
            
            {projectsLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="divide-y divide-border">
                {projects.map((project) => {
                  const status = statusConfig[project.status] || statusConfig.planning;
                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{project.project_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StatusBadge variant={status.variant}>{status.label}</StatusBadge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(project.start_date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{formatCurrency(project.total_cost || 0)}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FolderKanban className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">No projects yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment History */}
        <motion.div variants={fadeUpVariants}>
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Payment History</h2>
            </div>
            
            {paidProjects.length > 0 ? (
              <>
                <div className="divide-y divide-border">
                  {paidProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-foreground">{project.project_name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(project.actual_completion_date || project.start_date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium text-emerald-500">{formatCurrency(project.total_cost || 0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-emerald-500">{formatCurrency(totals.totalSpend)}</span>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <DollarSign className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">No payments yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Client"
        size="lg"
      >
        <ClientForm
          client={client}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditModalOpen(false)}
          isLoading={updateClient.isPending}
          error={formError}
        />
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
                  <h3 className="mb-2 text-center text-lg font-semibold">Delete Client</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Delete &ldquo;{client.client_name}&rdquo;? This removes all associated projects.
                  </p>
                </div>
                <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteClient.isPending}>
                    {deleteClient.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
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
