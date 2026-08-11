'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginInput } from '@/schemas/auth.schema';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const reset = searchParams.get('reset');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
    } catch {
      /* handled in hook */
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Sign in to your WB Exam Ready account
        </p>
      </div>

      {verified && (
        <Alert variant="success">
          <AlertDescription>Email verified! You can now log in.</AlertDescription>
        </Alert>
      )}
      {reset && (
        <Alert variant="success">
          <AlertDescription>
            Password reset successful. Please log in with your new password.
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            error={!!errors.email}
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-[var(--color-destructive)]">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--color-primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              error={!!errors.password}
              autoComplete="current-password"
              {...register('password')}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-xs text-[var(--color-destructive)]">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full gap-2" loading={isLoading}>
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-muted-foreground)]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[var(--color-primary)] font-medium hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}
