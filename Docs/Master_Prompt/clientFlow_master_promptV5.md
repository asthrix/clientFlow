### 15.3 Post-Deployment
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Set up error tracking (Sentry optional)
- [ ] Configure custom domain DNS
- [ ] Set up database backups in Supabase
- [ ] Create user documentation
- [ ] Create admin guide
- [ ] Monitor application performance
- [ ] Monitor error logs

### 15.4 Launch Checklist
- [ ] All features tested and working
- [ ] All animations smooth and performant
- [ ] Mobile responsive on all screens
- [ ] Fast load times (< 3 seconds)
- [ ] No console errors
- [ ] SEO meta tags added
- [ ] Favicon and app icons added
- [ ] Terms of service page (if needed)
- [ ] Privacy policy page (if needed)

---

## PHASE 16: MAINTENANCE & FUTURE ENHANCEMENTS

### 16.1 Regular Maintenance
- [ ] Monitor user feedback
- [ ] Fix bugs as they arise
- [ ] Update dependencies regularly
- [ ] Review and optimize database queries
- [ ] Monitor Supabase usage and costs
- [ ] Review security practices

### 16.2 Future Feature Ideas
- [ ] Invoice generation and PDF export
- [ ] Email integration (send invoices)
- [ ] Calendar integration for deadlines
- [ ] Time tracking per project
- [ ] Automated backup system
- [ ] Team collaboration (multi-user workspaces)
- [ ] Client portal for status updates
- [ ] Proposal generation
- [ ] Contract management and e-signatures
- [ ] Integration with payment gateways
- [ ] Mobile app (React Native)
- [ ] AI-powered insights and predictions
- [ ] Automated payment reminders via email
- [ ] WhatsApp integration for notifications
- [ ] API for third-party integrations

---

## PRIORITY CHECKLISTS

### Must-Have for MVP (Minimum Viable Product)
- [ ] User authentication (login/register)
- [ ] Client management (add, edit, view, delete)
- [ ] Project management (add, edit, view, delete)
- [ ] Basic project details and status tracking
- [ ] Credentials vault with encryption
- [ ] Dashboard with key metrics
- [ ] Search and filter
- [ ] Responsive design
- [ ] Core animations (page transitions, list items, modals)

### Should-Have for Version 1.0
- [ ] Payment tracking and milestones
- [ ] Domain and hosting management
- [ ] File upload functionality
- [ ] Task management within projects
- [ ] Activity logs
- [ ] Analytics and reports
- [ ] Notifications and reminders
- [ ] Settings and preferences
- [ ] All micro-animations polished

### Nice-to-Have for Future Versions
- [ ] Invoice generation
- [ ] Email integration
- [ ] Calendar integration
- [ ] Advanced analytics with AI insights
- [ ] Team collaboration features
- [ ] Client portal
- [ ] Mobile app

---

## DAILY DEVELOPMENT WORKFLOW

### Start of Day
1. Review todo list and prioritize tasks
2. Pull latest code (if team)
3. Check Supabase dashboard for any issues
4. Review any user feedback or bug reports

### During Development
1. Work on one feature at a time
2. Test feature immediately after implementation
3. Commit code with clear messages
4. Push to Git regularly

### End of Day
1. Test all changes made during the day
2. Update todo list with progress
3. Note any blockers or issues
4. Commit and push all code
5. Plan next day's tasks

---

## TIPS FOR SUCCESS

### Development Best Practices
- **Start Small**: Begin with MVP features, then iterate
- **Test Early**: Don't wait until the end to test
- **User Data Isolation**: Always test RLS policies thoroughly
- **Commit Often**: Small, frequent commits are better than large ones
- **Document as You Go**: Add comments and documentation while coding
- **Responsive First**: Build mobile-responsive from the start
- **Performance Matters**: Monitor bundle size and query performance

### Animation Best Practices
- **Subtle Over Flashy**: Animations should enhance, not distract
- **Consistent Timing**: Use same durations/easings throughout
- **Test Performance**: Ensure 60fps on animations
- **Reduced Motion**: Always respect user preferences
- **Purpose-Driven**: Every animation should have a reason

### Supabase Best Practices
- **RLS First**: Set up RLS policies before adding data
- **Index Wisely**: Add indexes to frequently queried columns
- **Batch Operations**: Use batch inserts/updates when possible
- **Error Handling**: Always handle Supabase errors gracefully
- **Monitor Usage**: Keep an eye on database size and API calls

### Security Best Practices
- **Never Trust Client**: Always validate on server/database level
- **Encrypt Sensitive Data**: Use Supabase encryption for passwords
- **Secure Routes**: Protect all dashboard routes with auth
- **Sanitize Inputs**: Prevent SQL injection and XSS attacks
- **Regular Audits**: Review security regularly

---

## ESTIMATED TIMELINE

- **Phase 1-2** (Setup & Auth): 2-3 days
- **Phase 3** (Layout): 1-2 days  
- **Phase 4** (Dashboard): 2-3 days
- **Phase 5** (Clients): 3-4 days
- **Phase 6** (Projects): 5-7 days
- **Phase 7** (Credentials): 2-3 days
- **Phase 8** (Analytics): 3-4 days
- **Phase 9** (Settings): 2 days
- **Phase 10-12** (Notifications, Search, Activity): 2-3 days
- **Phase 13** (Polish): 3-4 days
- **Phase 14** (Testing): 2-3 days
- **Phase 15** (Deployment): 1 day

**Total Estimated Time: 30-45 days** (working full-time)

For part-time development, expect 2-3 months.

---

## RESOURCES & DOCUMENTATION

### Essential Documentation Links
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- TanStack Query: https://tanstack.com/query/latest
- Zustand: https://zustand-demo.pmnd.rs/
- Framer Motion: https://www.framer.com/motion/
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/docs

### Helpful Tutorials
- Supabase Auth with Next.js: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
- Framer Motion Animations: https://www.framer.com/motion/introduction/

---

**Good luck with your ClientFlow development! 🚀**

---

# IMPLEMENTATION TODO LIST

## PHASE 1: PROJECT SETUP & FOUNDATION

### 1.1 Project Initialization
- [ ] Create Next.js project with TypeScript
  ```bash
  npx create-next-app@latest clientflow --typescript --tailwind --app
  ```
- [ ] Install required dependencies
  ```bash
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  npm install @tanstack/react-query
  npm install zustand
  npm install framer-motion
  npm install lucide-react
  npm install date-fns
  npm install zod react-hook-form @hookform/resolvers
  ```
- [ ] Install shadcn/ui
  ```bash
  npx shadcn-ui@latest init
  ```
