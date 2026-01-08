'use client';

// ============================================
// ClientFlow CRM - PageHeader Component
// Reusable page header with title and actions
// ============================================

import { motion } from 'framer-motion';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';
import type { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional description */
  description?: string;
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[];
  /** Actions slot (buttons, etc.) */
  actions?: ReactNode;
  /** Additional className */
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <motion.header
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className={`mb-8 ${className}`}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.nav
          variants={fadeUpVariants}
          className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-muted-foreground/50">/</span>
              )}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </motion.nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <motion.h1
            variants={fadeUpVariants}
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              variants={fadeUpVariants}
              className="text-muted-foreground"
            >
              {description}
            </motion.p>
          )}
        </div>

        {actions && (
          <motion.div
            variants={fadeUpVariants}
            className="flex shrink-0 items-center gap-3"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
