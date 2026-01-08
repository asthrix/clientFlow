'use client';

// ============================================
// ClientFlow CRM - Settings Page
// Fully functional user settings and preferences
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { staggerContainerVariants, fadeUpVariants, cardVariants } from '@/lib/animations';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { usePreferencesStore, type Currency } from '@/store';
import { useUserProfile, useSavePreferences, useUpdateUserProfile } from '@/hooks/queries/useUserProfile';
import { signOut } from '@/lib/supabase/auth';
import { 
  User,
  Mail,
  Building2,
  Phone,
  Bell,
  Shield,
  Palette,
  LogOut,
  Save,
  Loader2,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const preferences = usePreferencesStore();
  
  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const savePrefs = useSavePreferences();
  
  // Local form state - initialize from preferences store for persistence
  const [fullName, setFullName] = useState(preferences.fullName || '');
  const [businessName, setBusinessName] = useState(preferences.businessName || '');
  const [phone, setPhone] = useState(preferences.phone || '');
  const [currency, setCurrency] = useState<Currency>(preferences.currency);
  const [notifications, setNotifications] = useState({
    email: preferences.notifications.email_notifications,
    payments: preferences.notifications.payment_reminders,
    expiry: preferences.notifications.credential_expiry_alerts,
    deadlines: preferences.notifications.project_deadline_alerts,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBusinessName(profile.business_name || '');
      setPhone(profile.phone || '');
      setCurrency((profile.currency_preference as Currency) || 'INR');
      setNotifications({
        email: profile.notification_email ?? true,
        payments: profile.notification_payments ?? true,
        expiry: profile.notification_renewals ?? true,
        deadlines: profile.notification_deadlines ?? true,
      });
      
      // Update global preferences store
      preferences.loadFromProfile({
        currency_preference: profile.currency_preference,
        theme: profile.theme,
        full_name: profile.full_name,
        business_name: profile.business_name,
        phone: profile.phone,
        notification_email: profile.notification_email,
        notification_payments: profile.notification_payments,
        notification_renewals: profile.notification_renewals,
        notification_deadlines: profile.notification_deadlines,
      });
    }
  }, [profile]);

  // Handle profile save
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateProfile.mutateAsync({
        full_name: fullName,
        business_name: businessName,
        phone: phone,
      });
      
      // Update auth store with new name
      if (user) {
        setUser({ ...user, fullName });
      }
      
      // Update preferences store
      preferences.setProfile({ fullName, businessName, phone });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    preferences.setTheme(newTheme);
    
    // Save to backend
    savePrefs.mutate({ theme: newTheme });
  };

  // Handle currency change
  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    preferences.setCurrency(newCurrency);
    
    // Save to backend
    savePrefs.mutate({ currency_preference: newCurrency });
  };

  // Handle notification toggle
  const handleNotificationChange = (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications((prev) => ({ ...prev, [key]: newValue }));
    
    // Update preferences store
    const storeKey = {
      email: 'email_notifications',
      payments: 'payment_reminders',
      expiry: 'credential_expiry_alerts',
      deadlines: 'project_deadline_alerts',
    }[key] as keyof typeof preferences.notifications;
    
    preferences.setNotifications({ [storeKey]: newValue });
    
    // Save to backend
    const backendKey = {
      email: 'notification_email',
      payments: 'notification_payments',
      expiry: 'notification_renewals',
      deadlines: 'notification_deadlines',
    }[key];
    
    savePrefs.mutate({ [backendKey]: newValue });
  };

  // Handle sign out
  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setUser(null);
    preferences.reset();
    router.push('/login');
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="business_name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your company or business"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : saveSuccess ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saveSuccess ? 'Saved!' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Preferences Grid */}
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
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
              <ToggleSetting
                label="Payment Reminders"
                description="Get notified about upcoming and overdue payments"
                checked={notifications.payments}
                onChange={() => handleNotificationChange('payments')}
              />
              <ToggleSetting
                label="Credential Expiry Alerts"
                description="Alerts when credentials are about to expire"
                checked={notifications.expiry}
                onChange={() => handleNotificationChange('expiry')}
              />
              <ToggleSetting
                label="Project Deadline Alerts"
                description="Notifications for approaching deadlines"
                checked={notifications.deadlines}
                onChange={() => handleNotificationChange('deadlines')}
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
            <div className="p-6 space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleThemeChange('light')}
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleThemeChange('dark')}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleThemeChange('system')}
                  >
                    System
                  </Button>
                </div>
              </div>

              {/* Currency Selection */}
              <div className="space-y-3">
                <Label>Currency</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'] as Currency[]).map((curr) => (
                    <Button
                      key={curr}
                      variant={currency === curr ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCurrencyChange(curr)}
                    >
                      {curr}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currency will be applied across all financial displays
                </p>
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
              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
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
  checked: boolean;
  onChange: () => void;
}

function ToggleSetting({ label, description, checked, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-foreground text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
          }`}
        />
      </button>
    </div>
  );
}
