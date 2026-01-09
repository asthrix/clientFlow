'use client';

// ============================================
// ClientFlow CRM - Client Form Component
// Clean, professional form for creating/editing clients
// ============================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  clientSchema,
  defaultClientValues,
  clientTypeValues,
  clientSourceValues,
  clientStatusValues,
  type ClientFormData,
} from '@/lib/validations/client';
import { fadeUpVariants, fieldErrorVariants } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Client } from '@/types';
import { Loader2, AlertCircle } from 'lucide-react';

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const clientTypeOptions = clientTypeValues.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

const clientSourceOptions = [
  { value: '', label: 'Select source...' },
  ...clientSourceValues.map((value) => ({
    value,
    label: value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  })),
];

const clientStatusOptions = clientStatusValues.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export function ClientForm({
  client,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: ClientFormProps) {
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ClientFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(clientSchema) as any,
    defaultValues: client ? {
      client_name: client.client_name,
      email: client.email,
      client_type: client.client_type,
      company_name: client.company_name || '',
      phone: client.phone || '',
      secondary_contact: client.secondary_contact || '',
      address_line1: client.address_line1 || '',
      address_line2: client.address_line2 || '',
      city: client.city || '',
      state: client.state || '',
      country: client.country || '',
      postal_code: client.postal_code || '',
      client_source: client.client_source || '',
      status: client.status,
      tags: client.tags || [],
      notes: client.notes || '',
      profile_picture_url: client.profile_picture_url || '',
    } : defaultClientValues,
  });

  useEffect(() => {
    if (client) {
      reset({
        client_name: client.client_name,
        email: client.email,
        client_type: client.client_type,
        company_name: client.company_name || '',
        phone: client.phone || '',
        secondary_contact: client.secondary_contact || '',
        address_line1: client.address_line1 || '',
        address_line2: client.address_line2 || '',
        city: client.city || '',
        state: client.state || '',
        country: client.country || '',
        postal_code: client.postal_code || '',
        client_source: client.client_source || '',
        status: client.status,
        tags: client.tags || [],
        notes: client.notes || '',
        profile_picture_url: client.profile_picture_url || '',
      });
    }
  }, [client, reset]);

  const handleFormSubmit = async (data: ClientFormData) => {
    await onSubmit(data);
  };

  return (
    <motion.form
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Contact Information</h3>
        
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Client Name */}
            <div className="space-y-1.5">
              <Label htmlFor="client_name" className="text-sm">Name <span className="text-destructive">*</span></Label>
              <Input
                id="client_name"
                placeholder="John Doe"
                {...register('client_name')}
                className={errors.client_name ? 'border-destructive' : ''}
              />
              <AnimatePresence>
                {errors.client_name && (
                  <motion.p variants={fieldErrorVariants} initial="initial" animate="animate" exit="exit" className="text-xs text-destructive">
                    {errors.client_name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <Label htmlFor="company_name" className="text-sm">Company</Label>
              <Input
                id="company_name"
                placeholder="Acme Inc."
                {...register('company_name')}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p variants={fieldErrorVariants} initial="initial" animate="animate" exit="exit" className="text-xs text-destructive">
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...register('phone')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Details</h3>
        
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Client Type */}
            <div className="space-y-1.5">
              <Label htmlFor="client_type" className="text-sm">Client Type <span className="text-destructive">*</span></Label>
              <select
                id="client_type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('client_type')}
              >
                {clientTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Source */}
            <div className="space-y-1.5">
              <Label htmlFor="client_source" className="text-sm">Source</Label>
              <select
                id="client_source"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('client_source')}
              >
                {clientSourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status (only for editing) */}
            {isEditing && (
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-sm">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register('status')}
                >
                  {clientStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Section (Collapsible) */}
      <details className="group">
        <summary className="text-sm font-medium text-foreground cursor-pointer list-none flex items-center gap-2 py-2">
          <span className="text-muted-foreground transition-transform group-open:rotate-90">▶</span>
          Address (Optional)
        </summary>
        
        <div className="rounded-xl border border-border bg-muted/30 p-4 mt-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address_line1" className="text-sm">Street Address</Label>
              <Input id="address_line1" placeholder="123 Main Street" {...register('address_line1')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-sm">City</Label>
              <Input id="city" placeholder="New York" {...register('city')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-sm">State</Label>
              <Input id="state" placeholder="NY" {...register('state')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-sm">Country</Label>
              <Input id="country" placeholder="United States" {...register('country')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postal_code" className="text-sm">Postal Code</Label>
              <Input id="postal_code" placeholder="10001" {...register('postal_code')} />
            </div>
          </div>
        </div>
      </details>

      {/* Notes Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Notes</h3>
        
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <Textarea
            id="notes"
            placeholder="Any additional information about this client..."
            rows={3}
            {...register('notes')}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading || (!isDirty && isEditing)}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Save Changes' : 'Create Client'
          )}
        </Button>
      </div>
    </motion.form>
  );
}
