'use client';

// ============================================
// ClientFlow CRM - Multi-Credential Form Component
// Form for adding multiple credentials at once
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariants, shakeVariants } from '@/lib/animations';
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
import { useCreateMultipleCredentials } from '@/hooks/mutations/useCreateMultipleCredentials';
import type { CredentialType } from '@/types';
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
  Plus,
  Trash2,
} from 'lucide-react';

// Single credential entry type
interface CredentialEntry {
  id: string;
  credential_type: CredentialType;
  service_name: string;
  username: string;
  password: string;
  api_key: string;
  expiry_date: string;
}

interface MultiCredentialFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  minCredentials?: number;
}

// Credential type options
const credentialTypes: { value: CredentialType; label: string }[] = [
  { value: 'domain', label: 'Domain' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'database', label: 'Database' },
  { value: 'ftp', label: 'FTP' },
  { value: 'email', label: 'Email' },
  { value: 'cms', label: 'CMS' },
  { value: 'api', label: 'API Key' },
  { value: 'ssh', label: 'SSH' },
  { value: 'other', label: 'Other' },
];

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Create empty credential entry
const createEmptyEntry = (): CredentialEntry => ({
  id: generateId(),
  credential_type: 'other',
  service_name: '',
  username: '',
  password: '',
  api_key: '',
  expiry_date: '',
});

export function MultiCredentialForm({
  projectId,
  onSuccess,
  onCancel,
  minCredentials = 1,
}: MultiCredentialFormProps) {
  const [entries, setEntries] = useState<CredentialEntry[]>([createEmptyEntry()]);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [visibleApiKeys, setVisibleApiKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const createCredentials = useCreateMultipleCredentials();

  // Add new credential entry
  const addEntry = () => {
    setEntries([...entries, createEmptyEntry()]);
  };

  // Remove credential entry
  const removeEntry = (id: string) => {
    if (entries.length > minCredentials) {
      setEntries(entries.filter((e) => e.id !== id));
      setVisiblePasswords((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setVisibleApiKeys((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Update entry field
  const updateEntry = (id: string, field: keyof CredentialEntry, value: string) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle API key visibility
  const toggleApiKeyVisibility = (id: string) => {
    setVisibleApiKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Validate entries
  const validateEntries = (): boolean => {
    return entries.every((e) => e.service_name.trim() !== '');
  };

  const isLoading = createCredentials.isPending;

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateEntries()) {
      return;
    }

    // Transform entries to DTOs
    const credentialData = entries
      .filter((entry) => entry.service_name.trim() !== '')
      .map((entry) => ({
        credential_type: entry.credential_type,
        service_name: entry.service_name,
        username: entry.username || undefined,
        password: entry.password || undefined,
        api_key: entry.api_key || undefined,
        expiry_date: entry.expiry_date || undefined,
      }));

    try {
      await createCredentials.mutateAsync({
        projectId,
        credentials: credentialData,
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create credentials');
    }
  };

  return (
    <motion.form
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      onSubmit={handleSubmit}
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

      {/* Credential Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Credentials ({entries.length})
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEntry}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another
          </Button>
        </div>

        <AnimatePresence mode="popLayout">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative rounded-lg border border-border bg-muted/30 p-4"
            >
              {/* Entry Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">
                  Credential {index + 1}
                </span>
                {entries.length > minCredentials && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4">
                {/* Row 1: Service Name & Type */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`service_name_${entry.id}`}>Service Name *</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={`service_name_${entry.id}`}
                        placeholder="e.g., AWS Console"
                        className="pl-10"
                        value={entry.service_name}
                        onChange={(e) => updateEntry(entry.id, 'service_name', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`type_${entry.id}`}>Type</Label>
                    <Select 
                      value={entry.credential_type} 
                      onValueChange={(value) => updateEntry(entry.id, 'credential_type', value as CredentialType)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {credentialTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Username & Password */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`username_${entry.id}`}>Username / Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={`username_${entry.id}`}
                        placeholder="admin@example.com"
                        className="pl-10"
                        value={entry.username}
                        onChange={(e) => updateEntry(entry.id, 'username', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`password_${entry.id}`}>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={`password_${entry.id}`}
                        type={visiblePasswords.has(entry.id) ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={entry.password}
                        onChange={(e) => updateEntry(entry.id, 'password', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(entry.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {visiblePasswords.has(entry.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Row 3: API Key & Expiry */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`api_key_${entry.id}`}>API Key / Token</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={`api_key_${entry.id}`}
                        type={visibleApiKeys.has(entry.id) ? 'text' : 'password'}
                        placeholder="sk_live_..."
                        className="pl-10 pr-10"
                        value={entry.api_key}
                        onChange={(e) => updateEntry(entry.id, 'api_key', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => toggleApiKeyVisibility(entry.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {visibleApiKeys.has(entry.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`expiry_${entry.id}`}>Expiry Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={`expiry_${entry.id}`}
                        type="date"
                        className="pl-10"
                        value={entry.expiry_date}
                        onChange={(e) => updateEntry(entry.id, 'expiry_date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
            disabled={isLoading || !validateEntries()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving {entries.length} credential{entries.length > 1 ? 's' : ''}...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save {entries.length} Credential{entries.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
