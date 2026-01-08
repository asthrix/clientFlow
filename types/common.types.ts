// ============================================
// ClientFlow CRM - Common Types
// Base types, enums, and shared interfaces
// ============================================

// Base entity with common fields
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// User-owned entity (for RLS)
export interface UserOwnedEntity extends BaseEntity {
  user_id: string;
}

// ============================================
// Status Enums
// ============================================

export const ProjectStatus = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  UNDER_REVIEW: 'under_review',
  PENDING_FEEDBACK: 'pending_feedback',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const DeliveryStatus = {
  NOT_STARTED: 'not_started',
  IN_DEVELOPMENT: 'in_development',
  TESTING: 'testing',
  DEPLOYED: 'deployed',
  DELIVERED: 'delivered',
} as const;

export type DeliveryStatus = (typeof DeliveryStatus)[keyof typeof DeliveryStatus];

export const PaymentStatus = {
  UNPAID: 'unpaid',
  PARTIALLY_PAID: 'partially_paid',
  PAID: 'paid',
  OVERDUE: 'overdue',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const MilestoneStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
} as const;

export type MilestoneStatus = (typeof MilestoneStatus)[keyof typeof MilestoneStatus];

export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

// ============================================
// Common Types
// ============================================

export const Currency = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  INR: 'INR',
  AUD: 'AUD',
  CAD: 'CAD',
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export interface DateRange {
  from: Date;
  to: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ============================================
// Filter & Sort Types
// ============================================

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  order: SortOrder;
}

export interface FilterOption {
  label: string;
  value: string;
}

// ============================================
// Activity Log Types
// ============================================

export const EntityType = {
  CLIENT: 'client',
  PROJECT: 'project',
  CREDENTIAL: 'credential',
  PAYMENT: 'payment',
  TASK: 'task',
  FILE: 'file',
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export const ActionType = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
  VIEWED: 'viewed',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export interface ActivityLog extends BaseEntity {
  user_id: string;
  entity_type: EntityType;
  entity_id: string;
  action: ActionType;
  changes?: Record<string, unknown>;
}
