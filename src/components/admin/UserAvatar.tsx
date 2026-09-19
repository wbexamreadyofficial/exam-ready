'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, generateInitials } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  src?: string;
  className?: string;
  fallbackClassName?: string;
}

/** Profile photo when there is one, otherwise the orange initials badge. */
export function UserAvatar({ name, src, className, fallbackClassName }: UserAvatarProps) {
  return (
    <Avatar className={cn('shrink-0 ring-1 ring-inset ring-white/25', className)}>
      {src && <AvatarImage src={src} alt={name} className="object-cover" />}
      <AvatarFallback
        className={cn(
          'bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-bold text-white',
          fallbackClassName
        )}
      >
        {generateInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
