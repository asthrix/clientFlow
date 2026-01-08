'use client';

// ============================================
// ClientFlow CRM - Project Form Component
// Reusable form for creating and editing projects
// ============================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  projectSchema,
  defaultProjectValues,
  projectTypeValues,
  projectStatusValues,
  deliveryStatusValues,
  paymentStatusValues,
  paymentStructureValues,
  currencyValues,
  type ProjectFormData,
} from '@/lib/validations/project';
import { 
  fadeUpVariants, 
  fieldErrorVariants,
  shakeVariants,
} from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useClients } from '@/hooks/queries/useClients';
import type { Project } from '@/types';
import {
  FolderKanban,
  User,
  Calendar,
  DollarSign,
  Loader2,
  Save,
  X,
  Code,
  Link as LinkIcon,
} from 'lucide-react';

interface ProjectFormProps {
  /** Project data for editing, undefined for new project */
  project?: Project;
  /** Submit handler */
  onSubmit: (data: ProjectFormData) => Promise<void>;
  /** Cancel handler */
  onCancel?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Pre-selected client ID */
  defaultClientId?: string;
}

const projectTypeOptions = projectTypeValues.map((value) => ({
  value,
  label: value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
}));

const statusOptions = projectStatusValues.map((value) => ({
  value,
  label: value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
}));

const deliveryOptions = deliveryStatusValues.map((value) => ({
  value,
  label: value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
}));

const paymentStatusOptions = paymentStatusValues.map((value) => ({
  value,
  label: value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
}));

