'use client';

// ============================================
// ClientFlow CRM - Sidebar Component
// Modern sidebar with animations and collapse
// ============================================

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  staggerContainerVariants, 
  menuItemVariants,
  buttonVariants,
} from '@/lib/animations';
import { NAV_ITEMS } from '@/lib/constants';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="hidden sticky top-0 h-screen shrink-0 flex-col border-r border-border bg-card lg:flex overflow-hidden"
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25"
          >
            <span className="text-lg font-bold text-primary-foreground">CF</span>
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-bold text-foreground"
              >
                ClientFlow
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Collapse Toggle */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={toggleSidebarCollapse}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            sidebarCollapsed && "mx-auto"
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <motion.ul
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
          className="space-y-1.5"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <motion.li key={item.href} variants={menuItemVariants}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl bg-primary"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}

                    <Icon className={cn(
                      "relative z-10 h-5 w-5 shrink-0",
                      isActive ? "text-primary-foreground" : ""
                    )} />

                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="relative z-10"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Badge */}
                    {item.badge && !sidebarCollapsed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative z-10 ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="pointer-events-none absolute left-full z-50 ml-2 hidden rounded-lg bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 lg:block">
                    {item.label}
                  </div>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <motion.button
          whileHover={{ x: 4 }}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
            sidebarCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