- [ ] Add shadcn components needed:
  ```bash
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add input
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add dialog
  npx shadcn-ui@latest add dropdown-menu
  npx shadcn-ui@latest add select
  npx shadcn-ui@latest add table
  npx shadcn-ui@latest add form
  npx shadcn-ui@latest add toast
  npx shadcn-ui@latest add tabs
  npx shadcn-ui@latest add badge
  npx shadcn-ui@latest add avatar
  npx shadcn-ui@latest add separator
  npx shadcn-ui@latest add sheet
  npx shadcn-ui@latest add alert
  npx shadcn-ui@latest add skeleton
  ```

### 1.2 Project Structure Setup
- [ ] Create folder structure:
  ```
  /src
    /app
      /(auth)
        /login
        /register
        /forgot-password
      /(dashboard)
        /dashboard
        /clients
        /projects
        /credentials
        /analytics
        /settings
      /api
    /components
      /ui (shadcn components)
      /dashboard
      /clients
      /projects
      /credentials
      /layout
      /shared
    /lib
      /supabase
      /utils
      /validations
      /constants
    /hooks
    /store (Zustand)
    /types
  ```
- [ ] Set up TypeScript configuration
- [ ] Configure Tailwind with custom theme colors
- [ ] Set up path aliases in tsconfig.json

