'use client';

// ============================================
// ClientFlow CRM - Client List Component
// Displays paginated list of clients with search/filter
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainerVariants, fadeUpVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { ClientCard } from './ClientCard';
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
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react';

interface ClientListProps {
  /** Callback when add client is clicked */
  onAddClient: () => void;
  /** Callback when edit client is clicked */
  onEditClient: (client: Client) => void;
}

export function ClientList({ onAddClient, onEditClient }: ClientListProps) {
  // State for search, filters, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<ClientType[]>([]);
  const [sortField, setSortField] = useState<ClientSortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    pageSize: 12,
  });

  // Mutations
  const deleteClient = useDeleteClient();
  const archiveClient = useArchiveClient();

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

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

  const handleArchive = useCallback(async (client: Client) => {
    await archiveClient.mutateAsync(client.id);
  }, [archiveClient]);

  const handleSort = useCallback((field: ClientSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  }, [sortField, sortOrder]);

  const toggleStatusFilter = useCallback((status: ClientStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter([]);
    setTypeFilter([]);
    setPage(1);
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClient={onAddClient}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          statusFilter={statusFilter}
          onToggleStatusFilter={toggleStatusFilter}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClient={onAddClient}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          statusFilter={statusFilter}
          onToggleStatusFilter={toggleStatusFilter}
        />
        <EmptyState
          title="Failed to load clients"
          description={error?.message || 'An error occurred while loading clients.'}
          icon={Users}
          actionLabel="Try again"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const clients = clientsData?.data || [];
  const totalPages = clientsData?.totalPages || 1;
  const total = clientsData?.total || 0;

  // Render empty state
  if (clients.length === 0 && !debouncedSearch && statusFilter.length === 0) {
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClient={onAddClient}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          statusFilter={statusFilter}
          onToggleStatusFilter={toggleStatusFilter}
        />
        <EmptyState
          title="No clients yet"
          description="Start by adding your first client to manage their projects and information."
          icon={Users}
          actionLabel="Add Your First Client"
          onAction={onAddClient}
        />
      </div>
    );
  }

  // Render no search results
  if (clients.length === 0) {
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClient={onAddClient}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          statusFilter={statusFilter}
          onToggleStatusFilter={toggleStatusFilter}
        />
        <EmptyState
          title="No clients found"
          description="Try adjusting your search or filter criteria."
          icon={Search}
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClient={onAddClient}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        statusFilter={statusFilter}
        onToggleStatusFilter={toggleStatusFilter}
        totalCount={total}
      />

      {/* Client Grid */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className={
          viewMode === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'space-y-3'
        }
      >
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={onEditClient}
            onDelete={handleDelete}
            onArchive={handleArchive}
          />
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between pt-4"
        >
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 12 + 1} to {Math.min(page * 12, total)} of {total} clients
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
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
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

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={handleCancelDelete}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Dialog */}
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform"
            >
              <div className="mx-4 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
                <div className="p-6">
                  {/* Icon */}
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-center text-lg font-semibold text-foreground">
                    Delete Client
                  </h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Are you sure you want to delete &ldquo;{clientToDelete?.client_name}&rdquo;? 
                    This action cannot be undone and will also delete all associated projects.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancelDelete}
                    disabled={deleteClient.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleConfirmDelete}
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
    </div>
  );
}

// ============================================
// List Header Component (Internal)
// ============================================

interface ListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClient: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortField: ClientSortField;
  sortOrder: SortOrder;
  onSort: (field: ClientSortField) => void;
  statusFilter: ClientStatus[];
  onToggleStatusFilter: (status: ClientStatus) => void;
  totalCount?: number;
}

function ListHeader({
  searchQuery,
  onSearchChange,
  onAddClient,
  viewMode,
  onViewModeChange,
  sortField,
  sortOrder,
  onSort,
  statusFilter,
  onToggleStatusFilter,
  totalCount,
}: ListHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top row: Search and Add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Add button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onAddClient}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </motion.div>
      </div>

      {/* Bottom row: Filters, Sort, View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          {(['active', 'inactive', 'archived'] as ClientStatus[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter.includes(status) ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToggleStatusFilter(status)}
              className="h-7 text-xs"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <select
            value={sortField}
            onChange={(e) => onSort(e.target.value as ClientSortField)}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="created_at">Date added</option>
            <option value="client_name">Name</option>
            <option value="project_count">Projects</option>
            <option value="total_revenue">Revenue</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onSort(sortField)}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>

          {/* View toggle */}
          <div className="flex rounded-md border border-input">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0 rounded-r-none"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0 rounded-l-none"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Count display */}
          {totalCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              {totalCount} client{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
