'use client';

// ============================================
// ClientFlow CRM - Milestone Selector Component
// Select which milestones apply to a project
// ============================================

import { motion } from 'framer-motion';
import { fadeUpVariants } from '@/lib/animations';
import {
  MilestoneLabels,
  DefaultMilestonesByProjectType,
  MilestoneSubTasks,
} from '@/types/milestone.types';
import type { MilestoneType, ProjectType } from '@/types';
import {
  Check,
  Palette,
  Layout,
  Server,
  Database,
  Globe,
  Cloud,
  TestTube,
  Rocket,
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

// All available milestones
const ALL_MILESTONES: MilestoneType[] = [
  'design',
  'frontend',
  'backend',
  'database',
  'domain',
  'hosting',
  'testing',
  'deployment',
];

interface MilestoneSelectorProps {
  projectType: ProjectType;
  selectedMilestones: MilestoneType[];
  onSelectionChange: (milestones: MilestoneType[]) => void;
}

export function MilestoneSelector({
  projectType,
  selectedMilestones,
  onSelectionChange,
}: MilestoneSelectorProps) {
  // Toggle a milestone
  const toggleMilestone = (milestone: MilestoneType) => {
    if (selectedMilestones.includes(milestone)) {
      onSelectionChange(selectedMilestones.filter((m) => m !== milestone));
    } else {
      onSelectionChange([...selectedMilestones, milestone]);
    }
  };

  // Reset to defaults for current project type
  const resetToDefaults = () => {
    const defaults = DefaultMilestonesByProjectType[projectType] || [];
    onSelectionChange([...defaults]);
  };

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">Project Milestones</h4>
          <p className="text-xs text-muted-foreground">
            Select the phases that apply to this project
          </p>
        </div>
        <button
          type="button"
          onClick={resetToDefaults}
          className="text-xs text-primary hover:underline"
        >
          Reset to defaults
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ALL_MILESTONES.map((milestone) => {
          const Icon = MilestoneIconComponents[milestone];
          const isSelected = selectedMilestones.includes(milestone);
          const subTaskCount = MilestoneSubTasks[milestone]?.length || 0;

          return (
            <button
              key={milestone}
              type="button"
              onClick={() => toggleMilestone(milestone)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isSelected ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium text-center ${
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {MilestoneLabels[milestone]}
              </span>

              {/* Sub-task count */}
              <span className="text-[10px] text-muted-foreground">
                {subTaskCount} tasks
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {selectedMilestones.length} milestones selected
      </p>
    </motion.div>
  );
}
