'use client';

import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { generateInitials } from '@/lib/utils';

interface PhotoPreviewDialogProps {
  photo: { url: string; name: string } | null;
  onClose: () => void;
}

/** Transparent lightbox: the photo floats as a large circle over the dimmed backdrop. */
export function PhotoPreviewDialog({ photo, onClose }: PhotoPreviewDialogProps) {
  return (
    <Dialog open={!!photo} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        hideCloseButton
        className="w-auto max-w-none justify-items-center border-0 bg-transparent p-0 shadow-none"
      >
        <DialogTitle className="sr-only">{photo?.name}</DialogTitle>
        <DialogDescription className="sr-only">Profile photo</DialogDescription>
        {photo && (
          <div className="relative">
            <Avatar className="h-72 w-72 border-4 border-white/30 shadow-2xl sm:h-80 sm:w-80">
              <AvatarImage src={photo.url} alt={photo.name} className="object-cover" />
              <AvatarFallback className="text-5xl">{generateInitials(photo.name)}</AvatarFallback>
            </Avatar>
            <DialogClose
              aria-label="Close"
              className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg ring-1 ring-white/30 transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
