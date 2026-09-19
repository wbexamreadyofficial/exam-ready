'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, ShieldPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/api/errors';
import { usersApi } from '@/lib/api/users';
import { newAdminFormSchema, type NewAdminFormInput } from '@/schemas/admin-user.schema';

const emptyForm: NewAdminFormInput = { fullName: '', mobileNumber: '', email: '' };

interface NewAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAdminDialog({ open, onOpenChange }: NewAdminDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewAdminFormInput>({
    resolver: zodResolver(newAdminFormSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    if (open) reset(emptyForm);
  }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (values: NewAdminFormInput) =>
      usersApi.createAdmin({
        fullName: values.fullName,
        mobileNumber: values.mobileNumber,
        email: values.email || undefined,
      }),
    onSuccess: (admin) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(`${admin.fullName || 'Admin'} added as an admin`);
      onOpenChange(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not create admin')),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <ShieldPlus className="h-5 w-5" />
            </span>
            <div className="text-left">
              <DialogTitle>New Admin</DialogTitle>
              <DialogDescription>
                Creates a verified admin who can sign in right away with their mobile number.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-fullName">
              Full name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="admin-fullName"
              placeholder="e.g. Anjan Das"
              autoComplete="off"
              error={!!errors.fullName}
              {...register('fullName')}
            />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="admin-mobile">
              Mobile number <span className="text-red-500">*</span>
            </Label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-[var(--color-input)] bg-[var(--color-muted)] px-3 text-sm text-[var(--color-muted-foreground)]">
                +91
              </span>
              <Input
                id="admin-mobile"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                autoComplete="off"
                className="rounded-l-none"
                error={!!errors.mobileNumber}
                {...register('mobileNumber')}
              />
            </div>
            {errors.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com (optional)"
              autoComplete="off"
              error={!!errors.email}
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="cta" disabled={mutation.isPending} className="gap-2">
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create admin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
