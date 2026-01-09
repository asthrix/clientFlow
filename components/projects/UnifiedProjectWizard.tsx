'use client';

// ============================================
// ClientFlow CRM - Unified Project Wizard
// Multi-step form for creating client + project + credentials
// ============================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariants, shakeVariants } from '@/lib/animations';
import { WizardStepIndicator, Modal } from '@/components/shared';
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
import { DatePickerForm } from '@/components/ui/date-picker';
import { useClients } from '@/hooks/queries/useClients';
import { useCreateClient } from '@/hooks/mutations/useClientMutations';
import { useCreateProject } from '@/hooks/mutations/useProjectMutations';
import { useCreateMultipleCredentials } from '@/hooks/mutations/useCreateMultipleCredentials';
import type { Client, CreateClientDTO, CreateCredentialDTO, CredentialType } from '@/types';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  User,
  Building2,
  Mail,
  Phone,
  FolderKanban,
  Calendar,
  DollarSign,
  Key,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Search,
  UserPlus,
} from 'lucide-react';

// Wizard steps definition
const WIZARD_STEPS = [
  { id: 1, label: 'Client', description: 'Select or create client' },
  { id: 2, label: 'Project', description: 'Project details' },
  { id: 3, label: 'Credentials', description: 'Add credentials (optional)' },
];

// Credential entry type
interface CredentialEntry {
  id: string;
  credential_type: CredentialType;
  service_name: string;
  username: string;
  password: string;
  api_key: string;
}

interface UnifiedProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
  defaultClientId?: string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const createEmptyCredential = (): CredentialEntry => ({
  id: generateId(),
  credential_type: 'other',
  service_name: '',
  username: '',
  password: '',
  api_key: '',
});

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

