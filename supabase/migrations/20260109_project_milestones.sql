-- ============================================
-- ClientFlow CRM - Project Milestones Migration
-- Tables for milestone-based progress tracking
-- ============================================

-- Create project_milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN (
    'design', 'frontend', 'backend', 'database', 
    'domain', 'hosting', 'testing', 'deployment'
  )),
  is_applicable BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Unique constraint: one milestone type per project
  UNIQUE(project_id, milestone_type)
);

-- Create project_sub_tasks table
CREATE TABLE IF NOT EXISTS project_sub_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sub_task_id TEXT NOT NULL, -- References the sub-task definition id
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Unique constraint: one sub-task per milestone
  UNIQUE(milestone_id, sub_task_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_user_id ON project_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_project_sub_tasks_milestone_id ON project_sub_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_project_sub_tasks_user_id ON project_sub_tasks(user_id);

-- Enable RLS
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sub_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_milestones
CREATE POLICY "Users can view their own milestones"
  ON project_milestones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestones"
  ON project_milestones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
  ON project_milestones FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
  ON project_milestones FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for project_sub_tasks
CREATE POLICY "Users can view their own sub_tasks"
  ON project_sub_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sub_tasks"
  ON project_sub_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sub_tasks"
  ON project_sub_tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sub_tasks"
  ON project_sub_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_milestone_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_milestone_timestamp
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_timestamp();

CREATE TRIGGER set_sub_task_timestamp
  BEFORE UPDATE ON project_sub_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_timestamp();
