'use client';

// ============================================
// ClientFlow CRM - Recent Projects Widget
// Shows latest projects with status
// ============================================

import { motion } from 'framer-motion';
import { fadeUpVariants } from '@/lib/animations';
import { StatusBadge } from '@/components/shared';
import { useRecentProjects } from '@/hooks/queries/useProjects';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { ProjectStatus, PaymentStatus } from '@/types';
import { 
  FolderKanban, 
  ArrowRight,
  Calendar,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export function RecentProjectsWidget() {
  const { data: projects, isLoading, isError, error } = useRecentProjects(5);

  // Status badge variant mapping
  const statusVariant: Record<ProjectStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    planning: 'info',
    in_progress: 'warning',
    under_review: 'info',
    pending_feedback: 'warning',
    completed: 'success',
    on_hold: 'default',
    cancelled: 'error',
  };

  const paymentVariant: Record<PaymentStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    unpaid: 'error',
    partially_paid: 'warning',
    paid: 'success',
    overdue: 'error',
  };

  // Format currency
  const formatCurrency = (amount: number | undefined, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className="rounded-xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <FolderKanban className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="font-semibold text-foreground">Recent Projects</h3>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects" className="flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border border-border p-3">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/3 rounded bg-muted" />
                <div className="mt-3 flex gap-2">
                  <div className="h-5 w-16 rounded bg-muted" />
                  <div className="h-5 w-16 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-sm text-destructive py-4">
            <AlertCircle className="h-4 w-4" />
            <span>{error?.message || 'Failed to load projects'}</span>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                {/* Project name and client */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">
                      {project.project_name}
                    </p>
                    {project.client_name && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {project.client_name}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-medium text-foreground">
                    {formatCurrency(project.total_cost, project.currency)}
                  </span>
                </div>

                {/* Progress bar */}
                {project.status === 'in_progress' && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress_percentage || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${project.progress_percentage || 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Status badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <StatusBadge 
                    variant={statusVariant[project.status]} 
                    size="sm"
                  >
                    {project.status.replace('_', ' ')}
                  </StatusBadge>
                  <StatusBadge 
                    variant={paymentVariant[project.payment_status]} 
                    size="sm"
                  >
                    {project.payment_status.replace('_', ' ')}
                  </StatusBadge>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <FolderKanban className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No projects yet</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link href="/projects">Create your first project</Link>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