export function UnifiedProjectWizard({
  isOpen,
  onClose,
  onSuccess,
  defaultClientId,
}: UnifiedProjectWizardProps) {
  // Current step
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Client selection/creation state
  const [clientMode, setClientMode] = useState<'select' | 'create'>('select');
  const [selectedClientId, setSelectedClientId] = useState<string>(defaultClientId || '');
  const [clientSearch, setClientSearch] = useState('');
  const [newClient, setNewClient] = useState({
    client_name: '',
    email: '',
    phone: '',
    company_name: '',
  });

  // Step 2: Project details state
  const [project, setProject] = useState({
    project_name: '',
    project_type: 'website' as const,
    description: '',
    start_date: '',
    expected_completion_date: '',
    currency: 'INR' as const,
    total_cost: 0,
  });

  // Step 3: Credentials state
  const [credentials, setCredentials] = useState<CredentialEntry[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  // Queries & Mutations
  const { data: clientsData } = useClients({ pageSize: 100 });
  const clients = clientsData?.data || [];
  const createClient = useCreateClient();
  const createProject = useCreateProject();
  const createCredentials = useCreateMultipleCredentials();

  // Filter clients by search
  const filteredClients = clients.filter((c) =>
    c.client_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.company_name?.toLowerCase().includes(clientSearch.toLowerCase()) ?? false)
  );

  // Step validation
  const isStep1Valid = () => {
    if (clientMode === 'select') {
      return !!selectedClientId;
    }
    return newClient.client_name.trim() !== '' && newClient.email.trim() !== '';
  };

  const isStep2Valid = () => {
    return project.project_name.trim() !== '';
  };

  // Navigation handlers
  const handleNext = () => {
    setError(null);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final submit
  const handleSubmit = useCallback(async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      let clientId = selectedClientId;

      // Step 1: Create client if needed
      if (clientMode === 'create') {
        const clientResult = await createClient.mutateAsync({
          client_name: newClient.client_name,
          email: newClient.email,
          phone: newClient.phone || undefined,
          company_name: newClient.company_name || undefined,
          client_type: 'individual',
          status: 'active',
          tags: [],
        } as CreateClientDTO);
        clientId = clientResult.id;
      }

      // Step 2: Create project
      const projectResult = await createProject.mutateAsync({
        project_name: project.project_name,
        client_id: clientId,
        project_type: project.project_type,
        description: project.description || undefined,
        start_date: project.start_date || undefined,
        expected_completion_date: project.expected_completion_date || undefined,
        currency: project.currency,
        total_cost: project.total_cost || 0,
        status: 'planning',
        delivery_status: 'not_started',
        payment_status: 'unpaid',
        payment_structure: 'fixed',
      });

      // Step 3: Create credentials if any
      const validCredentials = credentials.filter((c) => c.service_name.trim() !== '');
      if (validCredentials.length > 0) {
        await createCredentials.mutateAsync({
          projectId: projectResult.id,
          credentials: validCredentials.map((c) => ({
            credential_type: c.credential_type,
            service_name: c.service_name,
            username: c.username || undefined,
            password: c.password || undefined,
            api_key: c.api_key || undefined,
          })),
        });
      }

      // Success!
      onSuccess?.(projectResult.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    clientMode,
    selectedClientId,
    newClient,
    project,
    credentials,
    createClient,
    createProject,
    createCredentials,
    onSuccess,
    onClose,
  ]);

  // Credential handlers
  const addCredential = () => {
    setCredentials([...credentials, createEmptyCredential()]);
  };

  const removeCredential = (id: string) => {
    setCredentials(credentials.filter((c) => c.id !== id));
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateCredential = (id: string, field: keyof CredentialEntry, value: string) => {
    setCredentials(credentials.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Reset state when closing
  const handleClose = () => {
    setCurrentStep(1);
    setError(null);
    setClientMode('select');
    setSelectedClientId(defaultClientId || '');
    setClientSearch('');
    setNewClient({ client_name: '', email: '', phone: '', company_name: '' });
    setProject({
      project_name: '',
      project_type: 'website',
      description: '',
      start_date: '',
      expected_completion_date: '',
      currency: 'INR',
      total_cost: 0,
    });
    setCredentials([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Project"
      size="lg"
    >
      {/* Step Indicator */}
      <div className="-mt-2 mb-6 flex justify-center w-full">
        <WizardStepIndicator
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step < currentStep) setCurrentStep(step);
          }}
        />
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            variants={shakeVariants}
            initial="initial"
            animate="shake"
            exit="exit"
            className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Step 1: Client */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                {/* Client mode toggle */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={clientMode === 'select' ? 'default' : 'outline'}
                    onClick={() => setClientMode('select')}
                    className="flex-1"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Select Existing
                  </Button>
                  <Button
                    type="button"
                    variant={clientMode === 'create' ? 'default' : 'outline'}
                    onClick={() => setClientMode('create')}
                    className="flex-1"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create New
                  </Button>
                </div>

                {clientMode === 'select' ? (
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search clients..."
                        className="pl-10"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                      />
                    </div>

                    {/* Client list */}
                    <div className="max-h-64 overflow-auto space-y-2 rounded-lg border border-border p-2">
                      {filteredClients.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-4">
                          No clients found. Create a new one!
                        </p>
                      ) : (
                        filteredClients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() => setSelectedClientId(client.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                              selectedClientId === client.id
                                ? 'bg-primary/10 border-primary border'
                                : 'hover:bg-muted border border-transparent'
                            }`}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{client.client_name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {client.email}
                              </p>
                            </div>
                            {selectedClientId === client.id && (
                              <Check className="h-5 w-5 text-primary shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="client_name">Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="client_name"
                            placeholder="John Doe"
                            className="pl-10"
                            value={newClient.client_name}
                            onChange={(e) =>
                              setNewClient({ ...newClient, client_name: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="client_email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="client_email"
                            type="email"
                            placeholder="john@example.com"
                            className="pl-10"
                            value={newClient.email}
                            onChange={(e) =>
                              setNewClient({ ...newClient, email: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="client_phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="client_phone"
                            placeholder="+91 98765 43210"
                            className="pl-10"
                            value={newClient.phone}
                            onChange={(e) =>
                              setNewClient({ ...newClient, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="client_company">Company</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="client_company"
                            placeholder="Acme Corp"
                            className="pl-10"
                            value={newClient.company_name}
                            onChange={(e) =>
                              setNewClient({ ...newClient, company_name: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_name">Project Name *</Label>
                    <div className="relative">
                      <FolderKanban className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="project_name"
                        placeholder="E-Commerce Website Redesign"
                        className="pl-10"
                        value={project.project_name}
                        onChange={(e) =>
                          setProject({ ...project, project_name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_type">Project Type</Label>
                    <Select 
                      value={project.project_type} 
                      onValueChange={(value) => setProject({ ...project, project_type: value as typeof project.project_type })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="web_app">Web App</SelectItem>
                        <SelectItem value="mobile_app">Mobile App</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="landing_page">Landing Page</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the project..."
                      rows={3}
                      value={project.description}
                      onChange={(e) =>
                        setProject({ ...project, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <DatePickerForm
                        id="start_date"
                        value={project.start_date}
                        onChange={(value) => setProject({ ...project, start_date: value })}
                        placeholder="Select start date"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="completion_date">Expected Completion</Label>
                      <DatePickerForm
                        id="completion_date"
                        value={project.expected_completion_date}
                        onChange={(value) => setProject({ ...project, expected_completion_date: value })}
                        placeholder="Select completion date"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={project.currency} 
                        onValueChange={(value) => setProject({ ...project, currency: value as typeof project.currency })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="total_cost">Total Cost</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="total_cost"
                          type="number"
                          min={0}
                          placeholder="0"
                          className="pl-10"
                          value={project.total_cost || ''}
                          onChange={(e) =>
                            setProject({ ...project, total_cost: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Credentials */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Add Credentials</h3>
                    <p className="text-sm text-muted-foreground">
                      Store login details, API keys, etc. (Optional)
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addCredential}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>

                {credentials.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <Key className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No credentials added yet
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={addCredential}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Credential
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-auto">
                    {credentials.map((cred, index) => (
                      <div
                        key={cred.id}
                        className="relative rounded-lg border border-border bg-muted/30 p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Credential {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeCredential(cred.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Service Name *</Label>
                            <Input
                              placeholder="AWS, Vercel, etc."
                              value={cred.service_name}
                              onChange={(e) =>
                                updateCredential(cred.id, 'service_name', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Type</Label>
                            <Select 
                              value={cred.credential_type} 
                              onValueChange={(value) => updateCredential(cred.id, 'credential_type', value)}
                            >
                              <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {credentialTypes.map((t) => (
                                  <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Username / Email</Label>
                            <Input
                              placeholder="admin@example.com"
                              value={cred.username}
                              onChange={(e) =>
                                updateCredential(cred.id, 'username', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Password</Label>
                            <div className="relative">
                              <Input
                                type={visiblePasswords.has(cred.id) ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={cred.password}
                                onChange={(e) =>
                                  updateCredential(cred.id, 'password', e.target.value)
                                }
                                className="pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(cred.id)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {visiblePasswords.has(cred.id) ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-border mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? handleClose : handleBack}
            disabled={isSubmitting}
          >
            {currentStep === 1 ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </>
            )}
          </Button>

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !isStep1Valid()) ||
                (currentStep === 2 && !isStep2Valid())
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          )}
        </div>
    </Modal>
  );
}
