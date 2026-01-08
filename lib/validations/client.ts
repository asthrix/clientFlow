// ============================================
// ClientFlow CRM - Client Validation Schemas
// Zod schemas for client form validation
// ============================================

import { z } from 'zod';

// Client type enum values
export const clientTypeValues = ['individual', 'company', 'agency'] as const;
export const clientSourceValues = [
  'referral',
  'website',
  'social_media',
  'cold_outreach',
  'freelance_platform',
  'other',
] as const;
export const clientStatusValues = ['active', 'inactive', 'archived'] as const;

// Base client schema - using strings with defaults for RHF compatibility
export const clientSchema = z.object({
  // Required fields
  client_name: z
    .string()
    .min(2, 'Client name must be at least 2 characters')
    .max(100, 'Client name must be less than 100 characters'),
  
  email: z
    .string()
    .email('Please enter a valid email address'),
  
  client_type: z.enum(clientTypeValues, {
    message: 'Please select a client type',
  }),

  // Optional string fields - all use string with default empty string
  company_name: z.string().max(100, 'Company name must be less than 100 characters').default(''),
  phone: z.string().max(20, 'Phone number must be less than 20 characters').default(''),
  secondary_contact: z.string().max(100, 'Secondary contact must be less than 100 characters').default(''),

  // Address fields
  address_line1: z.string().max(200, 'Address must be less than 200 characters').default(''),
  address_line2: z.string().max(200, 'Address must be less than 200 characters').default(''),
  city: z.string().max(100, 'City must be less than 100 characters').default(''),
  state: z.string().max(100, 'State must be less than 100 characters').default(''),
  country: z.string().max(100, 'Country must be less than 100 characters').default(''),
  postal_code: z.string().max(20, 'Postal code must be less than 20 characters').default(''),

  // Classification - string for form (empty string = no selection)
  client_source: z.string().default(''),

  status: z.enum(clientStatusValues).default('active'),

  tags: z.array(z.string()).default([]),

  notes: z.string().max(2000, 'Notes must be less than 2000 characters').default(''),
  profile_picture_url: z.string().default(''),
});

// Create client schema (for new clients)
export const createClientSchema = clientSchema;

// Update client schema (includes ID, all fields optional except ID)
export const updateClientSchema = clientSchema.partial().extend({
  id: z.string().uuid('Invalid client ID'),
});

// Types inferred from schemas
export type ClientFormData = z.infer<typeof clientSchema>;
export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;

// Default values for form - India defaults
export const defaultClientValues: ClientFormData = {
  client_name: '',
  email: '',
  client_type: 'individual',
  status: 'active',
  tags: [],
  company_name: '',
  phone: '',
  secondary_contact: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: 'Tamil Nadu',
  country: 'India',
  postal_code: '',
  client_source: '',
  notes: '',
  profile_picture_url: '',
};

/**
 * Transform form data to DTO format for API calls
 * Converts empty strings to undefined and validates enum values
 */
export function transformFormToDTO(data: ClientFormData): Record<string, unknown> {
  const transformed: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Convert empty strings to undefined
      transformed[key] = value.trim() !== '' ? value : undefined;
    } else {
      transformed[key] = value;
    }
  }
  
  // Special handling for client_source - validate it's a valid enum value
  if (transformed.client_source && 
      !clientSourceValues.includes(transformed.client_source as typeof clientSourceValues[number])) {
    transformed.client_source = undefined;
  }
  
  return transformed;
}
