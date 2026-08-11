'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/schemas/auth.schema';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPassword(data.email);
    } catch {
      /* handled in hook */
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Enter your email and we&apos;ll send you a reset code.
        </p>
      </div>

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

        <Button type="submit" className="w-full gap-2" loading={isLoading}>
          <Send className="h-4 w-4" />
          Send Reset Code
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to login
        </Link>
      </div>
    </div>
  );
}
