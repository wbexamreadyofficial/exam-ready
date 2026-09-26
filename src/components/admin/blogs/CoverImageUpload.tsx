'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImagePlus, Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { mediaApi } from '@/lib/api/media';
import { getErrorMessage } from '@/lib/api/errors';
import type { BlogCoverImage } from '@/types/blog';

interface CoverImageUploadProps {
  value?: BlogCoverImage | null;
  onChange: (image: BlogCoverImage | null) => void;
}

/** Cover image for a blog card/hero — uploads to ImageKit via the shared media endpoint. */
export function CoverImageUpload({ value, onChange }: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be 10MB or smaller');
      return;
    }

    setUploading(true);
    try {
      const media = await mediaApi.upload(file, 'blog-covers');
      onChange({ fileId: media.fileId, url: media.url, thumbnailUrl: media.thumbnailUrl });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Could not upload the cover image'));
    } finally {
      setUploading(false);
    }
  };

  if (value?.url) {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-[var(--color-border)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value.url} alt="Cover" className="h-44 w-full object-cover" />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
          onClick={() => onChange(null)}
          aria-label="Remove cover image"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/30 text-[var(--color-muted-foreground)] transition-colors hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-muted)]/50 disabled:opacity-60"
    >
      {uploading ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-medium">Uploading…</span>
        </>
      ) : (
        <>
          <ImagePlus className="h-6 w-6" />
          <span className="text-sm font-medium">Click to upload a cover image</span>
          <span className="text-xs">PNG, JPG up to 10MB</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = '';
        }}
      />
    </button>
  );
}
