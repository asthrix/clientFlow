'use client';

// ============================================
// ClientFlow CRM - Analytics Page
// Revenue, project, and client insights
// ============================================

import { motion } from 'framer-motion';
import { staggerContainerVariants, fadeUpVariants, cardVariants } from '@/lib/animations';
import { PageHeader, CardSkeleton } from '@/components/shared';
import { useClientStats } from '@/hooks/queries/useClients';
import { useProjectStats } from '@/hooks/queries/useProjects';
import { 
  TrendingUp, 
  TrendingDown,
  IndianRupee,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { data: clientStats, isLoading: clientsLoading } = useClientStats();
  const { data: projectStats, isLoading: projectsLoading } = useProjectStats();

  const isLoading = clientsLoading || projectsLoading;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate derived stats
  const totalRevenue = projectStats?.totalRevenue || 0;
  const outstandingBalance = projectStats?.outstandingBalance || 0;
  const collectedAmount = totalRevenue - outstandingBalance;
  const collectionRate = totalRevenue > 0 ? Math.round((collectedAmount / totalRevenue) * 100) : 0;

  const totalProjects = (projectStats?.total || 0);
  const completedProjects = projectStats?.completed || 0;
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Analytics"
          description="Business insights and performance metrics"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <PageHeader
        title="Analytics"
        description="Business insights and performance metrics"
      />

      {/* Key Metrics */}
      <motion.section variants={fadeUpVariants}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <IndianRupee className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </motion.div>

          {/* Collection Rate */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold text-foreground">{collectionRate}%</p>
              </div>
            </div>
          </motion.div>

          {/* Total Clients */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold text-foreground">{clientStats?.total || 0}</p>
              </div>
            </div>
          </motion.div>

          {/* Completion Rate */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <CheckCircle2 className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Project Completion</p>
                <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Project Breakdown */}
      <motion.section variants={fadeUpVariants}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Project Status Breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            label="Planning"
            count={projectStats?.planning || 0}
            color="blue"
            icon={Clock}
          />
          <StatusCard
            label="In Progress"
            count={projectStats?.inProgress || 0}
            color="amber"
            icon={FolderKanban}
          />
          <StatusCard
            label="Completed"
            count={projectStats?.completed || 0}
            color="green"
            icon={CheckCircle2}
          />
          <StatusCard
            label="On Hold"
            count={projectStats?.onHold || 0}
            color="gray"
            icon={AlertTriangle}
          />
        </div>
      </motion.section>

      {/* Financial Summary */}
      <motion.section variants={fadeUpVariants}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Financial Summary</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart Placeholder */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Revenue Overview</h3>
            <div className="space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Total Contract Value</span>
                <span className="font-semibold text-foreground">{formatCurrency(totalRevenue)}</span>
              </div>
              
              {/* Collected */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Collected</span>
                </div>
                <span className="font-semibold text-green-600">{formatCurrency(collectedAmount)}</span>
              </div>
              
              {/* Outstanding */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-amber-500" />
                  <span className="text-muted-foreground">Outstanding</span>
                </div>
                <span className="font-semibold text-amber-600">{formatCurrency(outstandingBalance)}</span>
              </div>

              {/* Collection Progress Bar */}
              <div className="pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Collection Progress</span>
                  <span className="font-medium">{collectionRate}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${collectionRate}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Stats */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Client Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Total Clients</span>
                <span className="font-semibold text-foreground">{clientStats?.total || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                <span className="text-muted-foreground">Active Clients</span>
                <span className="font-semibold text-green-600">{clientStats?.active || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10">
                <span className="text-muted-foreground">Inactive</span>
                <span className="font-semibold text-amber-600">{clientStats?.inactive || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-500/10">
                <span className="text-muted-foreground">Archived</span>
                <span className="font-semibold text-gray-600">{clientStats?.archived || 0}</span>
              </div>

              {/* Client Distribution */}
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Client Distribution</p>
                <div className="flex rounded-full overflow-hidden h-3">
                  {(clientStats?.active || 0) > 0 && (
                    <div 
                      className="bg-green-500" 
                      style={{ 
                        width: `${((clientStats?.active || 0) / (clientStats?.total || 1)) * 100}%` 
                      }} 
                    />
                  )}
                  {(clientStats?.inactive || 0) > 0 && (
                    <div 
                      className="bg-amber-500" 
                      style={{ 
                        width: `${((clientStats?.inactive || 0) / (clientStats?.total || 1)) * 100}%` 
                      }} 
                    />
                  )}
                  {(clientStats?.archived || 0) > 0 && (
                    <div 
                      className="bg-gray-500" 
                      style={{ 
                        width: `${((clientStats?.archived || 0) / (clientStats?.total || 1)) * 100}%` 
                      }} 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

// ============================================
// Status Card Component
// ============================================

interface StatusCardProps {
  label: string;
  count: number;
  color: 'blue' | 'amber' | 'green' | 'gray' | 'red';
  icon: React.ElementType;
}

function StatusCard({ label, count, color, icon: Icon }: StatusCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    amber: 'bg-amber-500/10 text-amber-500',
    green: 'bg-green-500/10 text-green-500',
    gray: 'bg-gray-500/10 text-gray-500',
    red: 'bg-red-500/10 text-red-500',
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="rounded-xl border border-border bg-card p-4 text-center"
    >
      <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">{count}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}
