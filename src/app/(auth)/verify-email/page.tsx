'use client';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { verifyEmailSchema, type VerifyEmailInput } from '@/schemas/auth.schema';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const { verifyEmail, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = async (data: VerifyEmailInput) => {
    try {
      await verifyEmail(email, data.code);
    } catch {
      /* handled in hook */
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
          <Mail className="h-8 w-8 text-[var(--color-primary)]" />
        </div>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          We sent a 6-digit code to <strong>{email || 'your email'}</strong>
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="code">Verification code</Label>
          <Input
            id="code"
            placeholder="Enter 6-digit code"
            maxLength={6}
            error={!!errors.code}
            autoComplete="one-time-code"
            className="text-center text-xl tracking-widest font-mono"
            {...register('code')}
          />
          {errors.code && (
            <p className="text-xs text-[var(--color-destructive)]">{errors.code.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full gap-2" loading={isLoading}>
          <ShieldCheck className="h-4 w-4" />
          Verify Email
        </Button>
      </form>
    </div>
  );
}
