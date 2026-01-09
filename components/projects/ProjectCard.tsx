'use client';

// ============================================
// ClientFlow CRM - Project Card Component
// Displays project information in a card format
// ============================================

import { motion } from 'framer-motion';
import { cardVariants } from '@/lib/animations';
import { StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import type { Project, ProjectStatus, DeliveryStatus, PaymentStatus } from '@/types';
import {
  ExternalLink,
  Calendar,
  DollarSign,
  Pencil,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  // Status badge configurations - aligned with ProjectStatus enum
  const statusConfig: Record<ProjectStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    planning: { variant: 'info', label: 'Planning' },
    in_progress: { variant: 'warning', label: 'In Progress' },
    under_review: { variant: 'info', label: 'Under Review' },
    pending_feedback: { variant: 'warning', label: 'Pending Feedback' },
    on_hold: { variant: 'default', label: 'On Hold' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'error', label: 'Cancelled' },
  };

  // Aligned with DeliveryStatus enum
  const deliveryConfig: Record<DeliveryStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    not_started: { variant: 'default', label: 'Not Started' },
    in_development: { variant: 'info', label: 'In Development' },
    testing: { variant: 'warning', label: 'Testing' },
    deployed: { variant: 'success', label: 'Deployed' },
    delivered: { variant: 'success', label: 'Delivered' },
  };

  // Aligned with PaymentStatus enum
  const paymentConfig: Record<PaymentStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    unpaid: { variant: 'error', label: 'Unpaid' },
    partially_paid: { variant: 'warning', label: 'Partial' },
    paid: { variant: 'success', label: 'Paid' },
    overdue: { variant: 'error', label: 'Overdue' },
  };

  const currentStatus = statusConfig[project.status] || statusConfig.planning;
  const currentDelivery = deliveryConfig[project.delivery_status] || deliveryConfig.not_started;
  const currentPayment = paymentConfig[project.payment_status] || paymentConfig.unpaid;

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: project.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle action button clicks without triggering card navigation
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      >
        {/* Background decoration */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Click indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="relative pr-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {project.project_name}
              </span>
              {project.client_name && (
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {project.client_name}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => handleActionClick(e, () => onEdit(project))}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {project.live_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(project.live_url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => handleActionClick(e, () => onDelete(project))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Status badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <StatusBadge variant={currentStatus.variant} size="sm">
              {currentStatus.label}
            </StatusBadge>
            <StatusBadge variant={currentDelivery.variant} size="sm">
              {currentDelivery.label}
            </StatusBadge>
            <StatusBadge variant={currentPayment.variant} size="sm">
              {currentPayment.label}
            </StatusBadge>
          </div>

          {/* Progress bar */}
          {project.status === 'in_progress' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress_percentage || 0}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress_percentage || 0}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          {/* Details */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {/* Financial info */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">
                {formatCurrency(project.total_cost)}
              </span>
            </div>

            {/* Expected completion date */}
            {project.expected_completion_date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{formatDate(project.expected_completion_date)}</span>
              </div>
            )}
          </div>

          {/* Technology stack */}
          {project.technology_stack && project.technology_stack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {project.technology_stack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
              {project.technology_stack.length > 4 && (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  +{project.technology_stack.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
