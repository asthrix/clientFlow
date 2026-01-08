'use client';

// ============================================
// ClientFlow CRM - Settings Page
// User settings and preferences
// ============================================

import { motion } from 'framer-motion';
import { staggerContainerVariants, fadeUpVariants, cardVariants } from '@/lib/animations';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { 
  User,
  Mail,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  LogOut,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();

  const handleSignOut = async () => {
    // await signOut();
  };

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      {/* Profile Settings */}
      <motion.section variants={fadeUpVariants}>
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Profile Information</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="display_name"
                    placeholder="Your name"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="company">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Your company or business name"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Preferences */}
      <motion.section variants={fadeUpVariants}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Notifications */}
          <motion.div
            variants={cardVariants}
            className="rounded-xl border border-border bg-card"
          >
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Notifications</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ToggleSetting
                label="Email Notifications"
                description="Receive email updates about your projects"
                defaultChecked
              />
              <ToggleSetting
                label="Payment Reminders"
                description="Get notified about upcoming and overdue payments"
                defaultChecked
              />
              <ToggleSetting
                label="Credential Expiry Alerts"
                description="Alerts when credentials are about to expire"
                defaultChecked
              />
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            variants={cardVariants}
            className="rounded-xl border border-border bg-card"
          >
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Appearance</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Light
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    Dark
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    System
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Security & Account */}
      <motion.section variants={fadeUpVariants}>
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Security & Account</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">Sign Out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button variant="destructive" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

// ============================================
// Toggle Setting Component
// ============================================

interface ToggleSettingProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function ToggleSetting({ label, description, defaultChecked = false }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-foreground text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" className="peer sr-only" defaultChecked={defaultChecked} />
        <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20" />
      </label>
    </div>
  );
}