### 1.3 Supabase Configuration
- [ ] Create Supabase project at supabase.com
- [ ] Copy project URL and anon key
- [ ] Create `.env.local` file with Supabase credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
  ```
- [ ] Create Supabase client utility in `/lib/supabase/client.ts`
- [ ] Create Supabase server client for Server Components
- [ ] Set up middleware for auth route protection

### 1.4 Database Schema Creation
- [ ] Create `users_profiles` table
- [ ] Create `clients` table with RLS policies
- [ ] Create `projects` table with RLS policies
- [ ] Create `project_domains` table
- [ ] Create `project_hosting` table
- [ ] Create `project_databases` table
- [ ] Create `payments` table
- [ ] Create `payment_milestones` table
- [ ] Create `credentials_vault` table
- [ ] Create `project_tasks` table
- [ ] Create `project_files` table
- [ ] Create `activity_logs` table
- [ ] Set up foreign key relationships
- [ ] Create database indexes for performance
- [ ] Enable Row Level Security on all tables
- [ ] Write RLS policies for user data isolation
- [ ] Set up Storage buckets for file uploads

### 1.5 State Management & Data Fetching Setup
- [ ] Create Zustand store for auth state (`/store/authStore.ts`)
- [ ] Create Zustand store for UI state (`/store/uiStore.ts`)
- [ ] Set up TanStack Query provider in layout
- [ ] Configure query client with default options
- [ ] Create React Query custom hooks folder

### 1.6 Framer Motion Setup
- [ ] Wrap app with LazyMotion provider
- [ ] Create animation constants file (`/lib/animations.ts`)
- [ ] Create reusable animation variants
- [ ] Set up reduced motion hook

---

## PHASE 2: AUTHENTICATION SYSTEM

### 2.1 Authentication UI Components
- [ ] Create Login page (`/app/(auth)/login/page.tsx`)
  - [ ] Add email/password form
  - [ ] Add form validation with Zod
  - [ ] Add loading states
  - [ ] Add error handling
  - [ ] Add "Forgot Password" link
  - [ ] Add page entry animation
- [ ] Create Register page (`/app/(auth)/register/page.tsx`)
  - [ ] Add registration form
  - [ ] Add password strength indicator
  - [ ] Add form validation
  - [ ] Add terms acceptance checkbox
- [ ] Create Forgot Password page
  - [ ] Add email input form
  - [ ] Add reset email sent confirmation
- [ ] Style auth pages with gradient backgrounds

### 2.2 Authentication Logic
- [ ] Create auth service functions (`/lib/supabase/auth.ts`)
  - [ ] `signIn(email, password)`
  - [ ] `signUp(email, password, fullName)`
  - [ ] `signOut()`
  - [ ] `resetPassword(email)`
  - [ ] `updatePassword(newPassword)`
- [ ] Create auth hooks (`/hooks/useAuth.ts`)
- [ ] Implement session management
- [ ] Create protected route wrapper
- [ ] Add auth state persistence
- [ ] Handle auth errors gracefully

### 2.3 User Profile Setup
- [ ] Create user profile on registration
- [ ] Add profile completion check
- [ ] Create profile setup wizard (optional)

---

## PHASE 3: LAYOUT & NAVIGATION

### 3.1 Dashboard Layout
- [ ] Create main layout component (`/components/layout/DashboardLayout.tsx`)
- [ ] Create sidebar component
  - [ ] Add navigation links with icons
  - [ ] Add active state highlighting
  - [ ] Add user profile section at bottom
  - [ ] Add collapse/expand functionality
  - [ ] Add sidebar slide animation
- [ ] Create header/topbar component
  - [ ] Add search bar
  - [ ] Add notifications icon
  - [ ] Add user dropdown menu
  - [ ] Add theme toggle
- [ ] Create mobile navigation
  - [ ] Add hamburger menu
  - [ ] Add slide-in drawer animation
- [ ] Implement responsive layout

### 3.2 Common Components
- [ ] Create PageHeader component
- [ ] Create EmptyState component
- [ ] Create LoadingSpinner component
- [ ] Create Skeleton loaders
- [ ] Create ConfirmDialog component
- [ ] Create Toast notification system
- [ ] Add animations to all interactive elements

---

## PHASE 4: DASHBOARD MODULE

### 4.1 Dashboard Page Structure
- [ ] Create dashboard page (`/app/(dashboard)/dashboard/page.tsx`)
- [ ] Create dashboard layout with grid system
- [ ] Add page entry animation with stagger

### 4.2 Dashboard Widgets/Cards
- [ ] Create StatsCard component
  - [ ] Total clients count
  - [ ] Active projects count
  - [ ] Completed projects count
  - [ ] Total revenue
  - [ ] Add counter animation
  - [ ] Add hover lift effect
- [ ] Create RecentClients widget
  - [ ] Fetch recent 5 clients
  - [ ] Add list with avatars
  - [ ] Add click to navigate
  - [ ] Add list stagger animation
- [ ] Create RecentProjects widget
  - [ ] Show latest projects with status
  - [ ] Add status badge animations
- [ ] Create UpcomingRenewals widget
  - [ ] Show domain/hosting renewals
  - [ ] Add countdown indicator
  - [ ] Add urgent/warning states
- [ ] Create PendingPayments widget
  - [ ] Show outstanding invoices
  - [ ] Add total amount
  - [ ] Add list of overdue payments
- [ ] Create ProjectStatusChart
  - [ ] Install chart library (recharts)
  - [ ] Create pie/donut chart
  - [ ] Add chart entry animation
  - [ ] Add interactive tooltips
- [ ] Create RevenueChart
  - [ ] Create line/bar chart
  - [ ] Add monthly revenue data
  - [ ] Add progressive rendering animation
- [ ] Create ActivityFeed widget
  - [ ] Show recent activities
  - [ ] Add timeline design
  - [ ] Add fade-in animation

### 4.3 Dashboard Data Fetching
- [ ] Create dashboard queries (`/hooks/queries/useDashboardData.ts`)
- [ ] Fetch all dashboard data efficiently
- [ ] Add loading states
- [ ] Add error states
- [ ] Implement data caching

---

## PHASE 5: CLIENT MANAGEMENT MODULE

### 5.1 Client List Page
- [ ] Create clients page (`/app/(dashboard)/clients/page.tsx`)
- [ ] Create ClientList component
  - [ ] Design card/table layout
  - [ ] Add client avatar/logo
  - [ ] Show client name, email, project count
  - [ ] Add status badges
  - [ ] Add hover card animation
- [ ] Add "Add New Client" button with hover effect
- [ ] Implement search functionality
  - [ ] Add search input with icon
  - [ ] Add debounced search
  - [ ] Add search result animations
- [ ] Implement filter dropdown
  - [ ] Filter by status
  - [ ] Filter by tags
  - [ ] Filter by date added
  - [ ] Add smooth dropdown animation
- [ ] Add sorting options
- [ ] Implement pagination
- [ ] Add empty state for no clients

### 5.2 Add/Edit Client Form
- [ ] Create ClientForm component
- [ ] Open form in modal/dialog with scale animation
- [ ] Create form fields:
  - [ ] Client name (required)
  - [ ] Company name
  - [ ] Email (required, validated)
  - [ ] Phone number
  - [ ] Address fields
  - [ ] Client type dropdown
  - [ ] Tags input (multi-select)
  - [ ] Status select
  - [ ] Notes textarea
  - [ ] Profile picture upload
- [ ] Add form validation with Zod
- [ ] Add field focus animations
- [ ] Add error shake animation
- [ ] Add loading state on submit
- [ ] Add success animation/toast

### 5.3 Client Details Page
- [ ] Create client details page (`/app/(dashboard)/clients/[id]/page.tsx`)
- [ ] Create ClientHeader component
  - [ ] Show client avatar/logo
  - [ ] Show client name and info
  - [ ] Add edit/delete buttons
- [ ] Create ClientInfo section
  - [ ] Display all client details
  - [ ] Add expandable sections animation
- [ ] Create ClientProjects section
  - [ ] List all projects for this client
  - [ ] Add project cards with animation
  - [ ] Add "Add Project" button
- [ ] Create ClientActivity section
  - [ ] Show recent activities
  - [ ] Add timeline animation
- [ ] Add page transition animation

### 5.4 Client Data Operations
- [ ] Create client queries (`/hooks/queries/useClients.ts`)
  - [ ] `useClients()` - fetch all clients
  - [ ] `useClient(id)` - fetch single client
  - [ ] `useClientProjects(id)` - fetch client's projects
- [ ] Create client mutations (`/hooks/mutations/useClientMutations.ts`)
  - [ ] `useCreateClient()`
  - [ ] `useUpdateClient()`
  - [ ] `useDeleteClient()`
- [ ] Add optimistic updates
- [ ] Add query invalidation

### 5.5 Client Features
- [ ] Export clients to CSV
- [ ] Bulk actions (delete, archive)
- [ ] Client archiving functionality
- [ ] Client statistics

---

## PHASE 6: PROJECT MANAGEMENT MODULE

### 6.1 Projects List Page
- [ ] Create projects page (`/app/(dashboard)/projects/page.tsx`)
- [ ] Create ProjectList component
  - [ ] Design card layout with project thumbnail
  - [ ] Show project name, client, status
  - [ ] Show progress bar with animation
  - [ ] Add status badges with pulse for active
  - [ ] Add hover lift effect
- [ ] Add "Create New Project" button
- [ ] Implement Kanban board view (optional)
- [ ] Implement search and filter
  - [ ] Filter by status
  - [ ] Filter by client
  - [ ] Filter by project type
  - [ ] Filter by date range
- [ ] Add sorting options
- [ ] Add view toggle (grid/list/kanban)
- [ ] Implement pagination

### 6.2 Create/Edit Project Form
- [ ] Create comprehensive ProjectForm component
- [ ] Use multi-step form or tabs
- [ ] **Tab 1: Basic Information**
  - [ ] Project name
  - [ ] Client selection
  - [ ] Project type
  - [ ] Description
  - [ ] Technology stack (multi-select)
  - [ ] Dates (start, expected completion)
  - [ ] Repository URL
  - [ ] Live URL, Staging URL
  - [ ] Add smooth tab transition animation
- [ ] **Tab 2: Status & Progress**
  - [ ] Status dropdown
  - [ ] Delivery status
  - [ ] Payment status
  - [ ] Progress slider (0-100%)
- [ ] **Tab 3: Pricing**
  - [ ] Total cost
  - [ ] Currency selector
  - [ ] Payment structure
  - [ ] Hourly rate (conditional)
  - [ ] Estimated hours
- [ ] Form validation
- [ ] Save as draft functionality
- [ ] Add loading states with animation

### 6.3 Project Details Page
- [ ] Create project details page (`/app/(dashboard)/projects/[id]/page.tsx`)
- [ ] Create tabbed interface with smooth transitions
- [ ] **Overview Tab**
  - [ ] Project header with edit button
  - [ ] Status cards with icons
  - [ ] Progress indicator
  - [ ] Client information card
  - [ ] Quick actions (view live, repo, etc.)
  - [ ] Add card entry stagger animation
- [ ] **Domain & Hosting Tab**
  - [ ] Domain information section
  - [ ] Hosting information section
  - [ ] Database information section
  - [ ] Add/edit forms for each
  - [ ] Show renewal alerts
  - [ ] Add expandable sections animation
- [ ] **Financials Tab**
  - [ ] Payment summary cards
  - [ ] Payment milestones list
  - [ ] Payment history table
  - [ ] Add payment button
  - [ ] Outstanding balance highlight
  - [ ] Add counter animations for amounts
- [ ] **Tasks Tab**
  - [ ] Task list with checkboxes
  - [ ] Add new task form
  - [ ] Mark as complete animation
  - [ ] Progress indicator
  - [ ] Drag to reorder (optional)
- [ ] **Files Tab**
  - [ ] File upload zone with drag & drop
  - [ ] Uploaded files list
  - [ ] Download/delete actions
  - [ ] File preview (images, PDFs)
  - [ ] Add upload progress animation
- [ ] **Activity Tab**
  - [ ] Activity timeline
  - [ ] Show all changes and updates
  - [ ] Add timeline animation

### 6.4 Domain, Hosting & Database Management
- [ ] Create DomainForm component
  - [ ] All domain fields
  - [ ] Credentials (with toggle visibility)
  - [ ] Renewal date picker
  - [ ] Auto-renewal toggle
- [ ] Create HostingForm component
  - [ ] All hosting fields
  - [ ] Server details
  - [ ] Credentials (encrypted)
- [ ] Create DatabaseForm component
  - [ ] Database connection details
  - [ ] Credentials (encrypted)
  - [ ] Backup information
- [ ] Add form animations

### 6.5 Payment Management
- [ ] Create PaymentMilestoneForm
- [ ] Create RecordPaymentForm
  - [ ] Amount input
  - [ ] Date picker
  - [ ] Payment method
  - [ ] Transaction reference
- [ ] Create payment history table
- [ ] Add payment received animation
- [ ] Calculate and show outstanding balance
- [ ] Show payment status indicators

### 6.6 Task Management
- [ ] Create TaskList component
- [ ] Create AddTaskForm (inline or modal)
- [ ] Implement checkbox toggle with animation
- [ ] Add task completion celebration animation
- [ ] Show completed tasks separately
- [ ] Add task due date functionality

### 6.7 File Management
- [ ] Set up Supabase Storage bucket
- [ ] Create FileUpload component
  - [ ] Drag and drop zone
  - [ ] File size validation
  - [ ] File type validation
  - [ ] Upload progress bar animation
  - [ ] Multi-file upload support
- [ ] Create FileList component
  - [ ] File icons by type
  - [ ] File size display
  - [ ] Download button
  - [ ] Delete button with confirmation
- [ ] Implement file preview for images/PDFs

### 6.8 Project Data Operations
- [ ] Create project queries (`/hooks/queries/useProjects.ts`)
  - [ ] `useProjects()`
  - [ ] `useProject(id)`
  - [ ] `useProjectDomain(id)`
  - [ ] `useProjectHosting(id)`
  - [ ] `useProjectDatabase(id)`
  - [ ] `useProjectPayments(id)`
  - [ ] `useProjectTasks(id)`
  - [ ] `useProjectFiles(id)`
- [ ] Create project mutations
  - [ ] `useCreateProject()`
  - [ ] `useUpdateProject()`
  - [ ] `useDeleteProject()`
  - [ ] `useAddDomain()`, `useUpdateDomain()`
  - [ ] `useAddHosting()`, `useUpdateHosting()`
  - [ ] `useAddDatabase()`, `useUpdateDatabase()`
  - [ ] `useAddPayment()`
  - [ ] `useAddTask()`, `useUpdateTask()`, `useDeleteTask()`
  - [ ] `useUploadFile()`, `useDeleteFile()`

---

## PHASE 7: CREDENTIALS VAULT MODULE

### 7.1 Credentials Vault Page
- [ ] Create credentials page (`/app/(dashboard)/credentials/page.tsx`)
- [ ] Create CredentialsList component
  - [ ] Group by type (Domain, Hosting, Database, etc.)
  - [ ] Show service name and username
  - [ ] Hide password by default
  - [ ] Add reveal/hide password toggle with animation
  - [ ] Add copy to clipboard button with feedback animation
  - [ ] Add card hover effect
- [ ] Add "Add New Credential" button
- [ ] Implement search functionality
- [ ] Add filter by type
- [ ] Add filter by project
- [ ] Show credential expiry warnings

### 7.2 Add/Edit Credential Form
- [ ] Create CredentialForm component
- [ ] Open in modal with scale animation
- [ ] Form fields:
  - [ ] Credential type dropdown
  - [ ] Service name
  - [ ] Associated project (optional)
  - [ ] Username
  - [ ] Password (with show/hide toggle)
  - [ ] Password strength indicator
  - [ ] API key field (optional)
  - [ ] Additional info (JSON)
  - [ ] Expiry date
- [ ] Form validation
- [ ] Add save animation

### 7.3 Credential Features
- [ ] Password reveal/hide with smooth transition
- [ ] Copy to clipboard functionality
  - [ ] Show "Copied!" toast animation
  - [ ] Reset after 2 seconds
- [ ] Password generator (optional)
- [ ] Expiry date reminders
- [ ] Last accessed timestamp update
- [ ] Encryption handling (Supabase)

### 7.4 Credential Data Operations
- [ ] Create credential queries (`/hooks/queries/useCredentials.ts`)
  - [ ] `useCredentials()`
  - [ ] `useCredential(id)`
  - [ ] `useCredentialsByProject(projectId)`
- [ ] Create credential mutations
  - [ ] `useCreateCredential()`
  - [ ] `useUpdateCredential()`
  - [ ] `useDeleteCredential()`

---

## PHASE 8: ANALYTICS & REPORTS MODULE

### 8.1 Analytics Page Structure
- [ ] Create analytics page (`/app/(dashboard)/analytics/page.tsx`)
- [ ] Create page layout with sections
- [ ] Add date range picker for filtering
- [ ] Add export button for reports

### 8.2 Financial Analytics
- [ ] Create RevenueOverview component
  - [ ] Total revenue card with counter animation
  - [ ] Revenue growth percentage
  - [ ] Comparison with previous period
- [ ] Create RevenueChart component
  - [ ] Line chart for revenue over time
  - [ ] Bar chart option
  - [ ] Add chart entry animation
  - [ ] Interactive tooltips
- [ ] Create PaymentStatusPie component
  - [ ] Paid vs unpaid vs overdue
  - [ ] Add progressive arc animation
- [ ] Create TopClientsByRevenue component
  - [ ] Bar chart or table
  - [ ] Show client names and amounts
  - [ ] Add bar growth animation
- [ ] Create OutstandingPayments component
  - [ ] List of unpaid invoices
  - [ ] Total outstanding amount

### 8.3 Project Analytics
- [ ] Create ProjectStatusDistribution chart
  - [ ] Pie/donut chart by status
  - [ ] Add animated segments
- [ ] Create ProjectCompletionRate widget
  - [ ] Percentage of completed projects
  - [ ] Trend indicator
- [ ] Create AverageProjectDuration widget
  - [ ] Calculate average days
  - [ ] Compare by project type
- [ ] Create ProjectsByTechnology chart
  - [ ] Bar chart of tech stack usage
  - [ ] Add stagger animation

### 8.4 Client Analytics
- [ ] Create TotalClientsCard
  - [ ] Active vs inactive count
  - [ ] Growth rate
- [ ] Create ClientAcquisitionChart
  - [ ] Line chart over time
  - [ ] Show acquisition sources
- [ ] Create TopClientsByProjects
  - [ ] List of clients with most projects
- [ ] Create ClientRetentionRate widget

### 8.5 Reports & Export
- [ ] Create ExportReport component
  - [ ] Select report type
  - [ ] Select date range
  - [ ] Choose format (PDF/CSV)
  - [ ] Generate and download
- [ ] Implement PDF generation
- [ ] Implement CSV generation
- [ ] Add download progress animation

### 8.6 Analytics Data Operations
- [ ] Create analytics queries (`/hooks/queries/useAnalytics.ts`)
  - [ ] `useFinancialAnalytics(dateRange)`
  - [ ] `useProjectAnalytics(dateRange)`
  - [ ] `useClientAnalytics(dateRange)`
  - [ ] `useRevenueData(dateRange)`
- [ ] Create data aggregation functions
- [ ] Optimize queries for performance

---

## PHASE 9: SETTINGS MODULE

### 9.1 Settings Page Structure
- [ ] Create settings page (`/app/(dashboard)/settings/page.tsx`)
- [ ] Create tabbed interface
  - [ ] Profile tab
  - [ ] Preferences tab
  - [ ] Security tab
  - [ ] Notifications tab
- [ ] Add smooth tab transition animation

### 9.2 Profile Settings
- [ ] Create ProfileSettings component
- [ ] Fields:
  - [ ] Profile picture upload with preview
  - [ ] Full name
  - [ ] Business name
  - [ ] Email (read-only)
  - [ ] Phone number
  - [ ] Timezone selector
- [ ] Add save button with loading animation
- [ ] Show success toast on save

### 9.3 Preferences Settings
- [ ] Create PreferencesSettings component
- [ ] Options:
  - [ ] Default currency dropdown
  - [ ] Date format selection
  - [ ] Language (if multilingual)
  - [ ] Items per page
  - [ ] Default project view (grid/list)
- [ ] Add theme toggle (light/dark mode)
  - [ ] Smooth theme transition
  - [ ] Persist preference

### 9.4 Security Settings
- [ ] Create SecuritySettings component
- [ ] Change password form
  - [ ] Current password
  - [ ] New password
  - [ ] Confirm new password
  - [ ] Password strength indicator
- [ ] Two-factor authentication (optional)
- [ ] Active sessions list
- [ ] Add security animations

### 9.5 Notification Settings
- [ ] Create NotificationSettings component
- [ ] Toggle switches for:
  - [ ] Email notifications
  - [ ] Domain renewal reminders
  - [ ] Hosting renewal reminders
  - [ ] Payment reminders
  - [ ] Project deadline notifications
  - [ ] Task due notifications
- [ ] Add smooth toggle animations
- [ ] Save preferences

### 9.6 Settings Data Operations
- [ ] Create settings queries and mutations
  - [ ] `useUserProfile()`
  - [ ] `useUpdateProfile()`
  - [ ] `useUpdatePassword()`
  - [ ] `useUpdatePreferences()`
  - [ ] `useUpdateNotificationSettings()`

---

## PHASE 10: NOTIFICATIONS & REMINDERS

### 10.1 Notification System
- [ ] Create notification service (`/lib/notifications.ts`)
- [ ] Set up notification polling or webhooks
- [ ] Create notification badge on header
  - [ ] Show unread count with pulse animation
- [ ] Create NotificationDropdown component
  - [ ] List recent notifications
  - [ ] Mark as read functionality
  - [ ] Slide-down animation
  - [ ] Group by date
- [ ] Create notification types:
  - [ ] Domain renewal reminder
  - [ ] Hosting renewal reminder
  - [ ] Payment due reminder
  - [ ] Project deadline reminder
  - [ ] Task due reminder

### 10.2 Reminder Logic
- [ ] Create cron job or scheduled function
- [ ] Check for upcoming renewals (30, 15, 7 days)
- [ ] Check for overdue payments
- [ ] Check for project deadlines
- [ ] Send notifications to UI
- [ ] Optional: Send email notifications

### 10.3 Notification Data
- [ ] Create notifications table (optional)
- [ ] Store notification history
- [ ] Track read/unread status
- [ ] Create queries for notifications

---

## PHASE 11: SEARCH & FILTER ENHANCEMENTS

### 11.1 Global Search
- [ ] Create GlobalSearch component in header
- [ ] Implement search across:
  - [ ] Clients
  - [ ] Projects
  - [ ] Credentials
- [ ] Show results in dropdown with categories
- [ ] Add keyboard navigation (arrow keys, enter)
- [ ] Add search result animations
- [ ] Highlight matched text
- [ ] Add recent searches

### 11.2 Advanced Filtering
- [ ] Create FilterPanel component (reusable)
- [ ] Implement filter persistence (URL params or local storage)
- [ ] Add "Clear all filters" button
- [ ] Show active filter count badge
- [ ] Add filter animations (slide-in panel)

### 11.3 Saved Views
- [ ] Allow users to save filter combinations
- [ ] Create SavedViews dropdown
- [ ] Store in database or local storage
- [ ] Quick access to saved views

---

## PHASE 12: ACTIVITY LOGGING

### 12.1 Activity Log System
- [ ] Create activity logger utility
- [ ] Log user actions:
  - [ ] Client created/updated/deleted
  - [ ] Project created/updated/deleted
  - [ ] Payment received
  - [ ] Credential accessed
  - [ ] File uploaded/deleted
- [ ] Store in activity_logs table

### 12.2 Activity Display
- [ ] Create ActivityTimeline component
- [ ] Show in dashboard
- [ ] Show in client details
- [ ] Show in project details
- [ ] Add timeline animation
- [ ] Format timestamps (relative time)

---

## PHASE 13: POLISH & REFINEMENT

### 13.1 Loading States
- [ ] Add skeleton loaders for all data fetching
- [ ] Create skeleton components for:
  - [ ] Dashboard cards
  - [ ] Client cards
  - [ ] Project cards
  - [ ] Tables
- [ ] Add shimmer animation to skeletons

### 13.2 Error Handling
- [ ] Create error boundary components
- [ ] Create ErrorState component
- [ ] Add retry functionality
- [ ] Show user-friendly error messages
- [ ] Log errors for debugging

### 13.3 Empty States
- [ ] Create EmptyState component variations
- [ ] Add illustrations (optional)
- [ ] Add call-to-action buttons
- [ ] Use in:
  - [ ] No clients yet
  - [ ] No projects yet
  - [ ] No credentials yet
  - [ ] No search results
  - [ ] No data for date range

### 13.4 Accessibility
- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen readers
- [ ] Add focus indicators
- [ ] Ensure color contrast meets WCAG standards
- [ ] Add alt text to images
- [ ] Implement skip links

### 13.5 Responsive Design
- [ ] Test on mobile devices (375px+)
- [ ] Test on tablets (768px+)
- [ ] Test on desktop (1024px+)
- [ ] Adjust layouts for each breakpoint
- [ ] Optimize touch targets for mobile
- [ ] Test all animations on mobile

### 13.6 Performance Optimization
- [ ] Code splitting for routes
- [ ] Lazy load heavy components
- [ ] Optimize images (Next.js Image component)
- [ ] Minimize bundle size
- [ ] Add loading priorities
- [ ] Implement virtualization for long lists
- [ ] Optimize database queries with indexes
- [ ] Add pagination to large datasets
- [ ] Cache frequently accessed data
- [ ] Profile and optimize re-renders

### 13.7 Animation Polish
- [ ] Review all animations for smoothness
- [ ] Ensure consistent timing across app
- [ ] Test animations on lower-end devices
- [ ] Implement reduced motion support
- [ ] Add micro-interactions (button presses, hovers)
- [ ] Polish page transitions
- [ ] Add celebration animations for successes

---

## PHASE 14: TESTING

### 14.1 Manual Testing
- [ ] Test all user flows end-to-end
- [ ] Test authentication flow
- [ ] Test client CRUD operations
- [ ] Test project CRUD operations
- [ ] Test credential management
- [ ] Test payment tracking
- [ ] Test file uploads
- [ ] Test search and filter
- [ ] Test analytics and reports
- [ ] Test settings
- [ ] Test on different browsers
- [ ] Test on different devices
- [ ] Test with different data scenarios

### 14.2 Security Testing
- [ ] Verify RLS policies work correctly
- [ ] Test that users can only access their own data
- [ ] Test credential encryption
- [ ] Test authentication edge cases
- [ ] Verify no sensitive data in client-side code
- [ ] Test file upload security
- [ ] Test input sanitization

### 14.3 Performance Testing
- [ ] Test with large datasets (100+ clients, 500+ projects)
- [ ] Measure page load times
- [ ] Check bundle sizes
- [ ] Test query performance
- [ ] Monitor memory usage
- [ ] Test animation performance

### 14.4 User Acceptance Testing
- [ ] Get feedback from potential users
- [ ] Identify pain points
- [ ] Collect improvement suggestions
- [ ] Iterate based on feedback

---

## PHASE 15: DEPLOYMENT

### 15.1 Pre-Deployment
- [ ] Create production Supabase project
- [ ] Migrate database schema to production
- [ ] Set up production environment variables
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate
- [ ] Enable Supabase production mode

### 15.2 Vercel Deployment
- [ ] Connect GitHub repository to Vercel
- [ ] Configure build settings
- [ ] Add environment variables in Vercel
- [ ] Deploy to preview environment
- [ ] Test preview deployment
- [ ] Deploy to production
- [ ] Test production deployment

### 15.3 Post-Deployment
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Set up error tracking (Sentry optional)
- [ ] Configure custom domain DNS
- [ ] Set up database backups in Supabase
-# Freelance Web Developer CRM System - Master Prompt

## Project Overview
Build a comprehensive client and project management system for freelance web developers to manage their client database, project details, credentials, payments, and track project status with analytics and dashboard capabilities.

## Tech Stack
- **Frontend Framework**: Next.js 14+ (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Backend/Database**: Supabase (Authentication, Database, Storage)

## Core Features & Requirements

### 1. Authentication System
- Multi-user support with secure login/registration
- Email/password authentication via Supabase Auth
- Password reset functionality
- Protected routes - redirect to login if not authenticated
- User session management
- Each user should only access their own data (Row Level Security in Supabase)

### 2. Client Management Module

#### Client Database
Store comprehensive client information:
- **Basic Details**:
  - Client name (required)
  - Company name
  - Email address (required)
  - Phone number
  - Secondary contact details
  - Address (street, city, state, country, postal code)
  - Client type (Individual/Company/Agency)
  - Tags/Categories (for filtering)

- **Additional Information**:
  - Registration date (auto-generated)
  - Client source (Referral, Website, Social Media, etc.)
  - Notes/Description
  - Client status (Active/Inactive/Archived)
  - Profile picture/logo upload

#### Client Features
- Add, edit, delete, and view client details
- Search and filter clients by name, email, status, tags
- Sort by various fields (name, date added, project count)
- View all projects associated with a client
- Export client list to CSV

### 3. Project Management Module

#### Project Details
Store complete project information:
- **Basic Information**:
  - Project name (required)
  - Client association (dropdown/select)
  - Project type (Website, Web App, E-commerce, Landing Page, etc.)
  - Start date and expected completion date
  - Actual completion date

- **Project Status**:
  - Status options: Planning, In Progress, Under Review, Pending Client Feedback, Completed, On Hold, Cancelled
  - Delivery status: Not Started, In Development, Testing, Deployed, Delivered
  - Payment status: Unpaid, Partially Paid, Paid, Overdue
  - Progress percentage (0-100%)

- **Technical Details**:
  - Project description
  - Technology stack used
  - Repository URL (GitHub/GitLab)
  - Live URL
  - Staging URL
  - Project files/documents upload

#### Domain & Hosting Information
- **Domain Details**:
  - Domain name
  - Domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
  - Purchase date
  - Renewal date
  - Auto-renewal status
  - Domain credentials (username/password - encrypted)
  - Domain cost

- **Hosting Details**:
  - Hosting provider (AWS, DigitalOcean, Vercel, Netlify, Hostinger, etc.)
  - Server type (Shared, VPS, Cloud, Dedicated)
  - Hosting credentials (encrypted)
  - Server IP address
  - SSH details
  - Hosting cost (monthly/yearly)
  - Renewal date

- **Database Information**:
  - Database type (MySQL, PostgreSQL, MongoDB, etc.)
  - Database host
  - Database name
  - Database credentials (encrypted)
  - Database size
  - Backup frequency and location

#### Financial Information
- **Pricing Details**:
  - Total project cost
  - Currency
  - Payment structure (Fixed, Hourly, Milestone-based)
  - Hourly rate (if applicable)
  - Total hours estimated

- **Payment Tracking**:
  - Payment milestones with amounts
  - Payment received records (amount, date, method)
  - Outstanding balance
  - Payment history
  - Invoice generation and tracking
  - Payment reminders

#### Additional Project Features
- Task/milestone checklist within projects
- File attachments and documents
- Project timeline/Gantt chart view
- Comments/notes with timestamps
- Activity log (who changed what and when)

### 4. Credentials Vault
Secure storage for sensitive information:
- Categorize credentials (Domain, Hosting, Database, FTP, Email, CMS, Third-party APIs)
- Store username/password pairs (encrypted at rest)
- Store API keys and tokens
- Quick copy-to-clipboard functionality
- Password strength indicator
- Last accessed timestamp
- Expiry date reminders for credentials
- Two-factor authentication backup codes storage

### 5. Dashboard

#### Overview Metrics
- Total clients count
- Active projects count
- Completed projects count
- Total revenue earned
- Outstanding payments
- Projects by status (visual breakdown)
- Projects due this week/month
- Recent activities

#### Quick Access
- Recently accessed clients
- Recently updated projects
- Upcoming domain/hosting renewals
- Pending payments
- Projects requiring attention

#### Visual Widgets
- Revenue chart (monthly/yearly)
- Project status distribution (pie/donut chart)
- Client acquisition timeline
- Payment received vs pending (bar chart)
- Project completion rate over time

### 6. Analytics & Reports

#### Financial Analytics
- Total revenue by period (daily, weekly, monthly, yearly)
- Revenue by client
- Revenue by project type
- Payment collection rate
- Outstanding invoices report
- Profit margin analysis
- Expense tracking (domain, hosting costs)

#### Project Analytics
- Projects completed vs in-progress
- Average project duration
- Project success rate
- Projects by technology stack
- Client satisfaction tracking
- Project delays and reasons

#### Client Analytics
- Top clients by revenue
- Client retention rate
- Client acquisition sources
- Active vs inactive clients
- Projects per client

#### Exportable Reports
- Generate PDF/Excel reports
- Custom date range selection
- Filterable by client, project type, status
- Scheduled report emails (optional future enhancement)

### 7. Additional Features

#### Notifications & Reminders
- Domain renewal reminders (30, 15, 7 days before)
- Hosting renewal reminders
- Payment due reminders
- Project deadline notifications
- Task due notifications

#### Search & Filter
- Global search across clients, projects, credentials
- Advanced filtering options
- Saved filter presets
- Recent searches

#### Settings & Customization
- User profile management
- Change password
- Notification preferences
- Currency settings
- Date format preferences
- Theme customization (light/dark mode)
- Backup and export all data

#### Data Security
- All sensitive data encrypted in Supabase
- Implement Row Level Security (RLS) policies
- Secure credential storage with encryption
- Session timeout after inactivity
- Audit logs for sensitive actions

## Database Schema (Supabase)

### Tables Structure

#### users (handled by Supabase Auth)
- id (UUID, primary key)
- email (unique)
- created_at
- Additional profile data in separate table

#### user_profiles
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users)
- full_name
- business_name
- phone
- avatar_url
- currency_preference
- timezone
- created_at
- updated_at

#### clients
- id (UUID, primary key)
- user_id (UUID, foreign key) - for multi-user isolation
- client_name (required)
- company_name
- email (required)
- phone
- secondary_contact
- address_line1
- address_line2
- city
- state
- country
- postal_code
- client_type (enum: individual, company, agency)
- client_source
- status (enum: active, inactive, archived)
- tags (array)
- notes
- profile_picture_url
- created_at
- updated_at

#### projects
- id (UUID, primary key)
- user_id (UUID, foreign key)
- client_id (UUID, foreign key to clients)
- project_name (required)
- project_type
- description
- technology_stack (array)
- start_date
- expected_completion_date
- actual_completion_date
- status (enum: planning, in_progress, under_review, pending_feedback, completed, on_hold, cancelled)
- delivery_status (enum: not_started, in_development, testing, deployed, delivered)
- payment_status (enum: unpaid, partially_paid, paid, overdue)
- progress_percentage (0-100)
- repository_url
- live_url
- staging_url
- total_cost
- currency
- payment_structure (enum: fixed, hourly, milestone)
- hourly_rate
- estimated_hours
- outstanding_balance
- created_at
- updated_at

#### project_domains
- id (UUID, primary key)
- project_id (UUID, foreign key)
- domain_name
- registrar
- purchase_date
- renewal_date
- auto_renewal
- credentials_username (encrypted)
- credentials_password (encrypted)
- domain_cost
- notes
- created_at
- updated_at

#### project_hosting
- id (UUID, primary key)
- project_id (UUID, foreign key)
- hosting_provider
- server_type
- server_ip
- ssh_details (encrypted)
- credentials_username (encrypted)
- credentials_password (encrypted)
- hosting_cost
- billing_cycle (monthly/yearly)
- renewal_date
- notes
- created_at
- updated_at

#### project_databases
- id (UUID, primary key)
- project_id (UUID, foreign key)
- database_type
- database_host
- database_name
- database_username (encrypted)
- database_password (encrypted)
- database_size
- backup_location
- backup_frequency
- notes
- created_at
- updated_at

#### payments
- id (UUID, primary key)
- project_id (UUID, foreign key)
- amount
- payment_date
- payment_method
- transaction_reference
- notes
- created_at

#### payment_milestones
- id (UUID, primary key)
- project_id (UUID, foreign key)
- milestone_name
- amount
- due_date
- status (enum: pending, paid, overdue)
- paid_date
- created_at
- updated_at

#### credentials_vault
- id (UUID, primary key)
- user_id (UUID, foreign key)
- project_id (UUID, foreign key, nullable)
- credential_type (enum: domain, hosting, database, ftp, email, cms, api, other)
- service_name
- username (encrypted)
- password (encrypted)
- api_key (encrypted)
- additional_info (encrypted JSON)
- expiry_date
- last_accessed
- created_at
- updated_at

#### project_tasks
- id (UUID, primary key)
- project_id (UUID, foreign key)
- task_name
- description
- status (enum: pending, in_progress, completed)
- due_date
- completed_date
- created_at
- updated_at

#### project_files
- id (UUID, primary key)
- project_id (UUID, foreign key)
- file_name
- file_url (Supabase Storage)
- file_size
- file_type
- uploaded_by (UUID, foreign key)
- created_at

#### activity_logs
- id (UUID, primary key)
- user_id (UUID, foreign key)
- entity_type (client, project, credential, etc.)
- entity_id (UUID)
- action (created, updated, deleted, viewed)
- changes (JSON)
- created_at

## Implementation Guidelines

### Framer Motion Animation Guidelines

#### Animation Principles
- **Subtle & Professional**: Animations should enhance UX, not distract
- **Performance First**: Use transform and opacity properties for 60fps animations
- **Consistent Timing**: Maintain consistent duration and easing across the app
- **Purpose-Driven**: Every animation should serve a purpose (feedback, hierarchy, flow)

#### Standard Animation Patterns

**1. Page Transitions**
```jsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};
```

**2. Card/Item Entry Animations**
```jsx
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// For lists - stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

