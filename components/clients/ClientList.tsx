'use client';

// ============================================
// ClientFlow CRM - Client List Component
// Table-style list with summary stats
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariants, modalVariants, overlayVariants } from '@/lib/animations';
import Link from 'next/link';
import { 
  EmptyState, 
  CardSkeleton,
} from '@/components/shared';
import { useClients } from '@/hooks/queries/useClients';
import { useDeleteClient, useArchiveClient } from '@/hooks/mutations/useClientMutations';
import { useDebounce } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Client, ClientFilters, ClientSortField, SortOrder, ClientStatus, ClientType } from '@/types';
import {
  Search,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
  FolderKanban,
  DollarSign,
} from 'lucide-react';

interface ClientListProps {
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
}

export function ClientList({ onAddClient, onEditClient }: ClientListProps) {
  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<ClientType[]>([]);
  const [sortField, setSortField] = useState<ClientSortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Build filters object
  const filters: ClientFilters = useMemo(() => ({
    search: debouncedSearch || undefined,
    status: statusFilter.length > 0 ? statusFilter : undefined,
    client_type: typeFilter.length > 0 ? typeFilter : undefined,
  }), [debouncedSearch, statusFilter, typeFilter]);

  // Fetch clients
  const {
    data: clientsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useClients({
    filters,
    sort: { field: sortField, order: sortOrder },
    page,
    pageSize: 20,
  });

  // Mutations
  const deleteClient = useDeleteClient();
  const archiveClient = useArchiveClient();

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const clients = clientsData?.data || [];
    const totalClients = clientsData?.total || 0;
    const totalProjects = clients.reduce((sum, c) => sum + (c.project_count || 0), 0);
    const totalRevenue = clients.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
    return { totalClients, totalProjects, totalRevenue };
  }, [clientsData]);

  // Handlers
  const handleDelete = useCallback((client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (clientToDelete) {
      await deleteClient.mutateAsync(clientToDelete.id);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  }, [clientToDelete, deleteClient]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter([]);
    setTypeFilter([]);
    setPage(1);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === 0) return '$0';
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
    const colors = ['bg-primary'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-64 bg-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} className="h-20" />
          ))}
        </div>
        <CardSkeleton className="h-64" />
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <EmptyState
        title="Failed to load clients"
        description={error?.message || 'An error occurred while loading clients.'}
        icon={Users}
        actionLabel="Try again"
        onAction={() => refetch()}
      />
    );
  }

  const clients = clientsData?.data || [];
  const totalPages = clientsData?.totalPages || 1;
  const total = clientsData?.total || 0;

  // Render empty state
  if (clients.length === 0 && !debouncedSearch && statusFilter.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={onAddClient}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
        <EmptyState
          title="No clients yet"
          description="Start by adding your first client to manage their projects."
          icon={Users}
          actionLabel="Add Your First Client"
          onAction={onAddClient}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search & Add */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onAddClient} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Summary Stats */}
      <motion.div
        variants={fadeUpVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        <div className="rounded-xl border border-border bg-card p-3 sm:p-4 flex sm:block items-center justify-between">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Clients</p>
          <p className="text-xl sm:text-2xl font-bold text-primary sm:mt-1">{summaryStats.totalClients}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 sm:p-4 flex sm:block items-center justify-between">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Projects</p>
          <p className="text-xl sm:text-2xl font-bold text-primary sm:mt-1">{summaryStats.totalProjects}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 sm:p-4 flex sm:block items-center justify-between">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-primary sm:mt-1">{formatCurrency(summaryStats.totalRevenue)}</p>
        </div>
      </motion.div>

      {/* Client Table */}
      <motion.div
        variants={fadeUpVariants}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        {/* Table Header - Hidden on mobile */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
          <div className="col-span-5">Client</div>
          <div className="col-span-3 text-center">Projects</div>
          <div className="col-span-4 text-right">Total Spend</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {clients.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No clients found. Try adjusting your search.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            clients.map((client) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="block sm:grid sm:grid-cols-12 sm:gap-4 px-4 py-4 sm:items-center hover:bg-muted/50 transition-colors"
              >
                {/* Client Info */}
                <div className="sm:col-span-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-semibold ${getAvatarColor(client.client_name)}`}>
                    {getInitials(client.client_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{client.client_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                    {client.company_name && (
                      <p className="text-xs text-muted-foreground truncate hidden sm:block">{client.company_name}</p>
                    )}
                  </div>
                </div>

                {/* Mobile: Projects & Spend inline */}
                <div className="flex items-center justify-between mt-2 sm:hidden text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-primary">{client.project_count || 0}</span>
                    {' '}project{(client.project_count || 0) !== 1 ? 's' : ''}
                  </span>
                  {(client.total_revenue || 0) > 0 ? (
                    <span className="font-semibold text-primary">
                      {formatCurrency(client.total_revenue || 0)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">$0</span>
                  )}
                </div>

                {/* Desktop: Projects Count */}
                <div className="hidden sm:block col-span-3 text-center">
                  <span className="text-sm text-foreground">
                    <span className="font-semibold text-primary">{client.project_count || 0}</span>
                    {' '}project{(client.project_count || 0) !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Desktop: Total Spend */}
                <div className="hidden sm:block col-span-4 text-right">
                  {(client.total_revenue || 0) > 0 ? (
                    <span className="font-semibold text-primary">
                      {formatCurrency(client.total_revenue || 0)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">₹0</span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer with count */}
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Showing {clients.length} client{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Delete Dialog */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={handleCancelDelete}
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
                  <h3 className="mb-2 text-center text-lg font-semibold text-foreground">
                    Delete Client
                  </h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Delete &ldquo;{clientToDelete?.client_name}&rdquo;? This removes all projects.
                  </p>
                </div>
                <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
                  <Button variant="outline" className="flex-1" onClick={handleCancelDelete} disabled={deleteClient.isPending}>
                    Cancel
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleConfirmDelete} disabled={deleteClient.isPending}>
                    {deleteClient.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
