'use client';

// ============================================
// ClientFlow CRM - Project Form Component
// Clean, professional form for creating/editing projects
// ============================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
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
import { fadeUpVariants, fieldErrorVariants } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClients } from '@/hooks/queries/useClients';
import type { Project } from '@/types';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
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

  const { data: clientsData } = useClients({ pageSize: 100 });
  const clients = clientsData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
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
      currency: project.currency || 'INR',
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

  const hourlyRate = watch('hourly_rate');
  const estimatedHours = watch('estimated_hours');
  const paymentStructure = watch('payment_structure');

  useEffect(() => {
    if (paymentStructure === 'hourly') {
      const calculated = (hourlyRate || 0) * (estimatedHours || 0);
      setValue('total_cost', calculated);
      setValue('outstanding_balance', calculated);
    }
  }, [hourlyRate, estimatedHours, paymentStructure, setValue]);

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
        currency: project.currency || 'INR',
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

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Basic Information</h3>
        
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Project Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="project_name" className="text-sm">Project Name <span className="text-destructive">*</span></Label>
              <Input
                id="project_name"
                placeholder="E-Commerce Website Redesign"
                {...register('project_name')}
                className={errors.project_name ? 'border-destructive' : ''}
              />
              <AnimatePresence>
                {errors.project_name && (
                  <motion.p variants={fieldErrorVariants} initial="initial" animate="animate" exit="exit" className="text-xs text-destructive">
                    {errors.project_name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Client */}
            <div className="space-y-1.5">
              <Label htmlFor="client_id" className="text-sm">Client <span className="text-destructive">*</span></Label>
              <Controller
                control={control}
                name="client_id"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`w-full ${errors.client_id ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select a client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.client_name} {client.company_name ? `(${client.company_name})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <AnimatePresence>
                {errors.client_id && (
                  <motion.p variants={fieldErrorVariants} initial="initial" animate="animate" exit="exit" className="text-xs text-destructive">
                    {errors.client_id.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Project Type */}
            <div className="space-y-1.5">
              <Label htmlFor="project_type" className="text-sm">Project Type <span className="text-destructive">*</span></Label>
              <Controller
                control={control}
                name="project_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the project..."
                rows={2}
                {...register('description')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status & Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Status & Timeline</h3>
        
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Project Status */}
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-sm">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Delivery Status */}
            <div className="space-y-1.5">
              <Label htmlFor="delivery_status" className="text-sm">Delivery</Label>
              <Controller
                control={control}
                name="delivery_status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select delivery" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <Label htmlFor="progress_percentage" className="text-sm">Progress (%)</Label>
              <Input
                id="progress_percentage"
                type="number"
                min={0}
                max={100}
                placeholder="0"
                {...register('progress_percentage')}
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <Label htmlFor="start_date" className="text-sm">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                {...register('start_date')}
              />
            </div>

            {/* Expected Completion */}
            <div className="space-y-1.5">
              <Label htmlFor="expected_completion_date" className="text-sm">Expected End</Label>
              <Input
                id="expected_completion_date"
                type="date"
                {...register('expected_completion_date')}
              />
            </div>

            {/* Actual Completion */}
            <div className="space-y-1.5">
              <Label htmlFor="actual_completion_date" className="text-sm">Actual End</Label>
              <Input
                id="actual_completion_date"
                type="date"
                {...register('actual_completion_date')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Financial */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Financial</h3>
        
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Currency */}
            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-sm">Currency</Label>
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyValues.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Payment Structure */}
            <div className="space-y-1.5">
              <Label htmlFor="payment_structure" className="text-sm">Structure</Label>
              <Controller
                control={control}
                name="payment_structure"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select structure" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStructureOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Payment Status */}
            <div className="space-y-1.5">
              <Label htmlFor="payment_status" className="text-sm">Payment Status</Label>
              <Controller
                control={control}
                name="payment_status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Total Cost */}
            <div className="space-y-1.5">
              <Label htmlFor="total_cost" className="text-sm">Total Cost</Label>
              <Input
                id="total_cost"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                {...register('total_cost', { valueAsNumber: true })}
              />
            </div>
          </div>

          {paymentStructure === 'hourly' && (
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
              <div className="space-y-1.5">
                <Label htmlFor="hourly_rate" className="text-sm">Hourly Rate</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  {...register('hourly_rate', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="estimated_hours" className="text-sm">Estimated Hours</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register('estimated_hours', { valueAsNumber: true })}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Links (Collapsible) */}
      <details className="group">
        <summary className="text-sm font-medium text-foreground cursor-pointer list-none flex items-center gap-2 py-2">
          <span className="text-muted-foreground transition-transform group-open:rotate-90">▶</span>
          Links (Optional)
        </summary>
        
        <div className="rounded-xl border border-border bg-muted/30 p-4 mt-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="live_url" className="text-sm">Live URL</Label>
              <Input id="live_url" type="url" placeholder="https://..." {...register('live_url')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staging_url" className="text-sm">Staging URL</Label>
              <Input id="staging_url" type="url" placeholder="https://..." {...register('staging_url')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="repository_url" className="text-sm">Repository</Label>
              <Input id="repository_url" type="url" placeholder="https://..." {...register('repository_url')} />
            </div>
          </div>
        </div>
      </details>

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
            isEditing ? 'Save Changes' : 'Create Project'
          )}
        </Button>
      </div>
    </motion.form>
  );
}
