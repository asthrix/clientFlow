'use client';

// ============================================
// ClientFlow CRM - Header Component
// Top navigation bar with search and user menu
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dropdownVariants, fadeUpVariants } from '@/lib/animations';
import { useUIStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlobalSearch } from '@/components/shared';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Bell, 
  Menu,
  X,
  Moon,
  Sun,
  Settings,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export function Header() {
  const { setMobileNavOpen, theme, setTheme } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Domain expiring soon', message: 'example.com expires in 7 days', time: '2h ago' },
    { id: 2, title: 'Payment received', message: '$2,500 from Project XYZ', time: '5h ago' },
    { id: 3, title: 'New client added', message: 'Acme Corp was added to clients', time: '1d ago' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
      {/* Left side - Mobile menu & Search */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global Search - Command Palette */}
        <div className="hidden sm:block">
          <GlobalSearch />
        </div>

        {/* Mobile search toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </motion.div>

        {/* Notifications */}
        <div className="relative">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                3
              </span>
            </Button>
          </motion.div>

          {/* Notifications dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <motion.div
                  variants={dropdownVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="border-b border-border px-4 py-3">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif, index) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border p-4 transition-colors last:border-0 hover:bg-muted/50"
                      >
                        <p className="text-sm font-medium text-foreground">{notif.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{notif.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground/70">{notif.time}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-border p-2">
                    <Button variant="ghost" className="w-full text-sm">
                      View all notifications
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              JD
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </motion.button>

          {/* User dropdown */}
          <AnimatePresence>
            {userMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <motion.div
                  variants={dropdownVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="border-b border-border p-4 sm:hidden">
                    <p className="font-medium text-foreground">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                  <div className="p-2">
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-border p-2">
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            variants={fadeUpVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-x-0 top-0 z-50 flex h-16 items-center gap-2 bg-card px-4 sm:hidden"
          >
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="flex-1"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
