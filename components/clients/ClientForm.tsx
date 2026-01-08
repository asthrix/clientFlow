'use client';

// ============================================
// ClientFlow CRM - Client Form Component
// Reusable form for creating and editing clients
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
import { 
  fadeUpVariants, 
  fieldErrorVariants,
  shakeVariants,
} from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Client } from '@/types';
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Tag,
  Loader2,
  Save,
  X,
} from 'lucide-react';

interface ClientFormProps {
  /** Client data for editing, undefined for new client */
  client?: Client;
  /** Submit handler */
  onSubmit: (data: ClientFormData) => Promise<void>;
  /** Cancel handler */
  onCancel?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
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
    setValue,
    watch,
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

  const clientType = watch('client_type');

  // Reset form when client changes
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
            variants={shakeVariants}
            initial="initial"
            animate="shake"
            exit="exit"
            className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Basic Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="client_name">Client Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="client_name"
                placeholder="John Doe"
                className="pl-10"
                {...register('client_name')}
              />
            </div>
            <AnimatePresence>
              {errors.client_name && (
                <motion.p
                  variants={fieldErrorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-xs text-destructive"
                >
                  {errors.client_name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="company_name"
                placeholder="Acme Inc."
                className="pl-10"
                {...register('company_name')}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="pl-10"
                {...register('email')}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  variants={fieldErrorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-xs text-destructive"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="pl-10"
                {...register('phone')}
              />
            </div>
          </div>

          {/* Client Type */}
          <div className="space-y-2">
            <Label htmlFor="client_type">Client Type *</Label>
            <select
              id="client_type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('client_type')}
            >
              {clientTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <AnimatePresence>
              {errors.client_type && (
                <motion.p
                  variants={fieldErrorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-xs text-destructive"
                >
                  {errors.client_type.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Client Source */}
          <div className="space-y-2">
            <Label htmlFor="client_source">How did they find you?</Label>
            <select
              id="client_source"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Address
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address_line1">Street Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="address_line1"
                placeholder="123 Main Street"
                className="pl-10"
                {...register('address_line1')}
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input
              id="address_line2"
              placeholder="Apt, Suite, Building (optional)"
              {...register('address_line2')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
              {...register('city')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State / Province</Label>
            <Input
              id="state"
              placeholder="NY"
              {...register('state')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="United States"
              {...register('country')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              placeholder="10001"
              {...register('postal_code')}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Additional Notes
        </h3>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information about this client..."
            rows={4}
            {...register('notes')}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            disabled={isLoading || (!isDirty && isEditing)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Save Changes' : 'Create Client'}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
