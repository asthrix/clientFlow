-- ============================================
-- ClientFlow CRM - Database Schema
-- Complete Supabase PostgreSQL Migration
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USER PROFILES
-- Extended user data beyond Supabase Auth
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  currency_preference TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  date_format TEXT DEFAULT 'MMM dd, yyyy',
  theme TEXT DEFAULT 'system',
  notification_email BOOLEAN DEFAULT true,
  notification_renewals BOOLEAN DEFAULT true,
  notification_payments BOOLEAN DEFAULT true,
  notification_deadlines BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- 2. CLIENTS
-- Client/Customer records
-- ============================================

CREATE TYPE client_type AS ENUM ('individual', 'company', 'agency');
CREATE TYPE client_source AS ENUM ('referral', 'website', 'social_media', 'cold_outreach', 'freelance_platform', 'other');
CREATE TYPE client_status AS ENUM ('active', 'inactive', 'archived');

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Details
  client_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  secondary_contact TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  
  -- Classification
  client_type client_type DEFAULT 'individual' NOT NULL,
  client_source client_source,
  status client_status DEFAULT 'active' NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Additional
  notes TEXT,
  profile_picture_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for faster queries
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);

-- ============================================
-- 3. PROJECTS
-- Project/Job records
-- ============================================

CREATE TYPE project_type AS ENUM ('website', 'web_app', 'ecommerce', 'landing_page', 'mobile_app', 'api', 'maintenance', 'other');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'under_review', 'pending_feedback', 'completed', 'on_hold', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('not_started', 'in_development', 'testing', 'deployed', 'delivered');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partially_paid', 'paid', 'overdue');
CREATE TYPE payment_structure AS ENUM ('fixed', 'hourly', 'milestone');

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Information
  project_name TEXT NOT NULL,
  project_type project_type DEFAULT 'website' NOT NULL,
  description TEXT,
  technology_stack TEXT[] DEFAULT '{}',
  
  -- Dates
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  
  -- Status Tracking
  status project_status DEFAULT 'planning' NOT NULL,
  delivery_status delivery_status DEFAULT 'not_started' NOT NULL,
  payment_status payment_status DEFAULT 'unpaid' NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- URLs
  repository_url TEXT,
  live_url TEXT,
  staging_url TEXT,
  
  -- Financial
  total_cost DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  payment_structure payment_structure DEFAULT 'fixed' NOT NULL,
  hourly_rate DECIMAL(10, 2),
  estimated_hours INTEGER,
  outstanding_balance DECIMAL(12, 2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for faster queries
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_payment_status ON projects(payment_status);

-- ============================================
-- 4. PROJECT DOMAINS
-- Domain information for projects
-- ============================================

CREATE TABLE IF NOT EXISTS project_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  domain_name TEXT NOT NULL,
  registrar TEXT,
  purchase_date DATE,
  renewal_date DATE,
  auto_renewal BOOLEAN DEFAULT false,
  domain_cost DECIMAL(10, 2),
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_project_domains_project_id ON project_domains(project_id);
CREATE INDEX idx_project_domains_renewal_date ON project_domains(renewal_date);

-- ============================================
-- 5. PROJECT HOSTING
-- Hosting information for projects
-- ============================================

CREATE TYPE server_type AS ENUM ('shared', 'vps', 'cloud', 'dedicated', 'serverless');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');

CREATE TABLE IF NOT EXISTS project_hosting (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  hosting_provider TEXT NOT NULL,
  server_type server_type,
  server_ip TEXT,
  hosting_cost DECIMAL(10, 2),
  billing_cycle billing_cycle,
  renewal_date DATE,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_project_hosting_project_id ON project_hosting(project_id);
CREATE INDEX idx_project_hosting_renewal_date ON project_hosting(renewal_date);

-- ============================================
-- 6. PROJECT DATABASES
-- Database information for projects
-- ============================================

CREATE TYPE database_type AS ENUM ('mysql', 'postgresql', 'mongodb', 'sqlite', 'supabase', 'firebase', 'other');

CREATE TABLE IF NOT EXISTS project_databases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  database_type database_type NOT NULL,
  database_host TEXT,
  database_name TEXT,
  database_size TEXT,
  backup_location TEXT,
  backup_frequency TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_project_databases_project_id ON project_databases(project_id);

-- ============================================
-- 7. PAYMENTS
-- Payment records for projects
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  transaction_reference TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_payments_project_id ON payments(project_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- ============================================
-- 8. PAYMENT MILESTONES
-- Milestone-based payment tracking
-- ============================================

CREATE TYPE milestone_status AS ENUM ('pending', 'paid', 'overdue');

CREATE TABLE IF NOT EXISTS payment_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  milestone_name TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  due_date DATE,
  status milestone_status DEFAULT 'pending' NOT NULL,
  paid_date DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_payment_milestones_project_id ON payment_milestones(project_id);
CREATE INDEX idx_payment_milestones_status ON payment_milestones(status);

-- ============================================
-- 9. CREDENTIALS VAULT
-- Encrypted credential storage
-- ============================================

CREATE TYPE credential_type AS ENUM ('domain', 'hosting', 'database', 'ftp', 'email', 'cms', 'api', 'other');

CREATE TABLE IF NOT EXISTS credentials_vault (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  credential_type credential_type NOT NULL,
  service_name TEXT NOT NULL,
  username TEXT,
  password TEXT, -- Will be encrypted at application level
  api_key TEXT,  -- Will be encrypted at application level
  additional_info JSONB DEFAULT '{}',
  expiry_date DATE,
  last_accessed TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_credentials_vault_user_id ON credentials_vault(user_id);
CREATE INDEX idx_credentials_vault_project_id ON credentials_vault(project_id);
CREATE INDEX idx_credentials_vault_type ON credentials_vault(credential_type);

-- ============================================
-- 10. PROJECT TASKS
-- Task/checklist items for projects
-- ============================================

CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');

CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  task_name TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'pending' NOT NULL,
  due_date DATE,
  completed_date TIMESTAMPTZ,
  order_index INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX idx_project_tasks_status ON project_tasks(status);

-- ============================================
-- 11. PROJECT FILES
-- File attachments for projects
-- ============================================

CREATE TABLE IF NOT EXISTS project_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_project_files_project_id ON project_files(project_id);

-- ============================================
-- 12. ACTIVITY LOGS
-- Audit trail for all actions
-- ============================================

CREATE TYPE entity_type AS ENUM ('client', 'project', 'credential', 'payment', 'task', 'file');
CREATE TYPE action_type AS ENUM ('created', 'updated', 'deleted', 'viewed');

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  entity_type entity_type NOT NULL,
  entity_id UUID NOT NULL,
  action action_type NOT NULL,
  changes JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensure users can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_hosting ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_databases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Clients Policies
CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Projects Policies
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Project Domains Policies (via project ownership)
CREATE POLICY "Users can view own project domains" ON project_domains
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_domains.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own project domains" ON project_domains
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_domains.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can update own project domains" ON project_domains
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_domains.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own project domains" ON project_domains
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_domains.project_id AND projects.user_id = auth.uid())
  );

-- Project Hosting Policies (via project ownership)
CREATE POLICY "Users can view own project hosting" ON project_hosting
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_hosting.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own project hosting" ON project_hosting
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_hosting.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can update own project hosting" ON project_hosting
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_hosting.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own project hosting" ON project_hosting
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_hosting.project_id AND projects.user_id = auth.uid())
  );