**3. Modal/Dialog Animations**
```jsx
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15 }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};
```

**4. Button Interactions**
```jsx
const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

// With whileHover and whileTap props
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
/>
```

**5. Loading States**
```jsx
const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
```

**6. Notification/Toast Animations**
```jsx
const toastVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 }
};
```

**7. Stat Counter Animation**
```jsx
// Use motion.span with animate prop
<motion.span
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Animate number changes */}
</motion.span>
```

**8. Sidebar/Drawer Animations**
```jsx
const sidebarVariants = {
  closed: { x: "-100%" },
  open: { 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};
```

**9. Dropdown Menu Animations**
```jsx
const dropdownVariants = {
  closed: { opacity: 0, y: -10, scale: 0.95 },
  open: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.2 }
  }
};
```

**10. Hover Effects for Cards**
```jsx
<motion.div
  whileHover={{ 
    y: -4, 
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)" 
  }}
  transition={{ duration: 0.3 }}
/>
```

#### Component-Specific Animations

**Dashboard Widgets**
- Fade in with stagger on mount
- Slight lift on hover
- Number counter animations for stats
- Chart entry animations

**Data Tables**
- Row fade-in with stagger
- Smooth expand/collapse for row details
- Hover highlight with transition

**Forms**
- Field focus scale subtle effect
- Error shake animation
- Success checkmark animation
- Submit button loading state

