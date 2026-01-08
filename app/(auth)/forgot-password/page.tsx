'use client';

// ============================================
// ClientFlow CRM - Forgot Password Page
// Clean password reset request page
// ============================================

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  fadeUpVariants, 
  staggerContainerVariants,
  cardVariants,
  shakeVariants,
} from '@/lib/animations';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';
import { resetPassword } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  ArrowLeft,
  Loader2,
  Check,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await resetPassword(data.email);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  // Success state
  if (success) {
    return (
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        <motion.div
          variants={cardVariants}
          className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-8 text-center shadow-xl shadow-black/5 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
          >
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="text-xl font-bold text-foreground">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists with that email, we&apos;ve sent password reset instructions.
          </p>
          <Link href="/login">
            <Button className="mt-6 w-full" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="w-full"
    >
      {/* Logo & Header */}
      <motion.div variants={fadeUpVariants} className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
          <span className="text-xl font-bold text-primary-foreground">CF</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
        <p className="mt-1 text-muted-foreground">
          Enter your email and we&apos;ll send reset instructions
        </p>
      </motion.div>

      {/* Forgot Password Card */}
      <motion.div
        variants={cardVariants}
        className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-xl"
      >
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <motion.div
                variants={shakeVariants}
                animate="shake"
                className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 pl-10 transition-shadow focus:shadow-md focus:shadow-primary/10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full gap-2 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send reset instructions'
                )}
              </Button>
            </motion.div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 bg-muted/30 px-8 py-4">
          <Link href="/login">
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </p>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
