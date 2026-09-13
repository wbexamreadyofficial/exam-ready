'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Should perform the actual sign-out (revokes the refresh token via the
   *  backend logout endpoint, clears local session state, redirects). */
  onConfirm: () => Promise<void> | void;
}

/** Confirmation gate in front of the real sign-out call — shared by every
 *  header/topbar's logout action so behavior stays consistent app-wide. */
export function LogoutConfirmDialog({ open, onOpenChange, onConfirm }: LogoutConfirmDialogProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await onConfirm();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isLoggingOut && onOpenChange(next)}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-data-negative)]/10 text-[var(--color-data-negative)]">
            <LogOut className="h-5 w-5" />
          </div>
          <DialogTitle>Log out?</DialogTitle>
          <DialogDescription>You&apos;ll need to sign in again to access your dashboard.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoggingOut}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            loading={isLoggingOut}
            className="bg-[var(--color-data-negative)] text-white hover:opacity-90"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