-- Project Databases Policies (via project ownership)
CREATE POLICY "Users can view own project databases" ON project_databases
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_databases.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own project databases" ON project_databases
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_databases.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can update own project databases" ON project_databases
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_databases.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own project databases" ON project_databases
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_databases.project_id AND projects.user_id = auth.uid())
  );

-- Payments Policies (via project ownership)
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = payments.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = payments.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can update own payments" ON payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = payments.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own payments" ON payments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = payments.project_id AND projects.user_id = auth.uid())
  );

-- Payment Milestones Policies (via project ownership)
CREATE POLICY "Users can view own milestones" ON payment_milestones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = payment_milestones.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own milestones" ON payment_milestones
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = payment_milestones.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can update own milestones" ON payment_milestones
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = payment_milestones.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own milestones" ON payment_milestones
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = payment_milestones.project_id AND projects.user_id = auth.uid())
  );

-- Credentials Vault Policies
CREATE POLICY "Users can view own credentials" ON credentials_vault
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credentials" ON credentials_vault
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own credentials" ON credentials_vault
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own credentials" ON credentials_vault
  FOR DELETE USING (auth.uid() = user_id);

-- Project Tasks Policies (via project ownership)
CREATE POLICY "Users can view own tasks" ON project_tasks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tasks.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own tasks" ON project_tasks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tasks.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can update own tasks" ON project_tasks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tasks.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own tasks" ON project_tasks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tasks.project_id AND projects.user_id = auth.uid())
  );

-- Project Files Policies (via project ownership)
CREATE POLICY "Users can view own files" ON project_files
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own files" ON project_files
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own files" ON project_files
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid())
  );

-- Activity Logs Policies
CREATE POLICY "Users can view own activity" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_domains_updated_at
  BEFORE UPDATE ON project_domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_hosting_updated_at
  BEFORE UPDATE ON project_hosting
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_databases_updated_at
  BEFORE UPDATE ON project_databases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_milestones_updated_at
  BEFORE UPDATE ON payment_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentials_vault_updated_at
  BEFORE UPDATE ON credentials_vault
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON project_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Client with project count and revenue
CREATE OR REPLACE VIEW clients_with_stats AS
SELECT 
  c.*,
  COALESCE(COUNT(DISTINCT p.id), 0) AS project_count,
  COALESCE(SUM(p.total_cost), 0) AS total_revenue
FROM clients c
LEFT JOIN projects p ON c.id = p.client_id
GROUP BY c.id;

-- Projects with client name
CREATE OR REPLACE VIEW projects_with_client AS
SELECT 
  p.*,
  c.client_name,
  c.company_name AS client_company
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'ClientFlow CRM database schema created successfully!';
  RAISE NOTICE 'Tables created: 12';
  RAISE NOTICE 'RLS policies created: All tables secured';
  RAISE NOTICE 'Triggers created: Auto-update timestamps, Auto-create profile';
END $$;
