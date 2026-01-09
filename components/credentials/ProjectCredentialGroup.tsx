'use client';

// ============================================
// ClientFlow CRM - Project Credentials Group Component
// Displays credentials grouped by project with expand/collapse
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariants } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { CredentialCard } from './CredentialCard';
import type { Credential } from '@/types';
import {
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Plus,
  Key,
} from 'lucide-react';

interface ProjectCredentialGroupProps {
  projectId: string | null;
  projectName: string;
  credentials: Credential[];
  onAddCredential?: (projectId: string | null) => void;
  onEditCredential?: (credential: Credential) => void;
  defaultExpanded?: boolean;
}

export function ProjectCredentialGroup({
  projectId,
  projectName,
  credentials,
  onAddCredential,
  onEditCredential,
  defaultExpanded = false,
}: ProjectCredentialGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <FolderKanban className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{projectName}</p>
            <p className="text-xs text-muted-foreground">
              {credentials.length} credential{credentials.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onAddCredential?.(projectId);
          }}
        >
          <Plus className="mr-2 h-3 w-3" />
          Add
        </Button>
      </div>

      {/* Credentials List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border p-4">
              {credentials.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {credentials.map((credential) => (
                    <CredentialCard
                      key={credential.id}
                      credential={credential}
                      onEdit={onEditCredential}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <Key className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No credentials yet
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
