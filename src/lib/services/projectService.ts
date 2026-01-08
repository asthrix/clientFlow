// ============================================
// ClientFlow CRM - Project Service
// Abstracted database operations for projects
// Following Single Responsibility Principle
// ============================================

import { getSupabaseClient } from '@/lib/supabase/client';
import type { 
  Project, 
  CreateProjectDTO, 
  UpdateProjectDTO, 
  ProjectFilters,
  ProjectSortField,
  SortOrder,
} from '@/types';

export interface ProjectServiceResult<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

export interface PaginatedProjectsResult {
  data: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch all projects for the current user with filtering, sorting, and pagination
 */
export async function getProjects(options?: {
  filters?: ProjectFilters;
  sort?: { field: ProjectSortField; order: SortOrder };
  page?: number;
  pageSize?: number;
}): Promise<ProjectServiceResult<PaginatedProjectsResult>> {
  const supabase = getSupabaseClient();
  const { filters, sort, page = 1, pageSize = 10 } = options || {};

  // Build base query - join with clients for client_name
  let query = supabase
    .from('projects')
    .select('*, clients!inner(client_name, company_name)', { count: 'exact' });

  // Apply filters
  if (filters?.search) {
    query = query.or(
      `project_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  if (filters?.status && filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  if (filters?.delivery_status && filters.delivery_status.length > 0) {
    query = query.in('delivery_status', filters.delivery_status);
  }

  if (filters?.payment_status && filters.payment_status.length > 0) {
    query = query.in('payment_status', filters.payment_status);
  }

  if (filters?.project_type && filters.project_type.length > 0) {
    query = query.in('project_type', filters.project_type);
  }

  if (filters?.client_id) {
    query = query.eq('client_id', filters.client_id);
  }

  if (filters?.dateRange) {
    query = query
      .gte('created_at', filters.dateRange.from.toISOString())
      .lte('created_at', filters.dateRange.to.toISOString());
  }

  // Apply sorting
  const sortField = sort?.field || 'created_at';
  const sortOrder = sort?.order === 'asc' ? true : false;
  query = query.order(sortField, { ascending: sortOrder });

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  // Transform data to include client_name at top level
  type ProjectWithClient = Project & { clients: { client_name: string; company_name?: string } };
  const transformedData = (data as ProjectWithClient[]).map((project) => ({
    ...project,
    client_name: project.clients?.client_name,
    clients: undefined,
  })) as Project[];

  return {
    data: {
      data: transformedData,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
    error: null,
  };
}

/**
 * Fetch a single project by ID with related data
 */
export async function getProjectById(
  id: string
): Promise<ProjectServiceResult<Project>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(client_name, company_name)')
    .eq('id', id)
    .single();

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  // Transform to include client_name at top level
  type ProjectWithClient = Project & { clients: { client_name: string; company_name?: string } };
  const project = data as ProjectWithClient;
  const transformed = {
    ...project,
    client_name: project.clients?.client_name,
    clients: undefined,
  } as Project;

  return { data: transformed, error: null };
}

/**
 * Create a new project
 */
export async function createProject(
  projectData: CreateProjectDTO
): Promise<ProjectServiceResult<Project>> {
  const supabase = getSupabaseClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'Not authenticated' } };
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      user_id: user.id,
      technology_stack: projectData.technology_stack || [],
      status: projectData.status || 'planning',
      delivery_status: projectData.delivery_status || 'not_started',
      payment_status: projectData.payment_status || 'unpaid',
      progress_percentage: projectData.progress_percentage || 0,
      currency: projectData.currency || 'USD',
      payment_structure: projectData.payment_structure || 'fixed',
    })
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: data as Project, error: null };
}

/**
 * Update an existing project
 */
export async function updateProject(
  projectData: UpdateProjectDTO
): Promise<ProjectServiceResult<Project>> {
  const supabase = getSupabaseClient();
  const { id, ...updates } = projectData;

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: data as Project, error: null };
}

/**
 * Delete a project
 */
export async function deleteProject(
  id: string
): Promise<ProjectServiceResult<void>> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: null, error: null };
}

/**
 * Get projects for a specific client
 */
export async function getProjectsByClientId(
  clientId: string
): Promise<ProjectServiceResult<Project[]>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return { data: data as Project[], error: null };
}

/**
 * Get recent projects for dashboard
 */
export async function getRecentProjects(
  limit: number = 5
): Promise<ProjectServiceResult<Project[]>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(client_name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  // Transform to include client_name at top level
  type ProjectWithClient = Project & { clients: { client_name: string } };
  const transformed = (data as ProjectWithClient[]).map((project) => ({
    ...project,
    client_name: project.clients?.client_name,
    clients: undefined,
  })) as Project[];

  return { data: transformed, error: null };
}

/**
 * Get project statistics for dashboard
 */
export async function getProjectStats(): Promise<ProjectServiceResult<{
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
  onHold: number;
  totalRevenue: number;
  outstandingBalance: number;
}>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('status, total_cost, outstanding_balance');

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  type ProjectStats = { status: string; total_cost: number | null; outstanding_balance: number | null };
  const projects = data as ProjectStats[];
  
  const stats = {
    total: projects.length,
    planning: projects.filter((p) => p.status === 'planning').length,
    inProgress: projects.filter((p) => p.status === 'in_progress').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    onHold: projects.filter((p) => p.status === 'on_hold').length,
    totalRevenue: projects.reduce((sum, p) => sum + (p.total_cost || 0), 0),
    outstandingBalance: projects.reduce((sum, p) => sum + (p.outstanding_balance || 0), 0),
  };

  return { data: stats, error: null };
}

/**
 * Update project progress
 */
export async function updateProjectProgress(
  id: string,
  progress: number
): Promise<ProjectServiceResult<Project>> {
  return updateProject({ id, progress_percentage: Math.min(100, Math.max(0, progress)) });
}

/**
 * Update project status
 */
export async function updateProjectStatus(
  id: string,
  status: Project['status']
): Promise<ProjectServiceResult<Project>> {
  return updateProject({ id, status });
}
