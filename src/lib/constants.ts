// ============================================
// ClientFlow CRM - Constants
// Application-wide constants
// ============================================

// ============================================
// Navigation Items
// ============================================

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  KeyRound,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Credentials', href: '/credentials', icon: KeyRound },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

// ============================================
// Status Colors & Labels
// ============================================

export const PROJECT_STATUS_CONFIG = {
  planning: { label: 'Planning', color: 'bg-blue-500', textColor: 'text-blue-700' },
  in_progress: { label: 'In Progress', color: 'bg-amber-500', textColor: 'text-amber-700' },
  under_review: { label: 'Under Review', color: 'bg-purple-500', textColor: 'text-purple-700' },
  pending_feedback: { label: 'Pending Feedback', color: 'bg-orange-500', textColor: 'text-orange-700' },
  completed: { label: 'Completed', color: 'bg-green-500', textColor: 'text-green-700' },
  on_hold: { label: 'On Hold', color: 'bg-gray-500', textColor: 'text-gray-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-700' },
} as const;

export const PAYMENT_STATUS_CONFIG = {
  unpaid: { label: 'Unpaid', color: 'bg-red-500', textColor: 'text-red-700' },
  partially_paid: { label: 'Partially Paid', color: 'bg-amber-500', textColor: 'text-amber-700' },
  paid: { label: 'Paid', color: 'bg-green-500', textColor: 'text-green-700' },
  overdue: { label: 'Overdue', color: 'bg-red-600', textColor: 'text-red-800' },
} as const;

export const CLIENT_STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-green-500', textColor: 'text-green-700' },
  inactive: { label: 'Inactive', color: 'bg-gray-500', textColor: 'text-gray-700' },
  archived: { label: 'Archived', color: 'bg-slate-500', textColor: 'text-slate-700' },
} as const;

// ============================================
// Pagination
// ============================================

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ============================================
// Currency Formatting
// ============================================

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
};

// ============================================
// Date Formats
// ============================================

export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  displayWithTime: 'MMM dd, yyyy HH:mm',
  input: 'yyyy-MM-dd',
  relative: 'relative', // Uses date-fns formatDistanceToNow
} as const;

// ============================================
// Technology Stack Options
// ============================================

export const TECH_STACK_OPTIONS = [
  'Next.js',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Express',
  'NestJS',
  'Python',
  'Django',
  'FastAPI',
  'Ruby on Rails',
  'PHP',
  'Laravel',
  'WordPress',
  'Shopify',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Supabase',
  'Firebase',
  'AWS',
  'Vercel',
  'Tailwind CSS',
  'TypeScript',
];

// ============================================
// Hosting Providers
// ============================================

export const HOSTING_PROVIDERS = [
  'Vercel',
  'Netlify',
  'AWS',
  'DigitalOcean',
  'Heroku',
  'Google Cloud',
  'Azure',
  'Hostinger',
  'Bluehost',
  'GoDaddy',
  'Cloudflare',
  'Railway',
  'Render',
  'Fly.io',
];

// ============================================
// Domain Registrars
// ============================================

export const DOMAIN_REGISTRARS = [
  'GoDaddy',
  'Namecheap',
  'Cloudflare',
  'Google Domains',
  'Porkbun',
  'Hover',
  'Name.com',
  'Domain.com',
  'Dynadot',
  'Gandi',
];
