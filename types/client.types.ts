// ============================================
// ClientFlow CRM - Client Types
// Client entity and related types
// ============================================

import type { UserOwnedEntity } from './common.types';

// ============================================
// Client Enums
// ============================================

export const ClientType = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  AGENCY: 'agency',
} as const;

export type ClientType = (typeof ClientType)[keyof typeof ClientType];

export const ClientSource = {
  REFERRAL: 'referral',
  WEBSITE: 'website',
  SOCIAL_MEDIA: 'social_media',
  COLD_OUTREACH: 'cold_outreach',
  FREELANCE_PLATFORM: 'freelance_platform',
  OTHER: 'other',
} as const;

export type ClientSource = (typeof ClientSource)[keyof typeof ClientSource];

export const ClientStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type ClientStatus = (typeof ClientStatus)[keyof typeof ClientStatus];

// ============================================
// Client Interface
// ============================================

export interface Client extends UserOwnedEntity {
  // Basic Details
  client_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  secondary_contact?: string;

  // Address
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;

  // Classification
  client_type: ClientType;
  client_source?: ClientSource;
  status: ClientStatus;
  tags: string[];

  // Additional
  notes?: string;
  profile_picture_url?: string;

  // Computed (from joins)
  project_count?: number;
  total_revenue?: number;
}

// ============================================
// Client DTOs
// ============================================

export interface CreateClientDTO {
  client_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  secondary_contact?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  client_type: ClientType;
  client_source?: ClientSource;
  status?: ClientStatus;
  tags?: string[];
  notes?: string;
  profile_picture_url?: string;
}

export interface UpdateClientDTO extends Partial<CreateClientDTO> {
  id: string;
}

// ============================================
// Client Filter Types
// ============================================

export interface ClientFilters {
  search?: string;
  status?: ClientStatus[];
  client_type?: ClientType[];
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export type ClientSortField = 'client_name' | 'created_at' | 'project_count' | 'total_revenue';
