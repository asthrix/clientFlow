// ============================================
// ClientFlow CRM - Credential Validation Schemas
// Zod schemas for credential form validation
// ============================================

import { z } from 'zod';

// Credential type enum values
export const credentialTypeValues = [
  'domain',
  'hosting',
  'database',
  'ftp',
  'email',
  'cms',
  'api',
  'ssh',
  'other',
] as const;

// Base credential schema
export const credentialSchema = z.object({
  project_id: z.string().uuid('Please select a project').or(z.literal('')).default(''),
  
  credential_type: z.enum(credentialTypeValues, {
    message: 'Please select a credential type',
  }),
  
  service_name: z
    .string()
    .min(2, 'Service name must be at least 2 characters')
    .max(100, 'Service name must be less than 100 characters'),
  
  username: z.string().max(200, 'Username must be less than 200 characters').default(''),
  password: z.string().max(500, 'Password must be less than 500 characters').default(''),
  api_key: z.string().max(500, 'API key must be less than 500 characters').default(''),
  
  expiry_date: z.string().default(''),
  
  // Additional info stored as JSON
  additional_info: z.record(z.string(), z.unknown()).optional(),
});

// Create credential schema
export const createCredentialSchema = credentialSchema;

// Update credential schema
export const updateCredentialSchema = credentialSchema.partial().extend({
  id: z.string().uuid('Invalid credential ID'),
});

// Types inferred from schemas
export type CredentialFormData = z.infer<typeof credentialSchema>;
export type CreateCredentialFormData = z.infer<typeof createCredentialSchema>;
export type UpdateCredentialFormData = z.infer<typeof updateCredentialSchema>;

// Default values for form
export const defaultCredentialValues: CredentialFormData = {
  project_id: '',
  credential_type: 'other',
  service_name: '',
  username: '',
  password: '',
  api_key: '',
  expiry_date: '',
};

/**
 * Transform form data to DTO format for API calls
 */
export function transformCredentialFormToDTO(data: CredentialFormData): Record<string, unknown> {
  const transformed: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      transformed[key] = value.trim() !== '' ? value : undefined;
    } else {
      transformed[key] = value;
    }
  }
  
  return transformed;
}
