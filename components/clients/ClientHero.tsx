'use client';

// ============================================
// ClientFlow CRM - Client Hero Component
// Hero section for client detail page with avatar/initials
// ============================================

import { motion } from 'framer-motion';
import { fadeUpVariants } from '@/lib/animations';
import { StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import type { Client, ClientStatus } from '@/types';
import {
  Mail,
  Phone,
  Building2,
  ArrowLeft,
  Pencil,
  Trash2,
  Archive,
} from 'lucide-react';

interface ClientHeroProps {
  client: Client;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onArchive?: () => void;
}

export function ClientHero({
  client,
  onBack,
  onEdit,
  onDelete,
  onArchive,
}: ClientHeroProps) {
  // Status badge config
  const statusConfig: Record<ClientStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    archived: { variant: 'warning', label: 'Archived' },
  };

  const currentStatus = statusConfig[client.status] || statusConfig.active;

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate gradient color based on name
  const getGradient = (name: string) => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-blue-500',
      'from-amber-500 to-orange-500',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Gradient Header */}
      <div className={`h-24 bg-linear-to-r ${getGradient(client.client_name)}`} />
      
      {/* Content */}
      <div className="px-6 pb-6 -mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-card text-3xl font-bold text-foreground shadow-lg border-4 border-card">
            {getInitials(client.client_name)}
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 sm:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-2xl font-bold text-foreground">{client.client_name}</h1>
              <StatusBadge variant={currentStatus.variant}>
                {currentStatus.label}
              </StatusBadge>
            </div>
            
            {/* Company */}
            {client.company_name && (
              <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {client.company_name}
              </p>
            )}

            {/* Contact Info Row */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              {client.email && (
                <a
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {client.email}
                </a>
              )}
              {client.phone && (
                <a
                  href={`tel:${client.phone}`}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {client.phone}
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:self-start sm:pt-8">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {onArchive && client.status !== 'archived' && (
              <Button variant="ghost" size="sm" onClick={onArchive}>
                <Archive className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
