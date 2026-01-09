'use client';

// ============================================
// ClientFlow CRM - Wizard Step Indicator
// Visual progress indicator for multi-step forms
// ============================================

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface WizardStep {
  id: number;
  label: string;
  description?: string;
}

interface WizardStepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function WizardStepIndicator({
  steps,
  currentStep,
  onStepClick,
}: WizardStepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <div className="flex justify-between relative">
        {/* Background connector line spanning full width */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" style={{ left: '16.67%', right: '16.67%' }} />
        
        {/* Animated progress line */}
        <motion.div 
          className="absolute top-5 h-0.5 bg-primary"
          style={{ left: '16.67%' }}
          initial={{ width: 0 }}
          animate={{ 
            width: currentStep === 1 ? 0 : currentStep === 2 ? '33.33%' : '66.66%'
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10" style={{ width: '33.33%' }}>
              {/* Step circle */}
              <motion.button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full
                  transition-colors duration-200
                  ${isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }
                  ${isClickable ? 'cursor-pointer hover:ring-4 hover:ring-primary/30' : 'cursor-default'}
                `}
                whileHover={isClickable ? { scale: 1.05 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </motion.button>

              {/* Labels */}
              <div className="mt-3 text-center">
                <span
                  className={`text-sm font-medium ${
                    isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
