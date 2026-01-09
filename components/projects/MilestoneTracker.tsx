'use client';

// ============================================
// ClientFlow CRM - Milestone Tracker Component
// Visual progress tracker for project milestones
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariants } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { useProjectMilestones } from '@/hooks/queries/useMilestones';
import { useUpdateMilestone, useToggleSubTask, useInitializeMilestones } from '@/hooks/mutations/useMilestoneMutations';
import {
  MilestoneLabels,
  MilestoneSubTasks,
  DefaultMilestonesByProjectType,
} from '@/types/milestone.types';
import type {
  MilestoneWithSubTasks,
  MilestoneType,
  SubTaskDefinition,
  ProjectType,
} from '@/types';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Palette,
  Layout,
  Server,
  Database,
  Globe,
  Cloud,
  TestTube,
  Rocket,
  Plus,
  Sparkles,
} from 'lucide-react';

// Icon mapping
const MilestoneIconComponents: Record<MilestoneType, React.ComponentType<{ className?: string }>> = {
  design: Palette,
  frontend: Layout,
  backend: Server,
  database: Database,
  domain: Globe,
  hosting: Cloud,
  testing: TestTube,
  deployment: Rocket,
};

// Project type options
const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'website', label: 'Website' },
  { value: 'web_app', label: 'Web App' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'api', label: 'API' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'other', label: 'Other' },
];

interface MilestoneTrackerProps {
  projectId: string;
  projectType?: ProjectType;
}

export function MilestoneTracker({ projectId, projectType = 'website' }: MilestoneTrackerProps) {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [openMilestoneId, setOpenMilestoneId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ProjectType>(projectType);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const { data: milestones, isLoading, error, refetch } = useProjectMilestones(projectId);
  const updateMilestone = useUpdateMilestone();
  const toggleSubTask = useToggleSubTask();
  const initializeMilestones = useInitializeMilestones();

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!milestones || milestones.length === 0) return 0;
    const applicable = milestones.filter((m) => m.is_applicable);
    if (applicable.length === 0) return 0;
    
    const progressSum = applicable.reduce((sum, m) => {
      return sum + (m.is_completed ? 100 : m.progress);
    }, 0);
    
    return Math.round(progressSum / applicable.length);
  };

  // Initialize milestones for this project
  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeMilestones.mutateAsync({
        project_id: projectId,
        project_type: selectedType,
      });
      refetch();
    } catch (err) {
      console.error('Failed to initialize milestones:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  // Toggle milestone expansion (auto-close previous)
  const toggleExpanded = (milestoneId: string) => {
    setOpenMilestoneId(openMilestoneId === milestoneId ? null : milestoneId);
  };

  // Toggle milestone completion
  const handleToggleMilestone = async (milestone: MilestoneWithSubTasks) => {
    await updateMilestone.mutateAsync({
      id: milestone.id,
      is_completed: !milestone.is_completed,
      project_id: projectId,
    });
  };

  // Toggle sub-task completion
  const handleToggleSubTask = async (subTaskId: string, isCompleted: boolean) => {
    await toggleSubTask.mutateAsync({
      subTaskId,
      isCompleted: !isCompleted,
      projectId,
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Show initialization UI if no milestones
  if (!milestones || milestones.length === 0) {
    const defaultMilestones = DefaultMilestonesByProjectType[selectedType] || [];
    
    return (
      <motion.div
        variants={fadeUpVariants}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Set Up Project Milestones</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Track progress automatically by adding development milestones
            </p>
          </div>
          
          {/* Project type selector */}
          <div className="max-w-xs mx-auto space-y-2">
            <label className="text-xs text-muted-foreground">Project Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ProjectType)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {PROJECT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          {/* Preview of milestones that will be created */}
          <div className="flex flex-wrap justify-center gap-2 py-2">
            {defaultMilestones.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground"
              >
                {MilestoneLabels[type]}
              </span>
            ))}
          </div>
          
          <Button
            onClick={handleInitialize}
            disabled={isInitializing}
            className="mt-2"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Milestones
              </>
            )}
          </Button>
        </div>
      </motion.div>
    );
  }

  const overallProgress = calculateOverallProgress();
  const applicableMilestones = milestones.filter((m) => m.is_applicable);

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header with progress bar - clickable to expand/collapse */}
      <div 
        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsCardExpanded(!isCardExpanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: isCardExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
            <h3 className="font-semibold text-foreground">Project Progress</h3>
          </div>
          <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {applicableMilestones.filter((m) => m.is_completed).length} of {applicableMilestones.length} milestones completed
        </p>
      </div>

      {/* Milestone list - collapsible */}
      <AnimatePresence>
        {isCardExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="divide-y divide-border">
              {applicableMilestones.map((milestone) => {
                const Icon = MilestoneIconComponents[milestone.milestone_type as MilestoneType] || Rocket;
                const isExpanded = openMilestoneId === milestone.id;
                const subTaskDefs = MilestoneSubTasks[milestone.milestone_type as MilestoneType] || [];

                return (
                  <div key={milestone.id}>
                    {/* Milestone row */}
                    <div
                      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                        milestone.is_completed ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => toggleExpanded(milestone.id)}
                    >
                      {/* Expand/collapse icon */}
                      <button
                        className="text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(milestone.id);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {/* Completion checkbox */}
                      <button
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                          milestone.is_completed
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground/30 hover:border-primary'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMilestone(milestone);
                        }}
                        disabled={updateMilestone.isPending}
                      >
                        {milestone.is_completed && <Check className="h-3.5 w-3.5" />}
                      </button>

                      {/* Icon */}
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          milestone.is_completed ? 'bg-primary/10' : 'bg-muted'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            milestone.is_completed ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </div>

                      {/* Label and progress */}
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            milestone.is_completed
                              ? 'text-muted-foreground line-through'
                              : 'text-foreground'
                          }`}
                        >
                          {MilestoneLabels[milestone.milestone_type as MilestoneType]}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${milestone.is_completed ? 100 : milestone.progress}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {milestone.is_completed ? 100 : milestone.progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sub-tasks */}
                    <AnimatePresence>
                      {isExpanded && subTaskDefs.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-muted/30"
                        >
                          <div className="p-4 pl-20 space-y-2">
                            {subTaskDefs.map((def: SubTaskDefinition) => {
                              const subTaskRecord = milestone.sub_tasks?.find(
                                (st) => st.sub_task_id === def.id
                              );
                              const isCompleted = subTaskRecord?.is_completed || false;

                              return (
                                <div
                                  key={def.id}
                                  className="flex items-start gap-3 py-1"
                                >
                                  <button
                                    onClick={() =>
                                      subTaskRecord &&
                                      handleToggleSubTask(subTaskRecord.id, isCompleted)
                                    }
                                    className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                                      isCompleted
                                        ? 'bg-primary border-primary text-primary-foreground'
                                        : 'border-muted-foreground/30 hover:border-primary'
                                    }`}
                                    disabled={toggleSubTask.isPending}
                                  >
                                    {isCompleted && <Check className="h-3 w-3" />}
                                  </button>
                                  <div className="flex-1">
                                    <p
                                      className={`text-sm ${
                                        isCompleted
                                          ? 'text-muted-foreground line-through'
                                          : 'text-foreground'
                                      }`}
                                    >
                                      {def.label}
                                    </p>
                                    {def.description && (
                                      <p className="text-xs text-muted-foreground">
                                        {def.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
