'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { mediaApi } from '@/lib/api/media';
import { usersApi } from '@/lib/api/users';
import { useAuthStore } from '@/store/authStore';

const MAX_PHOTO_MB = 5;

/** The signed-in user's full profile (shares the ['profile'] cache with the student profile page). */
export function useAdminProfile() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getMe,
    enabled: !!user,
    staleTime: 60_000,
  });

  const fail = (err: unknown, fallback: string) => {
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;
    toast.error(message);
  };

  const uploadPhoto = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_PHOTO_MB} MB.`);
      return;
    }

    setUploading(true);
    try {
      const media = await mediaApi.upload(file, '/avatars');
      const updated = await usersApi.updateProfile({ profilePhoto: media.url });
      queryClient.setQueryData(['profile'], updated);
      toast.success('Profile photo updated.');
    } catch (err) {
      fail(err, 'Could not upload the photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    setUploading(true);
    try {
      const updated = await usersApi.updateProfile({ profilePhoto: null });
      queryClient.setQueryData(['profile'], updated);
      toast.success('Profile photo removed.');
    } catch (err) {
      fail(err, 'Could not remove the photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return {
    profile: query.data,
    photoUrl: query.data?.profilePhoto || undefined,
    uploading,
    uploadPhoto,
    removePhoto,
  };
}