**Search/Filter**
- Smooth dropdown expansion
- Result item fade-in with stagger
- Clear button scale on hover

**Status Badges**
- Pulse animation for "in progress" status
- Smooth color transitions on status change

**File Upload**
- Drag-over state animation
- Upload progress animation
- Success/error state animations

#### Animation Configuration

**Global Animation Settings**
```jsx
// Use in _app.tsx or layout.tsx
import { LazyMotion, domAnimation } from "framer-motion";

<LazyMotion features={domAnimation} strict>
  {children}
</LazyMotion>
```

**Reduced Motion Support**
```jsx
import { useReducedMotion } from "framer-motion";

const shouldReduceMotion = useReducedMotion();

const variants = shouldReduceMotion 
  ? { /* simpler animations */ }
  : { /* full animations */ };
```

#### Performance Guidelines
- Use `layout` prop for layout animations
- Prefer `transform` and `opacity` over other properties
- Use `will-change` sparingly
- Implement `layoutId` for shared element transitions
- Lazy load Framer Motion with LazyMotion
- Avoid animating expensive properties (width, height, margin)

#### Areas to Apply Animations

1. **Authentication Pages**: Smooth form transitions, loading states
2. **Dashboard**: Staggered widget entry, hover effects, chart animations
3. **Client List**: List item stagger, hover lift, search result animations
4. **Project Details**: Tab transitions, expandable sections, status changes
5. **Modals/Dialogs**: Scale + fade entrance/exit, backdrop fade
6. **Navigation**: Sidebar slide, dropdown menus, active state transitions
7. **Notifications**: Slide in from right, auto-dismiss fade
8. **Data Visualizations**: Progressive chart rendering, tooltip animations
9. **Drag & Drop**: File upload zones, reorderable lists
10. **Skeleton Loaders**: Shimmer effect during data loading

