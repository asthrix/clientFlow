'use client';

// ============================================
// ClientFlow CRM - Payment Overview Widget
// Shows outstanding balances and payment summary
// ============================================

import { motion } from 'framer-motion';
import { fadeUpVariants } from '@/lib/animations';
import { useProjectStats } from '@/hooks/queries/useProjects';
import { 
  DollarSign, 
  AlertCircle,
  TrendingUp,
  Wallet,
  Clock,
} from 'lucide-react';

export function PaymentOverviewWidget() {
  const { data: stats, isLoading, isError } = useProjectStats();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate collected amount
  const totalRevenue = stats?.totalRevenue || 0;
  const outstanding = stats?.outstandingBalance || 0;
  const collected = totalRevenue - outstanding;
  const collectionRate = totalRevenue > 0 ? ((collected / totalRevenue) * 100).toFixed(0) : '0';

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className="rounded-xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
          <DollarSign className="h-4 w-4 text-green-500" />
        </div>
        <h3 className="font-semibold text-foreground">Payment Overview</h3>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 rounded bg-muted" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 rounded bg-muted" />
              <div className="h-16 rounded bg-muted" />
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-sm text-destructive py-4">
            <AlertCircle className="h-4 w-4" />
            <span>Failed to load payment data</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total Revenue */}
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(totalRevenue)}
              </p>
            </div>

            {/* Collection progress bar */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Collection Rate</span>
                <span className="font-medium text-green-600">{collectionRate}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${collectionRate}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-500/10 p-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Wallet className="h-4 w-4" />
                  <span className="text-xs font-medium">Collected</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  {formatCurrency(collected)}
                </p>
              </div>

              <div className="rounded-lg bg-amber-500/10 p-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium">Outstanding</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  {formatCurrency(outstanding)}
                </p>
              </div>
            </div>

            {/* Project breakdown */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Projects by Status
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">In Progress</span>
                  <span className="font-medium">{stats?.inProgress || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Planning</span>
                  <span className="font-medium">{stats?.planning || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">{stats?.completed || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">On Hold</span>
                  <span className="font-medium">{stats?.onHold || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
