// ============================================
// ClientFlow CRM - Project Validation Schemas
// Zod schemas for project form validation
// Aligned with Project types from project.types.ts
// ============================================

import { z } from 'zod';

// Project enum values - must match project.types.ts
export const projectTypeValues = [
  'website',
  'web_app',
  'ecommerce',
  'landing_page',
  'mobile_app',
  'api',
  'maintenance',
  'other',
] as const;

export const projectStatusValues = [
  'planning',
  'in_progress',
  'under_review',
  'pending_feedback',
  'completed',
  'on_hold',
  'cancelled',
] as const;

export const deliveryStatusValues = [
  'not_started',
  'in_development',
  'testing',
  'deployed',
  'delivered',
] as const;

export const paymentStatusValues = [
  'unpaid',
  'partially_paid',
  'paid',
  'overdue',
] as const;

export const paymentStructureValues = [
  'fixed',
  'hourly',
  'milestone',
] as const;

export const currencyValues = [
  'USD',
  'EUR',
  'GBP',
  'INR',
  'AUD',
  'CAD',
] as const;

// Base project schema - using field names from Project interface
export const projectSchema = z.object({
  // Required fields
  project_name: z
    .string()
    .min(2, 'Project name must be at least 2 characters')
    .max(100, 'Project name must be less than 100 characters'),
  
  client_id: z.string().uuid('Please select a client'),
  
  project_type: z.enum(projectTypeValues, {
    message: 'Please select a project type',
  }),

  // Optional fields with defaults
  description: z.string().max(2000, 'Description must be less than 2000 characters').default(''),
  
  status: z.enum(projectStatusValues).default('planning'),
  delivery_status: z.enum(deliveryStatusValues).default('not_started'),
  payment_status: z.enum(paymentStatusValues).default('unpaid'),
  payment_structure: z.enum(paymentStructureValues).default('fixed'),
  
  // Dates - use Project interface field names
  start_date: z.string().default(''),
  expected_completion_date: z.string().default(''),
  actual_completion_date: z.string().default(''),

  // Financial
  currency: z.enum(currencyValues).default('INR'),
  total_cost: z.coerce.number().min(0, 'Total cost must be positive').default(0),
  hourly_rate: z.coerce.number().min(0).default(0),
  estimated_hours: z.coerce.number().min(0).default(0),
  outstanding_balance: z.coerce.number().min(0).default(0),

  // Progress
  progress_percentage: z.coerce.number().min(0).max(100).default(0),

  // Technology
  technology_stack: z.array(z.string()).default([]),

  // URLs
  live_url: z.string().url('Please enter a valid URL').or(z.literal('')).default(''),
  staging_url: z.string().url('Please enter a valid URL').or(z.literal('')).default(''),
  repository_url: z.string().url('Please enter a valid URL').or(z.literal('')).default(''),
});

// Create project schema
export const createProjectSchema = projectSchema;

// Update project schema
export const updateProjectSchema = projectSchema.partial().extend({
  id: z.string().uuid('Invalid project ID'),
});

// Types inferred from schemas
export type ProjectFormData = z.infer<typeof projectSchema>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;

// Default values for form
export const defaultProjectValues: ProjectFormData = {
  project_name: '',
  client_id: '',
  project_type: 'website',
  description: '',
  status: 'planning',
  delivery_status: 'not_started',
  payment_status: 'unpaid',
  payment_structure: 'fixed',
  start_date: '',
  expected_completion_date: '',
  actual_completion_date: '',
  currency: 'INR',
  total_cost: 0,
  hourly_rate: 0,
  estimated_hours: 0,
  outstanding_balance: 0,
  progress_percentage: 0,
  technology_stack: [],
  live_url: '',
  staging_url: '',
  repository_url: '',
};

/**
 * Transform form data to DTO format for API calls
 */
export function transformProjectFormToDTO(data: ProjectFormData): Record<string, unknown> {
  const transformed: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Convert empty strings to undefined for optional fields
      const optionalStringFields = [
        'description', 'start_date', 'expected_completion_date', 'actual_completion_date',
        'live_url', 'staging_url', 'repository_url'
      ];
      if (optionalStringFields.includes(key)) {
        transformed[key] = value.trim() !== '' ? value : undefined;
      } else {
        transformed[key] = value;
      }
    } else {
      transformed[key] = value;
    }
  }
  
  return transformed;
}