### Supabase Setup
1. Enable Row Level Security (RLS) on all tables
2. Create policies to ensure users can only access their own data
3. Set up Storage buckets for file uploads (profile pictures, project files)
4. Configure email templates for authentication
5. Set up database functions for complex queries
6. Create indexes on frequently queried fields

### State Management (Zustand)
- Create stores for:
  - User authentication state
  - Dashboard data
  - Filters and search state
  - UI state (modals, drawers)
  - Form state for complex forms

### Data Fetching (TanStack Query)
- Implement queries for all read operations
- Use mutations for create, update, delete operations
- Set up query invalidation on mutations
- Implement optimistic updates for better UX
- Configure caching strategies
- Add pagination for large datasets

### UI/UX Considerations
- Responsive design for mobile, tablet, and desktop
- Loading states and skeleton screens
- Error handling with user-friendly messages
- Confirmation dialogs for destructive actions
- Toast notifications for actions
- Form validation with helpful error messages
- Keyboard shortcuts for power users
- Accessibility compliance (ARIA labels, keyboard navigation)

### Security Best Practices
- Never expose sensitive data in client-side code
- Use Supabase's built-in encryption for sensitive fields
- Implement proper RLS policies
- Sanitize user inputs
- Use environment variables for API keys
- Implement rate limiting for API calls
- Regular security audits

