'use client';

// ============================================
// ClientFlow CRM - Register Page
// Clean, modern registration with password strength
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { signUp } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  ArrowRight,
  Loader2,
  Check,
  X,
} from 'lucide-react';

// Password strength checker
function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');
  const passwordStrength = password ? getPasswordStrength(password) : null;

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await signUp(data.email, data.password, data.fullName);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
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
            We&apos;ve sent you a confirmation link. Please verify your email to continue.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="mt-6 w-full"
            variant="outline"
          >
            Back to login
          </Button>
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
        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
        <p className="mt-1 text-muted-foreground">
          Start managing your freelance business
        </p>
      </motion.div>

      {/* Register Card */}
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

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="h-11 pl-10 transition-shadow focus:shadow-md focus:shadow-primary/10"
                  {...register('fullName')}
                />
              </div>
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive"
                >
                  {errors.fullName.message}
                </motion.p>
              )}
            </div>

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

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10 transition-shadow focus:shadow-md focus:shadow-primary/10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className={`h-1 flex-1 rounded-full ${
                          i < passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength:{' '}
                    <span className={`font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-500' :
                      passwordStrength.score <= 4 ? 'text-amber-500' :
                      'text-green-500'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </p>
                </div>
              )}
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10 transition-shadow focus:shadow-md focus:shadow-primary/10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive"
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                {...register('acceptTerms')}
              />
              <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive"
              >
                {errors.acceptTerms.message}
              </motion.p>
            )}

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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 bg-muted/30 px-8 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
