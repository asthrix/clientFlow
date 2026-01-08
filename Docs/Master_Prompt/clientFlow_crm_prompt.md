# Freelance Web Developer CRM System - Master Prompt

## Project Overview
Build a comprehensive client and project management system for freelance web developers to manage their client database, project details, credentials, payments, and track project status with analytics and dashboard capabilities.

## Tech Stack
- **Frontend Framework**: Next.js 14+ (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
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