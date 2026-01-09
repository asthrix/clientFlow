'use client';

// ============================================
// ClientFlow CRM - Project List Component  
// Redesigned to match ClientList with stats, table layout
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariants, modalVariants, overlayVariants } from '@/lib/animations';
import Link from 'next/link';
import { 
  EmptyState, 
  CardSkeleton,
  StatusBadge,
} from '@/components/shared';
import { useProjects } from '@/hooks/queries/useProjects';
import { useDeleteProject } from '@/hooks/mutations/useProjectMutations';
import { useDebounce } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Project, ProjectFilters, ProjectSortField, SortOrder, ProjectStatus, DeliveryStatus } from '@/types';
import {
  Search,
  Plus,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
  DollarSign,
  Clock,
  CheckCircle,
  SortAsc,
  SortDesc,
} from 'lucide-react';

interface ProjectListProps {
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  clientId?: string;
}

// Format currency
const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Status config
const statusConfig: Record<ProjectStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
  planning: { variant: 'info', label: 'Planning' },
  in_progress: { variant: 'warning', label: 'In Progress' },
  under_review: { variant: 'info', label: 'Review' },
  pending_feedback: { variant: 'warning', label: 'Pending' },
  completed: { variant: 'success', label: 'Completed' },
  on_hold: { variant: 'default', label: 'On Hold' },
  cancelled: { variant: 'error', label: 'Cancelled' },
};

export function ProjectList({ onAddProject, onEditProject, clientId }: ProjectListProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus[]>([]);
  const [sortField, setSortField] = useState<ProjectSortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Build filters
  const filters: ProjectFilters = useMemo(() => ({
    search: debouncedSearch || undefined,
    status: statusFilter.length > 0 ? statusFilter : undefined,
    client_id: clientId,
  }), [debouncedSearch, statusFilter, clientId]);

  // Fetch projects
  const {
    data: projectsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProjects({
    filters,
    sort: { field: sortField, order: sortOrder },
    page,
    pageSize: 20,
  });

  // Mutations
  const deleteProject = useDeleteProject();

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const projects = projectsData?.data || [];
    const totalProjects = projectsData?.total || 0;
    const activeProjects = projects.filter(p => p.status === 'in_progress').length;
    const totalValue = projects.reduce((sum, p) => sum + (p.total_cost || 0), 0);
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    return { totalProjects, activeProjects, totalValue, completedProjects };
  }, [projectsData]);

  // Handlers
  const handleDelete = useCallback((project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (projectToDelete) {
      await deleteProject.mutateAsync(projectToDelete.id);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  }, [projectToDelete, deleteProject]);

  const handleSort = useCallback((field: ProjectSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  }, [sortField, sortOrder]);

  const toggleStatusFilter = useCallback((status: ProjectStatus) => {
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
    setPage(1);
  }, []);

  // Format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="h-10 w-full sm:w-64 bg-muted animate-pulse rounded" />
          <div className="h-10 w-full sm:w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} className="h-20" />)}
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded mb-2" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <EmptyState
        title="Failed to load projects"
        description={error?.message || 'An error occurred while loading projects.'}
        icon={FolderKanban}
        actionLabel="Try again"
        onAction={() => refetch()}
      />
    );
  }

  const projects = projectsData?.data || [];
  const totalPages = projectsData?.totalPages || 1;
  const total = projectsData?.total || 0;

  // Empty state
  if (projects.length === 0 && !debouncedSearch && statusFilter.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={onAddProject} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
        <EmptyState
          title="No projects yet"
          description="Start by creating your first project to track deliverables and progress."
          icon={FolderKanban}
          actionLabel="Create Your First Project"
          onAction={onAddProject}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Header with Search & Add */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onAddProject} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Summary Stats */}
      <motion.div
        variants={fadeUpVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      >
        <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{summaryStats.totalProjects}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-warning" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-warning">{summaryStats.activeProjects}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-500">{summaryStats.completedProjects}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Value</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(summaryStats.totalValue)}</p>
        </div>
      </motion.div>

      {/* Filters & Sort Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          {(['planning', 'in_progress', 'completed', 'on_hold'] as ProjectStatus[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter.includes(status) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleStatusFilter(status)}
              className="h-7 text-xs"
            >
              {statusConfig[status].label}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={sortField}
            onChange={(e) => handleSort(e.target.value as ProjectSortField)}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="created_at">Date added</option>
            <option value="project_name">Name</option>
            <option value="total_cost">Value</option>
            <option value="progress_percentage">Progress</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Project Table */}
      <motion.div
        variants={fadeUpVariants}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        {/* Table Header - Hidden on mobile */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
          <div className="col-span-4">Project</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-center">Progress</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Value</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {projects.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No projects found. Try adjusting your search.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            projects.map((project) => {
              const status = statusConfig[project.status] || statusConfig.planning;
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block sm:grid sm:grid-cols-12 sm:gap-4 px-4 py-4 sm:items-center hover:bg-muted/50 transition-colors"
                >
                  {/* Project Info */}
                  <div className="sm:col-span-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{project.project_name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {project.client_name || 'No client'}
                      </p>
                    </div>
                  </div>

                  {/* Mobile: Status, Progress, Value inline */}
                  <div className="flex items-center justify-between mt-3 sm:hidden">
                    <StatusBadge variant={status.variant}>{status.label}</StatusBadge>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">{project.progress_percentage || 0}%</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(project.total_cost || 0, project.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop: Status */}
                  <div className="hidden sm:block col-span-2">
                    <StatusBadge variant={status.variant}>{status.label}</StatusBadge>
                  </div>

                  {/* Desktop: Progress */}
                  <div className="hidden sm:flex col-span-2 items-center gap-2 justify-center">
                    <div className="flex-1 max-w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${project.progress_percentage || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{project.progress_percentage || 0}%</span>
                  </div>

                  {/* Desktop: Date */}
                  <div className="hidden sm:block col-span-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(project.start_date)}
                    </span>
                  </div>

                  {/* Desktop: Value */}
                  <div className="hidden sm:block col-span-2 text-right">
                    <span className="font-semibold text-primary">
                      {formatCurrency(project.total_cost || 0, project.currency)}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer with count */}
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Showing {projects.length} of {total} project{total !== 1 ? 's' : ''}
          </p>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 sm:ml-1" />
            </Button>
          </div>
        </motion.div>
      )}

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
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform"
            >
              <div className="mx-4 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
                <div className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="mb-2 text-center text-lg font-semibold text-foreground">
                    Delete Project
                  </h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Are you sure you want to delete &ldquo;{projectToDelete?.project_name}&rdquo;? 
                    This will also delete all associated credentials.
                  </p>
                </div>
                <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeleteDialogOpen(false)}
                    disabled={deleteProject.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleConfirmDelete}
                    disabled={deleteProject.isPending}
                  >
                    {deleteProject.isPending ? (
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
