'use client';

// ============================================
// ClientFlow CRM - Dashboard Layout
// Main layout for authenticated dashboard pages
// ============================================

import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';
import { Sidebar, Header, MobileNav } from '@/components/layout';
import { ConfirmDialog } from '@/components/shared';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header />

        {/* Page content */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 overflow-auto p-4 lg:p-6"
        >
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </motion.main>
      </div>

      {/* Global confirm dialog */}
      <ConfirmDialog />
    </div>
  );
}