### Performance Optimization
- Code splitting for faster initial load
- Lazy loading of components and routes
- Image optimization with Next.js Image component
- Minimize bundle size
- Implement virtual scrolling for large lists
- Database query optimization with proper indexes
- Caching strategies with React Query

## Pages/Routes Structure

```
/login - Authentication page
/register - User registration
/forgot-password - Password reset

/dashboard - Main dashboard with overview
/clients - Client list and management
/clients/new - Add new client
/clients/[id] - Client details and projects
/clients/[id]/edit - Edit client

/projects - All projects list
/projects/new - Create new project
/projects/[id] - Project details
/projects/[id]/edit - Edit project

/credentials - Credentials vault
/analytics - Analytics and reports
/settings - User settings and preferences
/settings/profile - User profile
/settings/preferences - App preferences
```

## Development Phases

### Phase 1: Foundation
- Set up Next.js project with all dependencies
- Configure Supabase (database, auth, storage)
- Implement authentication system
- Create basic layout and navigation
- Set up Zustand stores and React Query

### Phase 2: Core Modules
- Build Client Management module
- Build Project Management module
- Implement CRUD operations for both
- Create forms with validation

### Phase 3: Extended Features
- Add Credentials Vault
- Implement domain/hosting tracking
- Add payment tracking
- Build file upload functionality

### Phase 4: Dashboard & Analytics
- Create dashboard with widgets
- Build analytics pages
- Implement charts and visualizations
- Add export functionality

### Phase 5: Polish & Enhancement
- Add notifications and reminders
- Implement search and filtering
- Add settings and customization
- Performance optimization
- Security hardening
- Testing and bug fixes

## Testing Requirements
- Unit tests for critical functions
- Integration tests for API calls
- End-to-end tests for user flows
- Test RLS policies in Supabase
- Security testing for credential storage
- Performance testing

## Deployment
- Deploy on Vercel (recommended for Next.js)
- Configure environment variables
- Set up Supabase production database
- Configure custom domain
- Set up monitoring and error tracking
- Implement analytics (optional)

## Future Enhancement Ideas
- Mobile app (React Native)
- Team collaboration features
- Time tracking integration
- Invoice generation and sending
- Email integration
- Calendar integration
- Automated backups
- AI-powered insights
- Integration with payment gateways
- Client portal for project updates
- Proposal generation
- Contract management