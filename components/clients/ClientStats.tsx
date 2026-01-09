'use client';

// ============================================
// ClientFlow CRM - Client Stats Component
// Quick stats cards for client detail page
// ============================================

import { motion } from 'framer-motion';
import { fadeUpVariants } from '@/lib/animations';
import {
  FolderKanban,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface ClientStatsProps {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  currency?: string;
}

export function ClientStats({
  totalProjects,
  activeProjects,
  completedProjects,
  totalRevenue,
  currency = 'USD',
}: ClientStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects.toString(),
      icon: FolderKanban,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Active',
      value: activeProjects.toString(),
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Completed',
      value: completedProjects.toString(),
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Revenue',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
