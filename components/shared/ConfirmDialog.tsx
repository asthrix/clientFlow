'use client';

// ============================================
// ClientFlow CRM - ConfirmDialog Component
// Reusable confirmation dialog with animation
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants, overlayVariants } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';
import { useUIStore } from '@/store';

export function ConfirmDialog() {
  const { confirmDialog, hideConfirmDialog } = useUIStore();
  const { isOpen, title, message, onConfirm, variant } = confirmDialog;

  const handleConfirm = () => {
    onConfirm?.();
    hideConfirmDialog();
  };

  const Icon = variant === 'destructive' ? AlertTriangle : Info;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={hideConfirmDialog}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform"
          >
            <div className="mx-4 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
              <div className="p-6">
                {/* Icon */}
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                  variant === 'destructive' 
                    ? 'bg-destructive/10' 
                    : 'bg-primary/10'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    variant === 'destructive' 
                      ? 'text-destructive' 
                      : 'text-primary'
                  }`} />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-center text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={hideConfirmDialog}
                >
                  Cancel
                </Button>
                <Button
                  variant={variant === 'destructive' ? 'destructive' : 'default'}
                  className="flex-1"
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
