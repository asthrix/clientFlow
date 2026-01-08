'use client';

// ============================================
// ClientFlow CRM - Client Card Component
// Displays client information in a card format
// ============================================

import { motion } from 'framer-motion';
import { cardVariants } from '@/lib/animations';
import { ClientStatusBadge } from '@/components/shared';
import type { Client } from '@/types';
import {
  Mail,
  Phone,
  Building2,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Trash2,
  Archive,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onArchive?: (client: Client) => void;
}

export function ClientCard({
  client,
  onEdit,
  onDelete,
  onArchive,
}: ClientCardProps) {
  // Get initials for avatar
  const initials = client.client_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent color based on client name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-amber-500',
      'bg-rose-500',
      'bg-cyan-500',
      'bg-indigo-500',
      'bg-emerald-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-shadow"
    >
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative">
        {/* Header with avatar and actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {client.profile_picture_url ? (
              <img
                src={client.profile_picture_url}
                alt={client.client_name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold ${getAvatarColor(client.client_name)}`}
              >
                {initials}
              </div>
            )}

            {/* Name and company */}
            <div>
              <Link
                href={`/clients/${client.id}`}
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {client.client_name}
              </Link>
              {client.company_name && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  {client.company_name}
                </div>
              )}
            </div>
          </div>

          {/* Actions dropdown */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(client)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onArchive && client.status !== 'archived' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onArchive(client)}
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(client)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <a
              href={`mailto:${client.email}`}
              className="truncate hover:text-foreground transition-colors"
            >
              {client.email}
            </a>
          </div>
          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <a
                href={`tel:${client.phone}`}
                className="hover:text-foreground transition-colors"
              >
                {client.phone}
              </a>
            </div>
          )}
        </div>

        {/* Footer with status and project count */}
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/50">
          <ClientStatusBadge status={client.status} />
          
          {client.project_count !== undefined && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <FolderKanban className="h-4 w-4" />
              <span>{client.project_count} projects</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {client.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
            {client.tags.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                +{client.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
