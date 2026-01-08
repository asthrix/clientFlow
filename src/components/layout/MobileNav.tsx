'use client';

// ============================================
// ClientFlow CRM - Mobile Navigation
// Slide-in drawer for mobile devices
// ============================================

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  sidebarVariants, 
  overlayVariants,
  staggerContainerVariants,
  menuItemVariants,
} from '@/lib/animations';
import { NAV_ITEMS } from '@/lib/constants';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { X, LogOut } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  return (
    <AnimatePresence>
      {mobileNavOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-2xl lg:hidden"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Link
                href="/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
                  <span className="text-lg font-bold text-primary-foreground">CF</span>
                </div>
                <span className="text-lg font-bold text-foreground">ClientFlow</span>
              </Link>

              <button
                onClick={() => setMobileNavOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
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
                      <Link
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span>{item.label}</span>

                          {item.badge && (
                            <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-4">
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  // Handle sign out
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
