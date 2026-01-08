'use client';

// ============================================
// ClientFlow CRM - Project List Component  
// Displays paginated list of projects with search/filter
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainerVariants, fadeUpVariants, modalVariants, overlayVariants } from '@/lib/animations';
import { ProjectCard } from './ProjectCard';
import { 
  EmptyState, 
  CardSkeleton,
} from '@/components/shared';
import { useProjects } from '@/hooks/queries/useProjects';
import { useDeleteProject } from '@/hooks/mutations/useProjectMutations';
import { useDebounce } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Project, ProjectFilters, ProjectSortField, SortOrder, ProjectStatus } from '@/types';
import {
  Search,
  Plus,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface ProjectListProps {
  /** Callback when add project is clicked */
  onAddProject: () => void;
  /** Callback when edit project is clicked */
  onEditProject: (project: Project) => void;
  /** Optional client ID to filter projects by */
  clientId?: string;
}

export function ProjectList({ onAddProject, onEditProject, clientId }: ProjectListProps) {
  // State for search, filters, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus[]>([]);
  const [sortField, setSortField] = useState<ProjectSortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Build filters object
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
    pageSize: 12,
  });

  // Mutations
  const deleteProject = useDeleteProject();

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  }, []);

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

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddProject={onAddProject}
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
          onAddProject={onAddProject}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          statusFilter={statusFilter}
          onToggleStatusFilter={toggleStatusFilter}
        />
        <EmptyState
          title="Failed to load projects"
          description={error?.message || 'An error occurred while loading projects.'}
          icon={FolderKanban}
          actionLabel="Try again"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const projects = projectsData?.data || [];
  const totalPages = projectsData?.totalPages || 1;
  const total = projectsData?.total || 0;

  // Render empty state
  if (projects.length === 0 && !debouncedSearch && statusFilter.length === 0) {
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddProject={onAddProject}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          statusFilter={statusFilter}
          onToggleStatusFilter={toggleStatusFilter}
        />
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

  // Render no search results
  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <ListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddProject={onAddProject}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          statusFilter={statusFilter}
          onToggleStatusFilter={toggleStatusFilter}
        />
        <EmptyState
          title="No projects found"
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
        onAddProject={onAddProject}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        statusFilter={statusFilter}
        onToggleStatusFilter={toggleStatusFilter}
        totalCount={total}
      />

      {/* Project Grid */}
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
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={onEditProject}
            onDelete={handleDelete}
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
            Showing {(page - 1) * 12 + 1} to {Math.min(page * 12, total)} of {total} projects
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
                    Delete Project
                  </h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Are you sure you want to delete &ldquo;{projectToDelete?.project_name}&rdquo;? 
                    This will also delete all associated domains, hosting, and payment records.
                  </p>
                </div>
                <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancelDelete}
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

// ============================================
// List Header Component (Internal)
// ============================================

interface ListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddProject: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortField: ProjectSortField;
  sortOrder: SortOrder;
  onSort: (field: ProjectSortField) => void;
  statusFilter: ProjectStatus[];
  onToggleStatusFilter: (status: ProjectStatus) => void;
  totalCount?: number;
}

function ListHeader({
  searchQuery,
  onSearchChange,
  onAddProject,
  viewMode,
  onViewModeChange,
  sortField,
  sortOrder,
  onSort,
  statusFilter,
  onToggleStatusFilter,
  totalCount,
}: ListHeaderProps) {
  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: 'planning', label: 'Planning' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-4">
      {/* Top row: Search and Add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onAddProject}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </motion.div>
      </div>

      {/* Bottom row: Filters, Sort, View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-sm text-muted-foreground shrink-0">Status:</span>
          {statusOptions.map(({ value, label }) => (
            <Button
              key={value}
              variant={statusFilter.includes(value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToggleStatusFilter(value)}
              className="h-7 text-xs shrink-0"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <select
            value={sortField}
            onChange={(e) => onSort(e.target.value as ProjectSortField)}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="created_at">Date added</option>
            <option value="project_name">Name</option>
            <option value="deadline">Deadline</option>
            <option value="total_cost">Budget</option>
            <option value="progress_percentage">Progress</option>
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
              {totalCount} project{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
