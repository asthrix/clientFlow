'use client';

// ============================================
// ClientFlow CRM - LoadingSpinner Component
// Animated loading indicator
// ============================================

import { motion } from 'framer-motion';
import { spinnerVariants } from '@/lib/animations';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariantsClass = cva(
  'animate-spin text-primary',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariantsClass> {
  /** Optional loading text */
  text?: string;
  /** Additional className */
  className?: string;
  /** Show full page overlay spinner */
  fullPage?: boolean;
}

export function LoadingSpinner({
  size,
  text,
  className = '',
  fullPage = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <motion.div
        variants={spinnerVariants}
        animate="animate"
      >
        <Loader2 className={spinnerVariantsClass({ size })} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        {spinner}
      </motion.div>
    );
  }

  return spinner;
}

// Inline loading dots animation
export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  );
}
