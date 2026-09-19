'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Pencil } from 'lucide-react';

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
import { editUserFormSchema, type EditUserFormInput } from '@/schemas/admin-user.schema';
import type { AdminUser } from '@/types/user';

interface EditUserDialogProps {
  user: AdminUser | null;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, onOpenChange }: EditUserDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormInput>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: { fullName: '', email: '' },
  });

  useEffect(() => {
    if (user) reset({ fullName: user.fullName ?? '', email: user.email ?? '' });
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (values: EditUserFormInput) => {
      // Only send what changed; an empty email means "leave as is" (it can't be cleared).
      const payload: { fullName?: string; email?: string } = {};
      if (values.fullName !== (user?.fullName ?? '')) payload.fullName = values.fullName;
      if (values.email && values.email !== (user?.email ?? '')) payload.email = values.email;
      return usersApi.updateUserByAdmin(user!._id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
      toast.success('User updated successfully');
      onOpenChange(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update user')),
  });

  const onSubmit = (values: EditUserFormInput) => {
    const unchanged =
      values.fullName === (user?.fullName ?? '') && (!values.email || values.email === (user?.email ?? ''));
    if (unchanged) {
      onOpenChange(false);
      return;
    }
    mutation.mutate(values);
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Pencil className="h-5 w-5" />
            </span>
            <div className="text-left">
              <DialogTitle>Edit user</DialogTitle>
              <DialogDescription>
                Update this account&apos;s name or email. The phone number can&apos;t be changed here.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-fullName">
              Full name <span className="text-red-500">*</span>
            </Label>
            <Input id="edit-fullName" autoComplete="off" error={!!errors.fullName} {...register('fullName')} />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              autoComplete="off"
              placeholder="name@example.com"
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
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
