'use client';

// ============================================
// ClientFlow CRM - Credential Form Component
// Form for creating and editing credentials
// ============================================

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  credentialSchema,
  defaultCredentialValues,
  credentialTypeValues,
  type CredentialFormData,
} from '@/lib/validations/credential';
import { fadeUpVariants, fieldErrorVariants, shakeVariants } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProjects } from '@/hooks/queries/useProjects';
import type { Credential, CredentialType } from '@/types';
import {
  Key,
  User,
  Lock,
  Calendar,
  Loader2,
  Save,
  X,
  Eye,
  EyeOff,
  FolderKanban,
} from 'lucide-react';

interface CredentialFormProps {
  credential?: Credential;
  onSubmit: (data: CredentialFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  defaultProjectId?: string;
}

// Credential type labels
const credentialTypeLabels: Record<CredentialType, string> = {
  domain: 'Domain',
  hosting: 'Hosting',
  database: 'Database',
  ftp: 'FTP',
  email: 'Email',
  cms: 'CMS',
  api: 'API Key',
  ssh: 'SSH',
  other: 'Other',
};

export function CredentialForm({
  credential,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  defaultProjectId,
}: CredentialFormProps) {
  const isEditing = !!credential;
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Fetch projects for dropdown
  const { data: projectsData } = useProjects({ pageSize: 100 });
  const projects = projectsData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<CredentialFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(credentialSchema) as any,
    defaultValues: credential ? {
      project_id: credential.project_id || '',
      credential_type: credential.credential_type,
      service_name: credential.service_name,
      username: credential.username || '',
      password: credential.password || '',
      api_key: credential.api_key || '',
      expiry_date: credential.expiry_date || '',
    } : {
      ...defaultCredentialValues,
      project_id: defaultProjectId || '',
    },
  });

  // Reset form when credential changes
  useEffect(() => {
    if (credential) {
      reset({
        project_id: credential.project_id || '',
        credential_type: credential.credential_type,
        service_name: credential.service_name,
        username: credential.username || '',
        password: credential.password || '',
        api_key: credential.api_key || '',
        expiry_date: credential.expiry_date || '',
      });
    }
  }, [credential, reset]);

  const handleFormSubmit = async (data: CredentialFormData) => {
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
          Credential Details
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Service Name */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="service_name">Service Name *</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="service_name"
                placeholder="e.g., AWS Console, Vercel"
                className="pl-10"
                {...register('service_name')}
              />
            </div>
            <AnimatePresence>
              {errors.service_name && (
                <motion.p
                  variants={fieldErrorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-xs text-destructive"
                >
                  {errors.service_name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Credential Type */}
          <div className="space-y-2">
            <Label htmlFor="credential_type">Type *</Label>
            <Controller
              control={control}
              name="credential_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {credentialTypeValues.map((type) => (
                      <SelectItem key={type} value={type}>
                        {credentialTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label htmlFor="project_id">Project (Optional)</Label>
            <Controller
              control={control}
              name="project_id"
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <FolderKanban className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="No project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.project_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Login Information
        </h3>

        <div className="grid gap-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username / Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                placeholder="admin@example.com"
                className="pl-10"
                {...register('username')}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="api_key">API Key / Token</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="api_key"
                type={showApiKey ? 'text' : 'password'}
                placeholder="sk_live_..."
                className="pl-10 pr-10"
                {...register('api_key')}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expiry */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Expiry (Optional)
        </h3>

        <div className="space-y-2">
          <Label htmlFor="expiry_date">Expiry Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="expiry_date"
              type="date"
              className="pl-10"
              {...register('expiry_date')}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            You&apos;ll be notified when credentials are expiring
          </p>
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
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                {isEditing ? 'Save Changes' : 'Save Credential'}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
