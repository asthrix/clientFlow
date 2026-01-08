'use client';

// ============================================
// ClientFlow CRM - Dashboard Layout
// Main layout for authenticated dashboard pages
// ============================================

import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';
import { ConfirmDialog } from '@/components/shared';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar placeholder - will be implemented later */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-lg font-bold text-foreground">ClientFlow</span>
        </div>
        <nav className="p-4">
          <p className="text-sm text-muted-foreground">Sidebar coming soon...</p>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header placeholder - will be implemented later */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </header>

        {/* Page content */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 overflow-auto p-6"
        >
          {children}
        </motion.main>
      </div>

      {/* Global confirm dialog */}
      <ConfirmDialog />
    </div>
  );
}
