'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getErrorMessage } from '@/lib/api/errors';
import { usersApi } from '@/lib/api/users';
import type { UserRole } from '@/types/auth';
import type { AdminUser } from '@/types/user';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'examiner', label: 'Examiner' },
  { value: 'partner', label: 'Partner' },
  { value: 'admin', label: 'Admin' },
];

interface ChangeRoleDialogProps {
  user: AdminUser | null;
  onOpenChange: (open: boolean) => void;
}

/** Wrapper so the form state resets every time a different user is opened. */
export function ChangeRoleDialog({ user, onOpenChange }: ChangeRoleDialogProps) {
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {user && <ChangeRoleForm key={user._id} user={user} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function ChangeRoleForm({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const queryClient = useQueryClient();
  const currentRole = user.role;
  const [role, setRole] = useState<UserRole | undefined>(currentRole);
  const displayName = user.fullName || user.email || user.mobileNumber || 'this user';

  const mutation = useMutation({
    mutationFn: (nextRole: UserRole) => usersApi.updateUserRole(user._id, nextRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Role updated successfully');
      onClose();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not change role')),
  });

  const unchanged = !role || role === currentRole;
  const promotingToAdmin = role === 'admin' && currentRole !== 'admin';
  const demotingAdmin = currentRole === 'admin' && !!role && role !== 'admin';

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 text-left">
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription className="truncate">{displayName}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="role-select">Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger id="role-select">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(promotingToAdmin || demotingAdmin) && (
          <div className="flex gap-2.5 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              {promotingToAdmin
                ? 'Admins can manage every user, category and setting. Only promote people you trust.'
                : 'This person will lose all admin access immediately.'}
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="cta"
          disabled={unchanged || mutation.isPending}
          className="gap-2"
          onClick={() => role && mutation.mutate(role)}
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Update role
        </Button>
      </DialogFooter>
    </>
  );
}
