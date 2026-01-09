// ============================================
// ClientFlow CRM - Milestone Service
// Service for project milestone operations
// ============================================

import { getSupabaseClient } from '@/lib/supabase/client';
import {
  MilestoneSubTasks,
  DefaultMilestonesByProjectType,
} from '@/types/milestone.types';
import type {
  ProjectMilestone,
  ProjectSubTask,
  MilestoneWithSubTasks,
  ProjectProgress,
  UpdateProjectMilestoneDTO,
  InitializeMilestonesDTO,
  MilestoneType,
} from '@/types';

// ============================================
// Service Result Type
// ============================================

interface MilestoneServiceResult<T> {
  data: T | null;
  error: { message: string } | null;
}

// ============================================
// Milestone CRUD Operations
// ============================================

/**
 * Initialize milestones for a new project based on project type
 */
export async function initializeProjectMilestones(
  dto: InitializeMilestonesDTO
): Promise<MilestoneServiceResult<ProjectMilestone[]>> {
  const supabase = getSupabaseClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  // Get milestones to create (either selected or defaults for project type)
  const milestonesToCreate = dto.selected_milestones || 
    DefaultMilestonesByProjectType[dto.project_type] || 
    DefaultMilestonesByProjectType.website;

  // Create milestone records
  const milestoneRecords = milestonesToCreate.map((type, index) => ({
    project_id: dto.project_id,
    user_id: user.id,
    milestone_type: type,
    is_applicable: true,
    is_completed: false,
    order_index: index,
  }));

  const { data, error } = await supabase
    .from('project_milestones')
    .insert(milestoneRecords)
    .select();

  if (error) {
    console.error('Error initializing milestones:', error);
    return { data: null, error: { message: error.message } };
  }

  // Initialize sub-tasks for each milestone
  const subTaskRecords: {
    milestone_id: string;
    user_id: string;
    sub_task_id: string;
    is_completed: boolean;
  }[] = [];

  for (const milestone of data as ProjectMilestone[]) {
    const subTasks = MilestoneSubTasks[milestone.milestone_type as MilestoneType] || [];
    for (const subTask of subTasks) {
      subTaskRecords.push({
        milestone_id: milestone.id,
        user_id: user.id,
        sub_task_id: subTask.id,
        is_completed: false,
      });
    }
  }

  if (subTaskRecords.length > 0) {
    const { error: subTaskError } = await supabase
      .from('project_sub_tasks')
      .insert(subTaskRecords);

    if (subTaskError) {
      console.error('Error initializing sub-tasks:', subTaskError);
      // Don't fail the whole operation, milestones are created
    }
  }

  return { data: data as ProjectMilestone[], error: null };
}

/**
 * Get project milestones with sub-tasks
 */
export async function getProjectMilestones(
  projectId: string
): Promise<MilestoneServiceResult<MilestoneWithSubTasks[]>> {
  const supabase = getSupabaseClient();

  // Fetch milestones
  const { data: milestones, error: milestonesError } = await supabase
    .from('project_milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true });

  if (milestonesError) {
    console.error('Error fetching milestones:', milestonesError);
    return { data: null, error: { message: milestonesError.message } };
  }

  if (!milestones || milestones.length === 0) {
    return { data: [], error: null };
  }

  // Fetch sub-tasks for all milestones
  const milestoneIds = milestones.map((m: ProjectMilestone) => m.id);
  const { data: subTasks, error: subTasksError } = await supabase
    .from('project_sub_tasks')
    .select('*')
    .in('milestone_id', milestoneIds);

  if (subTasksError) {
    console.error('Error fetching sub-tasks:', subTasksError);
    // Continue without sub-tasks
  }

  // Combine milestones with their sub-tasks
  const milestonesWithSubTasks: MilestoneWithSubTasks[] = milestones.map((milestone: ProjectMilestone) => {
    const milestoneSubTasks = (subTasks || []).filter(
      (st: ProjectSubTask) => st.milestone_id === milestone.id
    ) as ProjectSubTask[];

    // Calculate progress based on completed sub-tasks
    const completedCount = milestoneSubTasks.filter((st: ProjectSubTask) => st.is_completed).length;
    const totalCount = milestoneSubTasks.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      ...milestone,
      sub_tasks: milestoneSubTasks,
      progress,
    } as MilestoneWithSubTasks;
  });

  return { data: milestonesWithSubTasks, error: null };
}

