'use client';

// ============================================
// ClientFlow CRM - Credential List Component
// Displays and filters credentials list
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainerVariants, fadeUpVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { CredentialCard } from './CredentialCard';
import { EmptyState, CardSkeleton } from '@/components/shared';
import { useCredentials } from '@/hooks/queries/useCredentials';
import { useDeleteCredential } from '@/hooks/mutations/useCredentialMutations';
import { useDebounce } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Credential, CredentialFilters, CredentialType } from '@/types';
import {
  Search,
  Plus,
  Key,
  AlertTriangle,
  Loader2,
  Grid3X3,
  List,
} from 'lucide-react';

interface CredentialListProps {
  onAddCredential: () => void;
  onEditCredential: (credential: Credential) => void;
  projectId?: string; // Optional: filter by project
}

const credentialTypeOptions: { value: CredentialType; label: string }[] = [
  { value: 'domain', label: 'Domain' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'database', label: 'Database' },
  { value: 'ftp', label: 'FTP' },
  { value: 'email', label: 'Email' },
  { value: 'cms', label: 'CMS' },
  { value: 'api', label: 'API' },
  { value: 'ssh', label: 'SSH' },
  { value: 'other', label: 'Other' },
];

export function CredentialList({ onAddCredential, onEditCredential, projectId }: CredentialListProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<CredentialType[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Build filters
  const filters: CredentialFilters = useMemo(() => ({
    search: debouncedSearch || undefined,
    credential_type: typeFilter.length > 0 ? typeFilter : undefined,
    project_id: projectId,
  }), [debouncedSearch, typeFilter, projectId]);

  // Fetch credentials
  const { data: credentials, isLoading, isError, error, refetch } = useCredentials({ filters });

  // Delete mutation
  const deleteCredential = useDeleteCredential();

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [credentialToDelete, setCredentialToDelete] = useState<Credential | null>(null);

  // Handlers
  const handleDelete = useCallback((credential: Credential) => {
    setCredentialToDelete(credential);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (credentialToDelete) {
      await deleteCredential.mutateAsync(credentialToDelete.id);
      setDeleteDialogOpen(false);
      setCredentialToDelete(null);
    }
  }, [credentialToDelete, deleteCredential]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setCredentialToDelete(null);
  }, []);

  const toggleTypeFilter = useCallback((type: CredentialType) => {
    setTypeFilter(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setTypeFilter([]);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddCredential={onAddCredential}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          typeFilter={typeFilter}
          onToggleTypeFilter={toggleTypeFilter}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddCredential={onAddCredential}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          typeFilter={typeFilter}
          onToggleTypeFilter={toggleTypeFilter}
        />
        <EmptyState
          title="Failed to load credentials"
          description={error?.message || 'An error occurred'}
          icon={Key}
          actionLabel="Try again"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  // Empty states
  if (!credentials || credentials.length === 0) {
    const hasFilters = debouncedSearch || typeFilter.length > 0;
    
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddCredential={onAddCredential}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          typeFilter={typeFilter}
          onToggleTypeFilter={toggleTypeFilter}
        />
        <EmptyState
          title={hasFilters ? 'No credentials found' : 'No credentials yet'}
          description={hasFilters ? 'Try adjusting your search or filters' : 'Store your passwords, API keys, and access credentials securely'}
          icon={Key}
          actionLabel={hasFilters ? 'Clear filters' : 'Add Your First Credential'}
          onAction={hasFilters ? clearFilters : onAddCredential}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddCredential={onAddCredential}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        typeFilter={typeFilter}
        onToggleTypeFilter={toggleTypeFilter}
        totalCount={credentials.length}
      />

      {/* Credentials Grid */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className={
          viewMode === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'space-y-3'
        }
      >
        {credentials.map((credential) => (
          <CredentialCard
            key={credential.id}
            credential={credential}
            onEdit={onEditCredential}
            onDelete={handleDelete}
          />
        ))}
      </motion.div>

      {/* Delete Confirmation Dialog */}
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
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform"
            >
              <div className="mx-4 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
                <div className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="mb-2 text-center text-lg font-semibold text-foreground">
                    Delete Credential
                  </h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Are you sure you want to delete the credential for &ldquo;{credentialToDelete?.service_name}&rdquo;? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancelDelete}
                    disabled={deleteCredential.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleConfirmDelete}
                    disabled={deleteCredential.isPending}
                  >
                    {deleteCredential.isPending ? (
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
// List Header Component
// ============================================

interface ListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddCredential: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  typeFilter: CredentialType[];
  onToggleTypeFilter: (type: CredentialType) => void;
  totalCount?: number;
}

function ListHeader({
  searchQuery,
  onSearchChange,
  onAddCredential,
  viewMode,
  onViewModeChange,
  typeFilter,
  onToggleTypeFilter,
  totalCount,
}: ListHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search credentials..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onAddCredential}>
            <Plus className="mr-2 h-4 w-4" />
            Add Credential
          </Button>
        </motion.div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-sm text-muted-foreground shrink-0">Type:</span>
          {credentialTypeOptions.slice(0, 5).map(({ value, label }) => (
            <Button
              key={value}
              variant={typeFilter.includes(value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToggleTypeFilter(value)}
              className="h-7 text-xs shrink-0"
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
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

          {totalCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              {totalCount} credential{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