const paymentStructureOptions = paymentStructureValues.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  defaultClientId,
}: ProjectFormProps) {
  const isEditing = !!project;

  // Fetch clients for dropdown
  const { data: clientsData } = useClients({ pageSize: 100 });
  const clients = clientsData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(projectSchema) as any,
    defaultValues: project ? {
      project_name: project.project_name,
      client_id: project.client_id,
      project_type: project.project_type,
      description: project.description || '',
      status: project.status,
      delivery_status: project.delivery_status,
      payment_status: project.payment_status,
      payment_structure: project.payment_structure,
      start_date: project.start_date || '',
      expected_completion_date: project.expected_completion_date || '',
      actual_completion_date: project.actual_completion_date || '',
      currency: project.currency || 'USD',
      total_cost: project.total_cost || 0,
      hourly_rate: project.hourly_rate || 0,
      estimated_hours: project.estimated_hours || 0,
      outstanding_balance: project.outstanding_balance || 0,
      progress_percentage: project.progress_percentage || 0,
      technology_stack: project.technology_stack || [],
      live_url: project.live_url || '',
      staging_url: project.staging_url || '',
      repository_url: project.repository_url || '',
    } : {
      ...defaultProjectValues,
      client_id: defaultClientId || '',
    },
  });

  const totalCost = watch('total_cost');
  const hourlyRate = watch('hourly_rate');
  const estimatedHours = watch('estimated_hours');
  const paymentStructure = watch('payment_structure');

  // Calculate outstanding balance when costs change
  useEffect(() => {
    if (paymentStructure === 'hourly') {
      const calculated = (hourlyRate || 0) * (estimatedHours || 0);
      setValue('total_cost', calculated);
      setValue('outstanding_balance', calculated);
    }
  }, [hourlyRate, estimatedHours, paymentStructure, setValue]);

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      reset({
        project_name: project.project_name,
        client_id: project.client_id,
        project_type: project.project_type,
        description: project.description || '',
        status: project.status,
        delivery_status: project.delivery_status,
        payment_status: project.payment_status,
        payment_structure: project.payment_structure,
        start_date: project.start_date || '',
        expected_completion_date: project.expected_completion_date || '',
        actual_completion_date: project.actual_completion_date || '',
        currency: project.currency || 'USD',
        total_cost: project.total_cost || 0,
        hourly_rate: project.hourly_rate || 0,
        estimated_hours: project.estimated_hours || 0,
        outstanding_balance: project.outstanding_balance || 0,
        progress_percentage: project.progress_percentage || 0,
        technology_stack: project.technology_stack || [],
        live_url: project.live_url || '',
        staging_url: project.staging_url || '',
        repository_url: project.repository_url || '',
      });
    }
  }, [project, reset]);

  const handleFormSubmit = async (data: ProjectFormData) => {
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
          {/* Project Name */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="project_name">Project Name *</Label>
            <div className="relative">
              <FolderKanban className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="project_name"
                placeholder="E-Commerce Website Redesign"
                className="pl-10"
                {...register('project_name')}
              />
            </div>
            <AnimatePresence>
              {errors.project_name && (
                <motion.p
                  variants={fieldErrorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-xs text-destructive"
                >
                  {errors.project_name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Client */}
          <div className="space-y-2">
            <Label htmlFor="client_id">Client *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="client_id"
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register('client_id')}
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.client_name} {client.company_name ? `(${client.company_name})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <AnimatePresence>
              {errors.client_id && (
                <motion.p
                  variants={fieldErrorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-xs text-destructive"
                >
                  {errors.client_id.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label htmlFor="project_type">Project Type *</Label>
            <select
              id="project_type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('project_type')}
            >
              {projectTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the project..."
              rows={3}
              {...register('description')}
            />
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Status
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Project Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('status')}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Status */}
          <div className="space-y-2">
            <Label htmlFor="delivery_status">Delivery Status</Label>
            <select
              id="delivery_status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('delivery_status')}
            >
              {deliveryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label htmlFor="progress_percentage">Progress (%)</Label>
            <Input
              id="progress_percentage"
              type="number"
              min={0}
              max={100}
              placeholder="0"
              {...register('progress_percentage')}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Timeline
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="start_date"
                type="date"
                className="pl-10"
                {...register('start_date')}
              />
            </div>
          </div>

          {/* Expected Completion */}
          <div className="space-y-2">
            <Label htmlFor="expected_completion_date">Expected Completion</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="expected_completion_date"
                type="date"
                className="pl-10"
                {...register('expected_completion_date')}
              />
            </div>
          </div>

          {/* Actual Completion */}
          <div className="space-y-2">
            <Label htmlFor="actual_completion_date">Actual Completion</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="actual_completion_date"
                type="date"
                className="pl-10"
                {...register('actual_completion_date')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Financial
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('currency')}
            >
              {currencyValues.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Structure */}
          <div className="space-y-2">
            <Label htmlFor="payment_structure">Payment Structure</Label>
            <select
              id="payment_structure"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('payment_structure')}
            >
              {paymentStructureOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <Label htmlFor="payment_status">Payment Status</Label>
            <select
              id="payment_status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('payment_status')}
            >
              {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Conditional fields based on payment structure */}
          {paymentStructure === 'hourly' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly Rate</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="hourly_rate"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    className="pl-10"
                    {...register('hourly_rate')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_hours">Estimated Hours</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register('estimated_hours')}
                />
              </div>
            </>
          ) : null}

          {/* Total Cost */}
          <div className="space-y-2">
            <Label htmlFor="total_cost">Total Cost</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="total_cost"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                className="pl-10"
                disabled={paymentStructure === 'hourly'}
                {...register('total_cost')}
              />
            </div>
          </div>

          {/* Outstanding Balance */}
          <div className="space-y-2">
            <Label htmlFor="outstanding_balance">Outstanding</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="outstanding_balance"
                type="number"
                className="pl-10"
                {...register('outstanding_balance')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* URLs */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Links
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="live_url">Live URL</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="live_url"
                type="url"
                placeholder="https://example.com"
                className="pl-10"
                {...register('live_url')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staging_url">Staging URL</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="staging_url"
                type="url"
                placeholder="https://staging.example.com"
                className="pl-10"
                {...register('staging_url')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repository_url">Repository</Label>
            <div className="relative">
              <Code className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="repository_url"
                type="url"
                placeholder="https://github.com/..."
                className="pl-10"
                {...register('repository_url')}
              />
            </div>
          </div>
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
                {isEditing ? 'Save Changes' : 'Create Project'}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
