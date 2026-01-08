'use client';

// ============================================
// ClientFlow CRM - Dashboard Page
// Main overview with stats and widgets
// ============================================

import { motion } from 'framer-motion';
import { 
  staggerContainerVariants, 
  cardVariants 
} from '@/lib/animations';
import { PageHeader, StatsCardSkeleton } from '@/components/shared';
import { 
  Users, 
  FolderKanban, 
  CheckCircle2, 
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// Placeholder stats data
const stats = [
  {
    title: 'Total Clients',
    value: '24',
    change: '+12%',
    trend: 'up' as const,
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Active Projects',
    value: '8',
    change: '+4%',
    trend: 'up' as const,
    icon: FolderKanban,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    title: 'Completed',
    value: '32',
    change: '+18%',
    trend: 'up' as const,
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Revenue',
    value: '$48.5k',
    change: '-2%',
    trend: 'down' as const,
    icon: DollarSign,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your business."
      />

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            variants={cardVariants}
            whileHover="hover"
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow"
          >
            {/* Background decoration */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>

              <div className="mt-4">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-foreground"
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Placeholder widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Clients</h3>
          <p className="text-sm text-muted-foreground">
            Client list widget will be implemented here...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-lg font-semibold text-foreground">Active Projects</h3>
          <p className="text-sm text-muted-foreground">
            Project status widget will be implemented here...
          </p>
        </motion.div>
      </div>
    </div>
  );
}
