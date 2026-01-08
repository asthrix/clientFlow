'use client';

// ============================================
// ClientFlow CRM - Dashboard Page
// Main overview with real-time stats and widgets
// ============================================

import { motion } from 'framer-motion';
import { staggerContainerVariants } from '@/lib/animations';
import { PageHeader } from '@/components/shared';
import { 
  DashboardStats, 
  RecentClientsWidget, 
  RecentProjectsWidget,
  PaymentOverviewWidget,
} from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your business."
      />

      {/* Stats Grid - Real data from hooks */}
      <DashboardStats />

      {/* Widgets Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentClientsWidget />
        <RecentProjectsWidget />
      </div>

      {/* Payment Overview - Full width */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentOverviewWidget />
        </div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
          <div className="space-y-3">
            <a 
              href="/clients" 
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Add New Client</p>
                <p className="text-xs text-muted-foreground">Register a new client</p>
              </div>
            </a>
            
            <a 
              href="/projects" 
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Start New Project</p>
                <p className="text-xs text-muted-foreground">Create a project</p>
              </div>
            </a>
            
            <a 
              href="/credentials" 
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Manage Credentials</p>
                <p className="text-xs text-muted-foreground">Secure password vault</p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
