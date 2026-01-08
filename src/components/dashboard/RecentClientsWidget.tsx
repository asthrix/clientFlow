'use client';

// ============================================
// ClientFlow CRM - Recent Clients Widget
// Shows latest clients added
// ============================================

import { motion } from 'framer-motion';
import { fadeUpVariants } from '@/lib/animations';
import { StatusBadge, CardSkeleton } from '@/components/shared';
import { useRecentClients } from '@/hooks/queries/useClients';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Users, 
  ArrowRight,
  Mail,
  Building2,
  AlertCircle,
} from 'lucide-react';

export function RecentClientsWidget() {
  const { data: clients, isLoading, isError, error } = useRecentClients(5);

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className="rounded-xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="font-semibold text-foreground">Recent Clients</h3>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients" className="flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-sm text-destructive py-4">
            <AlertCircle className="h-4 w-4" />
            <span>{error?.message || 'Failed to load clients'}</span>
          </div>
        ) : clients && clients.length > 0 ? (
          <div className="space-y-3">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-sm font-medium text-primary">
                  {client.client_name.slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {client.client_name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {client.company_name ? (
                      <>
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{client.company_name}</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{client.email}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status */}
                <StatusBadge 
                  variant={client.status === 'active' ? 'success' : 'default'} 
                  size="sm"
                >
                  {client.status}
                </StatusBadge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No clients yet</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link href="/clients">Add your first client</Link>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