/**
 * Calculate overall project progress
 */
export async function calculateProjectProgress(
  projectId: string
): Promise<MilestoneServiceResult<ProjectProgress>> {
  const result = await getProjectMilestones(projectId);

  if (result.error || !result.data) {
    return { data: null, error: result.error };
  }

  const milestones = result.data;
  const applicableMilestones = milestones.filter((m: MilestoneWithSubTasks) => m.is_applicable);
  const completedMilestones = applicableMilestones.filter((m: MilestoneWithSubTasks) => m.is_completed);

  // Calculate total progress based on milestone sub-task progress
  let totalProgress = 0;
  if (applicableMilestones.length > 0) {
    const progressSum = applicableMilestones.reduce((sum: number, m: MilestoneWithSubTasks) => {
      // If milestone is marked complete, count as 100%
      // Otherwise use sub-task progress
      return sum + (m.is_completed ? 100 : m.progress);
    }, 0);
    totalProgress = Math.round(progressSum / applicableMilestones.length);
  }

  return {
    data: {
      milestones,
      totalProgress,
      completedMilestones: completedMilestones.length,
      totalApplicableMilestones: applicableMilestones.length,
    },
    error: null,
  };
}

/**
 * Update a milestone
 */
export async function updateMilestone(
  dto: UpdateProjectMilestoneDTO
): Promise<MilestoneServiceResult<ProjectMilestone>> {
  const supabase = getSupabaseClient();

  const updateData: Partial<ProjectMilestone> = {};
  
  if (dto.is_completed !== undefined) {
    updateData.is_completed = dto.is_completed;
    updateData.completed_at = dto.is_completed ? new Date().toISOString() : undefined;
  }
  if (dto.is_applicable !== undefined) {
    updateData.is_applicable = dto.is_applicable;
  }
  if (dto.notes !== undefined) {
    updateData.notes = dto.notes;
  }

  const { data, error } = await supabase
    .from('project_milestones')
    .update(updateData)
    .eq('id', dto.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating milestone:', error);
    return { data: null, error: { message: error.message } };
  }

  return { data: data as ProjectMilestone, error: null };
}

/**
 * Toggle a sub-task completion
 */
export async function toggleSubTask(
  subTaskId: string,
  isCompleted: boolean
): Promise<MilestoneServiceResult<ProjectSubTask>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('project_sub_tasks')
    .update({
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    })
    .eq('id', subTaskId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling sub-task:', error);
    return { data: null, error: { message: error.message } };
  }

  return { data: data as ProjectSubTask, error: null };
}

/**
 * Sync project progress_percentage based on milestones
 * Call this after milestone/sub-task updates
 */
export async function syncProjectProgress(
  projectId: string
): Promise<MilestoneServiceResult<number>> {
  const supabase = getSupabaseClient();

  const progressResult = await calculateProjectProgress(projectId);

  if (progressResult.error || !progressResult.data) {
    return { data: null, error: progressResult.error };
  }

  const newProgress = progressResult.data.totalProgress;

  // Update project's progress_percentage
  const { error } = await supabase
    .from('projects')
    .update({ progress_percentage: newProgress })
    .eq('id', projectId);

  if (error) {
    console.error('Error syncing project progress:', error);
    return { data: null, error: { message: error.message } };
  }

  return { data: newProgress, error: null };
}

/**
 * Delete all milestones for a project (used when changing project type)
 */
export async function deleteProjectMilestones(
  projectId: string
): Promise<MilestoneServiceResult<boolean>> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('project_milestones')
    .delete()
    .eq('project_id', projectId);

  if (error) {
    console.error('Error deleting milestones:', error);
    return { data: null, error: { message: error.message } };
  }

  return { data: true, error: null };
}
