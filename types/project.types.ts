// ============================================
// ClientFlow CRM - Project Types
// Project entity and related types
// ============================================

import type {
  UserOwnedEntity,
  BaseEntity,
  ProjectStatus,
  DeliveryStatus,
  PaymentStatus,
  TaskStatus,
  Currency,
} from './common.types';

// ============================================
// Project Enums
// ============================================

export const ProjectType = {
  WEBSITE: 'website',
  WEB_APP: 'web_app',
  ECOMMERCE: 'ecommerce',
  LANDING_PAGE: 'landing_page',
  MOBILE_APP: 'mobile_app',
  API: 'api',
  MAINTENANCE: 'maintenance',
  OTHER: 'other',
} as const;

export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType];

export const PaymentStructure = {
  FIXED: 'fixed',
  HOURLY: 'hourly',
  MILESTONE: 'milestone',
} as const;

export type PaymentStructure = (typeof PaymentStructure)[keyof typeof PaymentStructure];

// ============================================
// Project Interface
// ============================================

export interface Project extends UserOwnedEntity {
  client_id: string;

  // Basic Information
  project_name: string;
  project_type: ProjectType;
  description?: string;
  technology_stack: string[];

  // Dates
  start_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;

  // Status Tracking
  status: ProjectStatus;
  delivery_status: DeliveryStatus;
  payment_status: PaymentStatus;
  progress_percentage: number;

  // URLs
  repository_url?: string;
  live_url?: string;
  staging_url?: string;

  // Financial
  total_cost?: number;
  currency: Currency;
  payment_structure: PaymentStructure;
  hourly_rate?: number;
  estimated_hours?: number;
  outstanding_balance?: number;

  // Computed (from joins)
  client_name?: string;
  domain?: ProjectDomain;
  hosting?: ProjectHosting;
  database?: ProjectDatabase;
}

// ============================================
// Project Domain
// ============================================

export interface ProjectDomain extends BaseEntity {
  project_id: string;
  domain_name: string;
  registrar?: string;
  purchase_date?: string;
  renewal_date?: string;
  auto_renewal: boolean;
  domain_cost?: number;
  notes?: string;
  // Credentials stored separately in vault
}

// ============================================
// Project Hosting
// ============================================

export const ServerType = {
  SHARED: 'shared',
  VPS: 'vps',
  CLOUD: 'cloud',
  DEDICATED: 'dedicated',
  SERVERLESS: 'serverless',
} as const;

export type ServerType = (typeof ServerType)[keyof typeof ServerType];

export const BillingCycle = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export type BillingCycle = (typeof BillingCycle)[keyof typeof BillingCycle];

export interface ProjectHosting extends BaseEntity {
  project_id: string;
  hosting_provider: string;
  server_type?: ServerType;
  server_ip?: string;
  hosting_cost?: number;
  billing_cycle?: BillingCycle;
  renewal_date?: string;
  notes?: string;
}

// ============================================
// Project Database
// ============================================

export const DatabaseType = {
  MYSQL: 'mysql',
  POSTGRESQL: 'postgresql',
  MONGODB: 'mongodb',
  SQLITE: 'sqlite',
  SUPABASE: 'supabase',
  FIREBASE: 'firebase',
  OTHER: 'other',
} as const;

export type DatabaseType = (typeof DatabaseType)[keyof typeof DatabaseType];

export interface ProjectDatabase extends BaseEntity {
  project_id: string;
  database_type: DatabaseType;
  database_host?: string;
  database_name?: string;
  database_size?: string;
  backup_location?: string;
  backup_frequency?: string;
  notes?: string;
}

// ============================================
// Project Tasks
// ============================================

export interface ProjectTask extends BaseEntity {
  project_id: string;
  task_name: string;
  description?: string;
  status: TaskStatus;
  due_date?: string;
  completed_date?: string;
  order_index: number;
}

// ============================================
// Project Files
// ============================================

export interface ProjectFile extends BaseEntity {
  project_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
}

// ============================================
// Project DTOs
// ============================================

export interface CreateProjectDTO {
  client_id: string;
  project_name: string;
  project_type: ProjectType;
  description?: string;
  technology_stack?: string[];
  start_date?: string;
  expected_completion_date?: string;
  status?: ProjectStatus;
  delivery_status?: DeliveryStatus;
  payment_status?: PaymentStatus;
  progress_percentage?: number;
  repository_url?: string;
  live_url?: string;
  staging_url?: string;
  total_cost?: number;
  currency?: Currency;
  payment_structure?: PaymentStructure;
  hourly_rate?: number;
  estimated_hours?: number;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  id: string;
}

// ============================================
// Project Filter Types
// ============================================

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus[];
  delivery_status?: DeliveryStatus[];
  payment_status?: PaymentStatus[];
  project_type?: ProjectType[];
  client_id?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export type ProjectSortField = 
  | 'project_name' 
  | 'created_at' 
  | 'start_date' 
  | 'expected_completion_date'
  | 'progress_percentage'
  | 'total_cost';
