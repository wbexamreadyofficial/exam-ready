import { Skeleton } from './skeleton';

/** Page-content placeholder: title row, stat cards, and a table card. */
export function ContentSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>

      <div className="rounded-xl border border-[var(--color-border)] p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

/** Full admin shell (sidebar + topbar + content) shown while auth resolves. */
export function AdminLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]" aria-busy="true" aria-label="Loading">
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-60 flex-col lg:flex border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)]">
        <div className="flex h-16 items-center gap-2 border-b border-[var(--color-sidebar-border)] px-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex flex-1 flex-col gap-2 px-2 py-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 px-3 py-2.5">
              <Skeleton className="h-5 w-5 shrink-0" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-sidebar-border)] p-2">
          <Skeleton className="h-9 w-full" />
        </div>
      </aside>

      <header className="fixed right-0 top-0 z-20 flex h-16 items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 left-0 lg:left-60">
        <div className="flex-1" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="hidden h-4 w-24 sm:block" />
        </div>
      </header>

      <div className="pt-16 lg:ml-60">
        <main className="p-6">
          <ContentSkeleton />
        </main>
      </div>
    </div>
  );
}

/** Generic page shell (top nav + content) for non-admin roles. */
export function AppLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]" aria-busy="true" aria-label="Loading">
      <header className="flex h-16 items-center gap-4 border-b border-[var(--color-border)] px-6">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-5 w-28" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </header>
      <main className="mx-auto max-w-6xl p-6">
        <ContentSkeleton />
      </main>
    </div>
  );
}
