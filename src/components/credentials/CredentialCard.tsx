'use client';

// ============================================
// ClientFlow CRM - Credential Card Component
// Displays credential info with secure reveal
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '@/lib/animations';
import { StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks';
import type { Credential, CredentialType } from '@/types';
import {
  Globe,
  Server,
  Database,
  Upload,
  Mail,
  Layout,
  Key,
  Terminal,
  HelpCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  Pencil,
  Trash2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface CredentialCardProps {
  credential: Credential;
  onEdit?: (credential: Credential) => void;
  onDelete?: (credential: Credential) => void;
}

// Icon mapping for credential types
const credentialIcons: Record<CredentialType, React.ElementType> = {
  domain: Globe,
  hosting: Server,
  database: Database,
  ftp: Upload,
  email: Mail,
  cms: Layout,
  api: Key,
  ssh: Terminal,
  other: HelpCircle,
};

// Color mapping for credential types
const credentialColors: Record<CredentialType, { bg: string; text: string }> = {
  domain: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  hosting: { bg: 'bg-green-500/10', text: 'text-green-500' },
  database: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
  ftp: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
  email: { bg: 'bg-pink-500/10', text: 'text-pink-500' },
  cms: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
  api: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  ssh: { bg: 'bg-slate-500/10', text: 'text-slate-500' },
  other: { bg: 'bg-gray-500/10', text: 'text-gray-500' },
};

export function CredentialCard({ credential, onEdit, onDelete }: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const { copy, copied } = useClipboard();

  const Icon = credentialIcons[credential.credential_type] || HelpCircle;
  const colors = credentialColors[credential.credential_type] || credentialColors.other;

  // Check if expiring soon (within 30 days)
  const isExpiringSoon = credential.expiry_date 
    ? new Date(credential.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    : false;
  
  const isExpired = credential.expiry_date
    ? new Date(credential.expiry_date) < new Date()
    : false;

  // Format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Mask password/key
  const maskValue = (value: string) => '•'.repeat(Math.min(value.length, 20));

  // Copy handler
  const handleCopy = async (value: string | undefined, type: 'password' | 'api_key' | 'username') => {
    if (value) {
      await copy(value);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-shadow"
    >
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
              <Icon className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {credential.service_name}
              </h3>
              <p className="text-xs text-muted-foreground capitalize">
                {credential.credential_type.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(credential)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(credential)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Project association */}
        {credential.project_name && (
          <p className="mt-2 text-xs text-muted-foreground">
            Project: {credential.project_name}
          </p>
        )}

        {/* Credentials display */}
        <div className="mt-4 space-y-3">
          {/* Username */}
          {credential.username && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="text-sm font-mono truncate">{credential.username}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 shrink-0"
                onClick={() => handleCopy(credential.username, 'username')}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          {/* Password */}
          {credential.password && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Password</p>
                <p className="text-sm font-mono truncate">
                  {showPassword ? credential.password : maskValue(credential.password)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopy(credential.password, 'password')}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* API Key */}
          {credential.api_key && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">API Key</p>
                <p className="text-sm font-mono truncate">
                  {showApiKey ? credential.api_key : maskValue(credential.api_key)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopy(credential.api_key, 'api_key')}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Expiry warning */}
        {credential.expiry_date && (
          <div className="mt-4 flex items-center gap-2">
            {isExpired ? (
              <StatusBadge variant="error" size="sm">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Expired
              </StatusBadge>
            ) : isExpiringSoon ? (
              <StatusBadge variant="warning" size="sm">
                <Calendar className="h-3 w-3 mr-1" />
                Expires {formatDate(credential.expiry_date)}
              </StatusBadge>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Expires {formatDate(credential.expiry_date)}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
