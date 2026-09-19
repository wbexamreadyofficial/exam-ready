'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Badge } from '@/components/ui/badge';
import { usersApi } from '@/lib/api/users';
import { generateInitials } from '@/lib/utils';
import type { UserSuggestion } from '@/types/user';

const ROLE_LABEL = { admin: 'Admin', examiner: 'Examiner', partner: 'Partner', student: 'Student' } as const;

const nameOf = (user: UserSuggestion) => user.fullName || user.email || user.mobileNumber || 'Unnamed user';

/** Bolds the part of `text` that matches what the admin typed. */
function Highlight({ text, query }: { text: string; query: string }) {
  const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (index < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <span className="font-bold text-[var(--color-cta)]">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  );
}

function UserAvatar({ user }: { user: UserSuggestion }) {
  return (
    <Avatar className="h-8 w-8 shrink-0">
      {user.profilePhoto && <AvatarImage src={user.profilePhoto} alt="" />}
      <AvatarFallback className="text-[10px]">{generateInitials(nameOf(user))}</AvatarFallback>
    </Avatar>
  );
}

interface UserAutocompleteProps {
  /** Free text typed into the box (also used as a plain text search). */
  inputValue: string;
  onInputChange: (value: string) => void;
  /** The user picked from the suggestions. */
  selected: UserSuggestion | null;
  onSelect: (user: UserSuggestion | null) => void;
  className?: string;
}

/** Admin user search box with a 10-suggestion dropdown (GET /api/users/autocomplete). */
export function UserAutocomplete({ inputValue, onInputChange, selected, onSelect, className }: UserAutocompleteProps) {
  return (
    <Autocomplete<UserSuggestion>
      className={className}
      queryKey="users"
      fetchOptions={(query) => usersApi.autocompleteUsers(query)}
      getOptionKey={(user) => user._id}
      inputValue={inputValue}
      onInputChange={onInputChange}
      selected={selected}
      onSelect={onSelect}
      placeholder="Search by name, email, or mobile..."
      ariaLabel="Search users"
      heading={(query) => (query ? 'Matching users' : 'Recent users')}
      emptyLabel="No users found"
      renderOption={(user, { query }) => (
        <div className="flex items-center gap-2.5">
          <UserAvatar user={user} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">
              <Highlight text={nameOf(user)} query={query} />
            </p>
            <p className="truncate text-xs text-[var(--color-muted-foreground)]">
              {user.email ? <Highlight text={user.email} query={query} /> : '—'}
              {user.mobileNumber && (
                <>
                  {' · '}
                  <Highlight text={user.mobileNumber} query={query} />
                </>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {user.isActive === false && (
              <Badge variant="destructive" className="text-[9px]">
                INACTIVE
              </Badge>
            )}
            {user.role && (
              <Badge variant="secondary" className="text-[9px]">
                {ROLE_LABEL[user.role]}
              </Badge>
            )}
          </div>
        </div>
      )}
      renderSelected={(user) => (
        <div className="flex items-center gap-2">
          <UserAvatar user={user} />
          <span className="truncate text-sm font-semibold">{nameOf(user)}</span>
          {user.email && <span className="hidden truncate text-xs text-[var(--color-muted-foreground)] sm:inline">{user.email}</span>}
        </div>
      )}
    />
  );
}
