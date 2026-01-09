'use client';

// ============================================
// ClientFlow CRM - Credential Accordion Component
// Compact accordion view for credentials (one open at a time)
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariants } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import type { Credential, CredentialType } from '@/types';
import {
  ChevronDown,
  Plus,
  Key,
  Globe,
  Server,
  Database,
  Mail,
  Code,
  Terminal,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Pencil,
  Trash2,
} from 'lucide-react';

// Type icon mapping
const typeIcons: Record<CredentialType, React.ComponentType<{ className?: string }>> = {
  domain: Globe,
  hosting: Server,
  database: Database,
  ftp: Terminal,
  email: Mail,
  cms: Code,
  api: Key,
  ssh: Terminal,
  other: Lock,
};

// Type labels
const typeLabels: Record<CredentialType, string> = {
  domain: 'Domain',
  hosting: 'Hosting',
  database: 'Database',
  ftp: 'FTP',
  email: 'Email',
  cms: 'CMS',
  api: 'API',
  ssh: 'SSH',
  other: 'Other',
};

interface CredentialAccordionProps {
  credentials: Credential[];
  onAdd: () => void;
  onEdit?: (credential: Credential) => void;
  onDelete?: (credential: Credential) => void;
}

export function CredentialAccordion({
  credentials,
  onAdd,
  onEdit,
  onDelete,
}: CredentialAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Toggle accordion item
  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Toggle field visibility
  const toggleFieldVisibility = (fieldKey: string) => {
    setVisibleFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldKey)) {
        next.delete(fieldKey);
      } else {
        next.add(fieldKey);
      }
      return next;
    });
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, fieldKey: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">
            Credentials ({credentials.length})
          </h3>
        </div>
        <Button size="sm" onClick={onAdd}>
          <Plus className="mr-2 h-3 w-3" />
          Add
        </Button>
      </div>

      {/* Accordion Items */}
      {credentials.length === 0 ? (
        <div className="p-8 text-center">
          <Lock className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">
            No credentials stored yet
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={onAdd}>
            <Plus className="mr-2 h-3 w-3" />
            Add First Credential
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {credentials.map((credential) => {
            const Icon = typeIcons[credential.credential_type] || Lock;
            const isOpen = openId === credential.id;

            return (
              <div key={credential.id}>
                {/* Accordion Header */}
                <button
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-muted/50 ${
                    isOpen ? 'bg-muted/30' : ''
                  }`}
                  onClick={() => toggleItem(credential.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isOpen ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`h-4 w-4 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{credential.service_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {typeLabels[credential.credential_type]}
                        {credential.username && ` • ${credential.username}`}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 space-y-3">
                        {/* Username */}
                        {credential.username && (
                          <CredentialField
                            label="Username"
                            value={credential.username}
                            fieldKey={`${credential.id}-username`}
                            isVisible={true}
                            onCopy={() => copyToClipboard(credential.username!, `${credential.id}-username`)}
                            isCopied={copiedField === `${credential.id}-username`}
                          />
                        )}

                        {/* Password */}
                        {credential.password && (
                          <CredentialField
                            label="Password"
                            value={credential.password}
                            fieldKey={`${credential.id}-password`}
                            isVisible={visibleFields.has(`${credential.id}-password`)}
                            isSecret
                            onToggleVisibility={() => toggleFieldVisibility(`${credential.id}-password`)}
                            onCopy={() => copyToClipboard(credential.password!, `${credential.id}-password`)}
                            isCopied={copiedField === `${credential.id}-password`}
                          />
                        )}

                        {/* API Key */}
                        {credential.api_key && (
                          <CredentialField
                            label="API Key"
                            value={credential.api_key}
                            fieldKey={`${credential.id}-api_key`}
                            isVisible={visibleFields.has(`${credential.id}-api_key`)}
                            isSecret
                            onToggleVisibility={() => toggleFieldVisibility(`${credential.id}-api_key`)}
                            onCopy={() => copyToClipboard(credential.api_key!, `${credential.id}-api_key`)}
                            isCopied={copiedField === `${credential.id}-api_key`}
                          />
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          {onEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(credential)}
                            >
                              <Pencil className="mr-2 h-3 w-3" />
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => onDelete(credential)}
                            >
                              <Trash2 className="mr-2 h-3 w-3" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// Credential Field Component
// ============================================

interface CredentialFieldProps {
  label: string;
  value: string;
  fieldKey: string;
  isVisible: boolean;
  isSecret?: boolean;
  onToggleVisibility?: () => void;
  onCopy: () => void;
  isCopied: boolean;
}

function CredentialField({
  label,
  value,
  isVisible,
  isSecret,
  onToggleVisibility,
  onCopy,
  isCopied,
}: CredentialFieldProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-mono text-foreground truncate">
          {isSecret && !isVisible ? '••••••••••••' : value}
        </p>
      </div>
      <div className="flex items-center gap-1 ml-2">
        {isSecret && onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        )}
        <button
          onClick={onCopy}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
