'use client';

// ============================================
// ClientFlow CRM - Grouped Credentials List
// Displays credentials grouped by project
// ============================================

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { staggerContainerVariants } from '@/lib/animations';
import { ProjectCredentialGroup } from './ProjectCredentialGroup';
import { EmptyState, CardSkeleton } from '@/components/shared';
import { useCredentials } from '@/hooks/queries/useCredentials';
import { Button } from '@/components/ui/button';
import type { Credential } from '@/types';
import { Key, Plus } from 'lucide-react';

interface GroupedCredentialsListProps {
  onAddCredential: (projectId?: string | null) => void;
  onEditCredential: (credential: Credential) => void;
}

interface CredentialGroup {
  projectId: string | null;
  projectName: string;
  credentials: Credential[];
}

export function GroupedCredentialsList({
  onAddCredential,
  onEditCredential,
}: GroupedCredentialsListProps) {
  // Fetch all credentials
  const { data: credentials, isLoading, isError, error, refetch } = useCredentials({});

  // Group credentials by project
  const groupedCredentials = useMemo(() => {
    if (!credentials) return [];

    const groups = new Map<string | null, CredentialGroup>();

    for (const credential of credentials) {
      const projectId = credential.project_id || null;
      const projectName = credential.project_name || 'Ungrouped';

      if (!groups.has(projectId)) {
        groups.set(projectId, {
          projectId,
          projectName,
          credentials: [],
        });
      }

      groups.get(projectId)!.credentials.push(credential);
    }

    // Sort: projects with credentials first, then ungrouped
    return Array.from(groups.values()).sort((a, b) => {
      if (a.projectId === null) return 1;
      if (b.projectId === null) return -1;
      return a.projectName.localeCompare(b.projectName);
    });
  }, [credentials]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <EmptyState
        title="Failed to load credentials"
        description={error?.message || 'An error occurred'}
        icon={Key}
        actionLabel="Try again"
        onAction={() => refetch()}
      />
    );
  }

  // Empty state
  if (!credentials || credentials.length === 0) {
    return (
      <EmptyState
        title="No credentials yet"
        description="Store your passwords, API keys, and access credentials securely"
        icon={Key}
        actionLabel="Add Your First Credential"
        onAction={() => onAddCredential(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {groupedCredentials.length} project{groupedCredentials.length !== 1 ? 's' : ''} •{' '}
            {credentials.length} credential{credentials.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => onAddCredential(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Credential
        </Button>
      </div>

      {/* Grouped List */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {groupedCredentials.map((group, index) => (
          <ProjectCredentialGroup
            key={group.projectId || 'ungrouped'}
            projectId={group.projectId}
            projectName={group.projectName}
            credentials={group.credentials}
            onAddCredential={onAddCredential}
            onEditCredential={onEditCredential}
            defaultExpanded={index === 0}
          />
        ))}
      </motion.div>
    </div>
  );
}
