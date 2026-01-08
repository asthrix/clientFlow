// ============================================
// ClientFlow CRM - Credential Types
// Credentials vault entity and related types
// ============================================

import type { UserOwnedEntity } from './common.types';

// ============================================
// Credential Enums
// ============================================

export const CredentialType = {
  DOMAIN: 'domain',
  HOSTING: 'hosting',
  DATABASE: 'database',
  FTP: 'ftp',
  EMAIL: 'email',
  CMS: 'cms',
  API: 'api',
  SSH: 'ssh',
  OTHER: 'other',
} as const;

export type CredentialType = (typeof CredentialType)[keyof typeof CredentialType];

// ============================================
// Credential Interface
// ============================================

export interface Credential extends UserOwnedEntity {
  project_id?: string;
  credential_type: CredentialType;
  service_name: string;
  username?: string;
  password?: string; // Will be encrypted at rest
  api_key?: string; // Will be encrypted at rest
  additional_info?: Record<string, unknown>;
  expiry_date?: string;
  last_accessed?: string;

  // Computed (from joins)
  project_name?: string;
}

// ============================================
// Credential DTOs
// ============================================

export interface CreateCredentialDTO {
  project_id?: string;
  credential_type: CredentialType;
  service_name: string;
  username?: string;
  password?: string;
  api_key?: string;
  additional_info?: Record<string, unknown>;
  expiry_date?: string;
}

export interface UpdateCredentialDTO extends Partial<CreateCredentialDTO> {
  id: string;
}

// ============================================
// Credential Filter Types
// ============================================

export interface CredentialFilters {
  search?: string;
  credential_type?: CredentialType[];
  project_id?: string;
  hasExpiry?: boolean;
  expiringWithinDays?: number;
}
