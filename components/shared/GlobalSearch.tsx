'use client';

// ============================================
// ClientFlow CRM - Global Search / Command Palette
// Quick navigation and search with Cmd+K
// ============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants, overlayVariants } from '@/lib/animations';
import { useDebounce } from '@/hooks';
import { useClients } from '@/hooks/queries/useClients';
import { useProjects } from '@/hooks/queries/useProjects';
import { useCredentials } from '@/hooks/queries/useCredentials';
import {
  Search,
  Command,
  Users,
  FolderKanban,
  Key,
  LayoutDashboard,
  BarChart3,
  Settings,
  ArrowRight,
  Loader2,
} from 'lucide-react';

// Navigation items available to search
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
  { id: 'clients', label: 'Clients', href: '/clients', icon: Users, category: 'Navigation' },
  { id: 'projects', label: 'Projects', href: '/projects', icon: FolderKanban, category: 'Navigation' },
  { id: 'credentials', label: 'Credentials', href: '/credentials', icon: Key, category: 'Navigation' },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3, category: 'Navigation' },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings, category: 'Navigation' },
];

interface SearchResult {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  category: string;
  subtitle?: string;
}

export function GlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const debouncedQuery = useDebounce(query, 200);

  // Fetch data for searching (only when open)
  const { data: clientsData, isLoading: clientsLoading } = useClients({
    filters: { search: debouncedQuery || undefined },
    pageSize: 5,
    enabled: isOpen && debouncedQuery.length > 0,
  });

  const { data: projectsData, isLoading: projectsLoading } = useProjects({
    filters: { search: debouncedQuery || undefined },
    pageSize: 5,
    enabled: isOpen && debouncedQuery.length > 0,
  });

  const { data: credentialsData, isLoading: credentialsLoading } = useCredentials({
    filters: { search: debouncedQuery || undefined },
    enabled: isOpen && debouncedQuery.length > 0,
  });

  const isLoading = clientsLoading || projectsLoading || credentialsLoading;

  // Build search results
  const results = useMemo(() => {
    const items: SearchResult[] = [];

    // Add navigation items that match query
    const navMatches = navigationItems.filter((item) =>
      query.length === 0 || item.label.toLowerCase().includes(query.toLowerCase())
    );
    items.push(...navMatches.map((item) => ({
      ...item,
      category: 'Navigation',
    })));

    // Add clients
    if (clientsData?.data) {
      items.push(...clientsData.data.map((client) => ({
        id: `client-${client.id}`,
        label: client.client_name,
        href: `/clients/${client.id}`,
        icon: Users,
        category: 'Clients',
        subtitle: client.company_name || client.email,
      })));
    }

    // Add projects
    if (projectsData?.data) {
      items.push(...projectsData.data.map((project) => ({
        id: `project-${project.id}`,
        label: project.project_name,
        href: `/projects/${project.id}`,
        icon: FolderKanban,
        category: 'Projects',
        subtitle: project.client_name,
      })));
    }

    // Add credentials
    if (credentialsData) {
      items.push(...credentialsData.slice(0, 5).map((cred) => ({
        id: `cred-${cred.id}`,
        label: cred.service_name,
        href: `/credentials`,
        icon: Key,
        category: 'Credentials',
        subtitle: cred.credential_type,
      })));
    }

    return items;
  }, [query, clientsData, projectsData, credentialsData]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((result) => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category].push(result);
    });
    return groups;
  }, [results]);

  // Flatten for index-based navigation
  const flatResults = useMemo(() => results, [results]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation within results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatResults.length);
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const selected = flatResults[selectedIndex];
        if (selected) {
          router.push(selected.href);
          setIsOpen(false);
          setQuery('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatResults, selectedIndex, router]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback((result: SearchResult) => {
    router.push(result.href);
    setIsOpen(false);
    setQuery('');
  }, [router]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2"
            >
              <div className="mx-4 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
                {/* Search Input */}
                <div className="flex items-center border-b border-border px-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search clients, projects, pages..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {Object.entries(groupedResults).length === 0 && query.length > 0 && !isLoading ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No results found for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category} className="mb-4 last:mb-0">
                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {category}
                        </div>
                        <div className="space-y-1">
                          {items.map((item) => {
                            const globalIndex = flatResults.findIndex((r) => r.id === item.id);
                            const isSelected = globalIndex === selectedIndex;
                            const Icon = item.icon;

                            return (
                              <button
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                                  isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                }`}
                              >
                                <Icon className="h-4 w-4 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium">{item.label}</p>
                                  {item.subtitle && (
                                    <p className={`truncate text-xs ${
                                      isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                    }`}>
                                      {item.subtitle}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight className="h-4 w-4 shrink-0 opacity-50" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <kbd className="rounded bg-muted px-1.5 py-0.5">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="rounded bg-muted px-1.5 py-0.5">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="rounded bg-muted px-1.5 py-0.5">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
