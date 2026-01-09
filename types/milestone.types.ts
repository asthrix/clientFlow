// ============================================
// ClientFlow CRM - Milestone Types
// Types for project milestone tracking
// ============================================

import type { BaseEntity } from './common.types';
import type { ProjectType } from './project.types';

// ============================================
// Milestone Type Enum
// ============================================

export const MilestoneType = {
  DESIGN: 'design',
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  DATABASE: 'database',
  DOMAIN: 'domain',
  HOSTING: 'hosting',
  TESTING: 'testing',
  DEPLOYMENT: 'deployment',
} as const;

export type MilestoneType = (typeof MilestoneType)[keyof typeof MilestoneType];

// ============================================
// Milestone Labels & Icons
// ============================================

export const MilestoneLabels: Record<MilestoneType, string> = {
  design: 'UI/UX Design',
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  database: 'Database Setup',
  domain: 'Domain & DNS',
  hosting: 'Hosting Setup',
  testing: 'Testing & QA',
  deployment: 'Deployment',
};

export const MilestoneIcons: Record<MilestoneType, string> = {
  design: 'Palette',
  frontend: 'Layout',
  backend: 'Server',
  database: 'Database',
  domain: 'Globe',
  hosting: 'Cloud',
  testing: 'TestTube',
  deployment: 'Rocket',
};

// ============================================
// Sub-Task Definitions per Milestone
// ============================================

export interface SubTaskDefinition {
  id: string;
  label: string;
  description?: string;
}

export const MilestoneSubTasks: Record<MilestoneType, SubTaskDefinition[]> = {
  design: [
    { id: 'wireframes', label: 'Wireframes', description: 'Low-fidelity layouts' },
    { id: 'mockups', label: 'UI Mockups', description: 'High-fidelity designs' },
    { id: 'assets', label: 'Assets & Icons', description: 'Export design assets' },
    { id: 'approval', label: 'Client Approval', description: 'Design sign-off' },
  ],
  frontend: [
    { id: 'setup', label: 'Project Setup', description: 'Initialize project structure' },
    { id: 'components', label: 'Components', description: 'Build UI components' },
    { id: 'styling', label: 'Styling', description: 'CSS/Theming' },
    { id: 'responsive', label: 'Responsive', description: 'Mobile & tablet views' },
    { id: 'animations', label: 'Animations', description: 'Transitions & effects' },
  ],
  backend: [
    { id: 'api_design', label: 'API Design', description: 'Endpoints & schema' },
    { id: 'authentication', label: 'Authentication', description: 'User auth system' },
    { id: 'core_logic', label: 'Core Logic', description: 'Business logic' },
    { id: 'integrations', label: 'Integrations', description: 'Third-party APIs' },
  ],
  database: [
    { id: 'schema', label: 'Schema Design', description: 'Tables & relations' },
    { id: 'migrations', label: 'Migrations', description: 'Setup scripts' },
    { id: 'seed_data', label: 'Seed Data', description: 'Initial data' },
    { id: 'backup', label: 'Backup Setup', description: 'Backup strategy' },
  ],
  domain: [
    { id: 'purchase', label: 'Domain Purchase', description: 'Buy domain' },
    { id: 'dns_config', label: 'DNS Config', description: 'Point to server' },
    { id: 'ssl', label: 'SSL Certificate', description: 'HTTPS setup' },
  ],
  hosting: [
    { id: 'provider_setup', label: 'Provider Setup', description: 'Create account/server' },
    { id: 'deploy_config', label: 'Deploy Config', description: 'CI/CD or manual' },
    { id: 'env_vars', label: 'Environment', description: 'Env variables' },
    { id: 'monitoring', label: 'Monitoring', description: 'Uptime & logs' },
  ],
  testing: [
    { id: 'unit_tests', label: 'Unit Tests', description: 'Component tests' },
    { id: 'integration', label: 'Integration Tests', description: 'API tests' },
    { id: 'e2e', label: 'E2E Tests', description: 'User flow tests' },
    { id: 'manual_qa', label: 'Manual QA', description: 'Bug testing' },
  ],
  deployment: [
    { id: 'staging', label: 'Staging Deploy', description: 'Test environment' },
    { id: 'production', label: 'Production Deploy', description: 'Go live' },
    { id: 'verification', label: 'Verification', description: 'Post-deploy checks' },
    { id: 'handover', label: 'Client Handover', description: 'Training & docs' },
  ],
};

// ============================================
// Default Milestones per Project Type
// ============================================

export const DefaultMilestonesByProjectType: Record<ProjectType, MilestoneType[]> = {
  landing_page: ['design', 'frontend', 'domain', 'hosting', 'deployment'],
  website: ['design', 'frontend', 'domain', 'hosting', 'testing', 'deployment'],
  web_app: ['design', 'frontend', 'backend', 'database', 'hosting', 'testing', 'deployment'],
  ecommerce: ['design', 'frontend', 'backend', 'database', 'domain', 'hosting', 'testing', 'deployment'],
  mobile_app: ['design', 'frontend', 'backend', 'database', 'testing', 'deployment'],
  api: ['backend', 'database', 'hosting', 'testing', 'deployment'],
  maintenance: ['testing', 'deployment'],
  other: ['design', 'frontend', 'testing', 'deployment'],
};

// ============================================
// Database Entities
// ============================================

export interface ProjectMilestone extends BaseEntity {
  project_id: string;
  milestone_type: MilestoneType;
  is_applicable: boolean;
  is_completed: boolean;
  completed_at?: string;
  notes?: string;
  order_index: number;
}

export interface ProjectSubTask extends BaseEntity {
  milestone_id: string;
  sub_task_id: string; // References SubTaskDefinition.id
  is_completed: boolean;
  completed_at?: string;
}

// ============================================
// Computed Types
// ============================================

export interface MilestoneWithSubTasks extends ProjectMilestone {
  sub_tasks: ProjectSubTask[];
  progress: number; // 0-100 based on completed sub-tasks
}

export interface ProjectProgress {
  milestones: MilestoneWithSubTasks[];
  totalProgress: number; // Overall project progress
  completedMilestones: number;
  totalApplicableMilestones: number;
}

// ============================================
// DTOs
// ============================================

export interface CreateProjectMilestoneDTO {
  project_id: string;
  milestone_type: MilestoneType;
  is_applicable?: boolean;
  order_index?: number;
}

export interface UpdateProjectMilestoneDTO {
  id: string;
  is_completed?: boolean;
  is_applicable?: boolean;
  notes?: string;
}

export interface UpdateSubTaskDTO {
  id: string;
  is_completed: boolean;
}

export interface InitializeMilestonesDTO {
  project_id: string;
  project_type: ProjectType;
  selected_milestones?: MilestoneType[]; // Override defaults
}
