// ============================================
// ClientFlow CRM - Payment Types
// Payment tracking and milestone types
// ============================================

import type { BaseEntity, MilestoneStatus, Currency } from './common.types';

// ============================================
// Payment Method Enum
// ============================================

export const PaymentMethod = {
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  RAZORPAY: 'razorpay',
  CASH: 'cash',
  CHECK: 'check',
  CRYPTO: 'crypto',
  OTHER: 'other',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// ============================================
// Payment Interface
// ============================================

export interface Payment extends BaseEntity {
  project_id: string;
  milestone_id?: string;
  amount: number;
  currency: Currency;
  payment_date: string;
  payment_method?: PaymentMethod;
  transaction_reference?: string;
  notes?: string;

  // Computed (from joins)
  project_name?: string;
  client_name?: string;
}

// ============================================
// Payment Milestone Interface
// ============================================

export interface PaymentMilestone extends BaseEntity {
  project_id: string;
  milestone_name: string;
  amount: number;
  currency: Currency;
  due_date?: string;
  status: MilestoneStatus;
  paid_date?: string;
  notes?: string;

  // Computed
  payments?: Payment[];
  amount_paid?: number;
  amount_remaining?: number;
}

// ============================================
// Payment DTOs
// ============================================

export interface CreatePaymentDTO {
  project_id: string;
  milestone_id?: string;
  amount: number;
  currency?: Currency;
  payment_date: string;
  payment_method?: PaymentMethod;
  transaction_reference?: string;
  notes?: string;
}

export interface CreateMilestoneDTO {
  project_id: string;
  milestone_name: string;
  amount: number;
  currency?: Currency;
  due_date?: string;
  notes?: string;
}

export interface UpdateMilestoneDTO extends Partial<CreateMilestoneDTO> {
  id: string;
  status?: MilestoneStatus;
}

// ============================================
// Payment Summary Types (for analytics)
// ============================================

export interface PaymentSummary {
  total_revenue: number;
  total_received: number;
  total_outstanding: number;
  payments_this_month: number;
  overdue_amount: number;
}

export interface ProjectPaymentSummary {
  project_id: string;
  project_name: string;
  total_cost: number;
  total_paid: number;
  outstanding: number;
  milestones: PaymentMilestone[];
}
