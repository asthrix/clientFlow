'use client';

// ============================================
// ClientFlow CRM - Client Detail Page
// View and manage individual client
// ============================================

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeUpVariants, cardVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { PageHeader, StatusBadge, EmptyState, CardSkeleton } from '@/components/shared';
import { ProjectCard } from '@/components/projects';
import { useClient } from '@/hooks/queries/useClients';
import { useProjectsByClient } from '@/hooks/queries/useProjects';
import { useCredentialsByProject } from '@/hooks/queries/useCredentials';
import { useDeleteClient, useArchiveClient } from '@/hooks/mutations/useClientMutations';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { ClientStatus } from '@/types';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Globe,
  MapPin,
  Calendar,
  Pencil,
  Trash2,
  Archive,
  FolderKanban,
  Plus,
  AlertTriangle,
  Loader2,
  ExternalLink,
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

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Status badge config
  const statusConfig: Record<ClientStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    archived: { variant: 'warning', label: 'Archived' },
  };

  // Handlers
  const handleDelete = useCallback(async () => {
    await deleteClient.mutateAsync(clientId);
    router.push('/clients');
  }, [clientId, deleteClient, router]);

  const handleArchive = useCallback(async () => {
    await archiveClient.mutateAsync(clientId);
  }, [clientId, archiveClient]);

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

  const currentStatus = statusConfig[client.status] || statusConfig.active;

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
            <Link href="/clients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{client.client_name}</h1>
              <StatusBadge variant={currentStatus.variant}>
                {currentStatus.label}
              </StatusBadge>
            </div>
            {client.company_name && (
              <p className="text-muted-foreground">{client.company_name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/clients/${clientId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          {client.status !== 'archived' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleArchive}
              disabled={archiveClient.isPending}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          )}
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

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <motion.div
          variants={fadeUpVariants}
          className="lg:col-span-2 space-y-6"
        >
          {/* Contact Information */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {client.email && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a 
                      href={`mailto:${client.email}`}
                      className="text-sm font-medium text-foreground hover:text-primary"
                    >
                      {client.email}
                    </a>
                  </div>
                </div>
              )}

              {client.phone && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Phone className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a 
                      href={`tel:${client.phone}`}
                      className="text-sm font-medium text-foreground hover:text-primary"
                    >
                      {client.phone}
                    </a>
                  </div>
                </div>
              )}

              {client.address_line1 && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <MapPin className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium text-foreground">
                      {client.address_line1}
                      {client.city && `, ${client.city}`}
                      {client.country && `, ${client.country}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Projects</h2>
              <Button size="sm" asChild>
                <Link href={`/projects?clientId=${clientId}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Link>
              </Button>
            </div>

            {projectsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <FolderKanban className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No projects yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          variants={fadeUpVariants}
          className="space-y-6"
        >
          {/* Quick Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge variant={currentStatus.variant} size="sm">
                  {currentStatus.label}
                </StatusBadge>
              </div>

              {client.client_source && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <span className="text-sm font-medium capitalize">{client.client_source}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Projects</span>
                <span className="text-sm font-medium">{projects?.length || 0}</span>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Added {formatDate(client.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

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
