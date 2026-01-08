'use client';

// ============================================
// ClientFlow CRM - StatusBadge Component
// Animated status indicator badge
// ============================================

import { motion } from 'framer-motion';
import { badgeVariants, pulseVariants } from '@/lib/animations';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariantsClass = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground',
        success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariantsClass> {
  /** Badge label */
  children: React.ReactNode;
  /** Show pulse animation (for active/in-progress states) */
  pulse?: boolean;
  /** Show dot indicator */
  showDot?: boolean;
  /** Additional className */
  className?: string;
}

export function StatusBadge({
  children,
  variant,
  size,
  pulse = false,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const dotColorMap = {
    default: 'bg-secondary-foreground/50',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <motion.span
      variants={badgeVariants}
      initial="initial"
      animate="animate"
      className={cn(statusBadgeVariantsClass({ variant, size }), className)}
    >
      {showDot && (
        <motion.span
          variants={pulse ? pulseVariants : undefined}
          animate={pulse ? 'animate' : undefined}
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            dotColorMap[variant || 'default']
          )}
        />
      )}
      {children}
    </motion.span>
  );
}

// Predefined status badges for common use cases
export function ProjectStatusBadge({ 
  status 
}: { 
  status: 'planning' | 'in_progress' | 'under_review' | 'pending_feedback' | 'completed' | 'on_hold' | 'cancelled';
}) {
  const config = {
    planning: { variant: 'info' as const, label: 'Planning', pulse: false },
    in_progress: { variant: 'warning' as const, label: 'In Progress', pulse: true },
    under_review: { variant: 'purple' as const, label: 'Under Review', pulse: false },
    pending_feedback: { variant: 'warning' as const, label: 'Pending Feedback', pulse: true },
    completed: { variant: 'success' as const, label: 'Completed', pulse: false },
    on_hold: { variant: 'default' as const, label: 'On Hold', pulse: false },
    cancelled: { variant: 'error' as const, label: 'Cancelled', pulse: false },
  };

  const { variant, label, pulse } = config[status];

  return (
    <StatusBadge variant={variant} pulse={pulse}>
      {label}
    </StatusBadge>
  );
}

export function PaymentStatusBadge({
  status,
}: {
  status: 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
}) {
  const config = {
    unpaid: { variant: 'error' as const, label: 'Unpaid' },
    partially_paid: { variant: 'warning' as const, label: 'Partial' },
    paid: { variant: 'success' as const, label: 'Paid' },
    overdue: { variant: 'error' as const, label: 'Overdue' },
  };

  const { variant, label } = config[status];

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}

export function ClientStatusBadge({
  status,
}: {
  status: 'active' | 'inactive' | 'archived';
}) {
  const config = {
    active: { variant: 'success' as const, label: 'Active' },
    inactive: { variant: 'default' as const, label: 'Inactive' },
    archived: { variant: 'default' as const, label: 'Archived' },
  };

  const { variant, label } = config[status];

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}
