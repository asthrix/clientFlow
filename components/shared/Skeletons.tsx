'use client';

// ============================================
// ClientFlow CRM - Skeleton Components
// Loading placeholders with shimmer effect
// ============================================

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

// Base skeleton with shimmer
interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      style={style}
      className={cn(
        'animate-pulse rounded-md bg-muted/70',
        'relative overflow-hidden',
        // Shimmer effect
        'before:absolute before:inset-0',
        'before:-translate-x-full before:animate-[shimmer_2s_infinite]',
        'before:bg-linear-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className
      )}
    />
  );
}

// Card skeleton for dashboard cards
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border border-border bg-card p-6',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-3 w-20" />
    </motion.div>
  );
}

// Stats card skeleton
export function StatsCardSkeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border border-border bg-card p-6',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </motion.div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className={cn('h-4', i === 0 ? 'w-32' : 'w-20')} />
        </td>
      ))}
    </tr>
  );
}

// Table skeleton
export function TableSkeleton({ 
  rows = 5, 
  columns = 5,
  className,
}: { 
  rows?: number; 
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border', className)}>
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-card">
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// List item skeleton
export function ListItemSkeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center gap-4 rounded-lg border border-border bg-card p-4',
        className
      )}
    >
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </motion.div>
  );
}

// List skeleton
export function ListSkeleton({ 
  items = 5,
  className,
}: { 
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <ListItemSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

// Project card skeleton (for grid view)
export function ProjectCardSkeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'rounded-xl border border-border bg-card p-5',
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="mb-4 h-3 w-full" />
      <Skeleton className="mb-4 h-3 w-3/4" />
      {/* Progress bar */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </motion.div>
  );
}

// Chart skeleton
export function ChartSkeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'rounded-xl border border-border bg-card p-6',
        className
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="flex h-64 items-end justify-between gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
