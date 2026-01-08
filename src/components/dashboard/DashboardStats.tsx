'use client';

// ============================================
// ClientFlow CRM - Dashboard Stats Cards
// Real-time stats from database
// ============================================

import { motion } from 'framer-motion';
import { cardVariants } from '@/lib/animations';
import { StatsCardSkeleton } from '@/components/shared';
import { useClientStats } from '@/hooks/queries/useClients';
import { useProjectStats } from '@/hooks/queries/useProjects';
import { 
  Users, 
  FolderKanban, 
  CheckCircle2, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  trend?: 'up' | 'down';
  change?: string;
}

function StatsCard({ title, value, icon: Icon, color, bgColor, trend, change }: StatsCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow"
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgColor}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          {trend && change && (
            <span className={`flex items-center gap-1 text-xs font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {change}
            </span>
          )}
        </div>

        <div className="mt-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground"
          >
            {value}
          </motion.p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardStats() {
  const { data: clientStats, isLoading: clientsLoading, isError: clientsError } = useClientStats();
  const { data: projectStats, isLoading: projectsLoading, isError: projectsError } = useProjectStats();

  const isLoading = clientsLoading || projectsLoading;
  const isError = clientsError || projectsError;

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load dashboard stats</span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Clients',
      value: clientStats?.total || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Projects',
      value: projectStats?.inProgress || 0,
      icon: FolderKanban,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Completed',
      value: projectStats?.completed || 0,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Revenue',
      value: formatCurrency(projectStats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}
