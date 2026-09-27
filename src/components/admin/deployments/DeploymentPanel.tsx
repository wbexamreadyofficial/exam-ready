'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ExternalLink, GitCommitHorizontal, Loader2, RefreshCw, RotateCw, type LucideIcon } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ACTIVE_DEPLOYMENT_STATES,
  deploymentsApi,
  type Deployment,
  type DeploymentProject,
} from '@/lib/api/deployments';
import { getErrorMessage } from '@/lib/api/errors';
import { timeAgo } from '@/lib/userFormat';
import { cn } from '@/lib/utils';

const STATE_BADGE: Record<string, NonNullable<BadgeProps['variant']>> = {
  READY: 'success',
  BUILDING: 'warning',
  QUEUED: 'warning',
  INITIALIZING: 'warning',
  ERROR: 'destructive',
  CANCELED: 'outline',
};

interface DeploymentPanelProps {
  project: DeploymentProject;
  label: string;
  icon: LucideIcon;
}

export function DeploymentPanel({ project, label, icon: Icon }: DeploymentPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data: deployments,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchList,
  } = useQuery({
    queryKey: ['admin', 'vercel', 'deployments', project],
    queryFn: () => deploymentsApi.list(project, 10),
    refetchInterval: 10_000,
  });

  const latest = deployments?.[0] ?? null;
  const activeId = selectedId ?? latest?.id ?? null;
  const selected = deployments?.find((d) => d.id === activeId) ?? latest;
  const isActive = selected ? ACTIVE_DEPLOYMENT_STATES.has(selected.state) : false;

  const {
    data: logs,
    isLoading: logsLoading,
    isError: logsError,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ['admin', 'vercel', 'logs', activeId],
    queryFn: () => deploymentsApi.logs(activeId as string),
    enabled: Boolean(activeId),
    refetchInterval: isActive ? 3_000 : false,
  });

  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [logs]);

    const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const redeployMutation = useMutation({
    mutationFn: () => deploymentsApi.redeploy(project, selected!.id),
    onSuccess: (deployment) => {
      toast.success('Redeploy triggered');
      setSelectedId(deployment.id);
      setConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'vercel', 'deployments', project] });
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not trigger the redeploy')),
  });


  const notConfigured = listError;

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              {label}
              {isActive && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              )}
            </CardTitle>
            <CardDescription>Recent Vercel deployments</CardDescription>
          </div>
        </div>
                <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={!selected || isActive}
            onClick={() => setConfirmOpen(true)}
          >
            <RotateCw className="h-3.5 w-3.5" /> Redeploy
          </Button>
          <button
            type="button"
            onClick={() => {
              refetchList();
              refetchLogs();
            }}
            aria-label="Refresh"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-colors hover:bg-orange-50 hover:text-[#e2691f] dark:hover:bg-orange-500/10"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {listLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        ) : notConfigured ? (
          <ErrorState
            title="Not connected"
            message="Could not load Vercel deployments — check VERCEL_TOKEN on the backend."
            onRetry={() => refetchList()}
            className="py-8"
          />
        ) : !deployments || deployments.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">No deployments found for this project.</p>
        ) : (
          <>
            {/* Recent deployments list */}
            <div className="space-y-1.5">
              {deployments.map((deployment) => (
                <DeploymentRow
                  key={deployment.id}
                  deployment={deployment}
                  active={deployment.id === activeId}
                  onSelect={() => setSelectedId(deployment.id)}
                />
              ))}
            </div>

            {/* Log viewer for the selected deployment */}
            {selected && (
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                  <span>Logs — {selected.id.slice(0, 12)}</span>
                  <a
                    href={`https://${selected.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#e2691f] hover:underline"
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div
                  ref={logRef}
                  className="h-64 overflow-y-auto rounded-xl bg-slate-950 p-3 font-mono text-[11.5px] leading-relaxed text-slate-200"
                >
                  {logsLoading ? (
                    <p className="text-slate-500">Loading logs…</p>
                  ) : logsError ? (
                    <p className="text-red-400">Could not load logs.</p>
                  ) : !logs || logs.length === 0 ? (
                    <p className="text-slate-500">No log lines yet.</p>
                  ) : (
                    logs.map((line, index) => (
                      <div key={index} className="whitespace-pre-wrap break-all">
                        <span className="mr-2 text-slate-600">{new Date(line.createdAt).toLocaleTimeString()}</span>
                        {line.text}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
            <Dialog open={confirmOpen} onOpenChange={(open) => !redeployMutation.isPending && setConfirmOpen(open)}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Redeploy {label}?</DialogTitle>
            <DialogDescription>
              This triggers a real production build on Vercel from this deployment&apos;s exact source
              {selected?.commit ? <> (commit &quot;{selected.commit.message.split('\n')[0]}&quot;)</> : null}. It will go live once it finishes building.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} disabled={redeployMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="button"
              className="gap-2"
              disabled={redeployMutation.isPending}
              onClick={() => redeployMutation.mutate()}
            >
              {redeployMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Yes, redeploy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function DeploymentRow({
  deployment,
  active,
  onSelect,
}: {
  deployment: Deployment;
  active: boolean;
  onSelect: () => void;
}) {
  const badgeVariant = STATE_BADGE[deployment.state] ?? 'outline';
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
        active ? 'border-orange-300 bg-orange-50/70 dark:border-orange-400/40 dark:bg-orange-500/10' : 'border-[var(--color-border)] hover:bg-[var(--color-muted)]',
      )}
    >
      <Badge variant={badgeVariant} className="shrink-0 capitalize">
        {deployment.state.toLowerCase()}
      </Badge>
      <div className="min-w-0 flex-1">
        {deployment.commit ? (
          <p className="flex items-center gap-1.5 truncate text-[13px] font-semibold">
            <GitCommitHorizontal className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted-foreground)]" />
            {deployment.commit.message.split('\n')[0]}
          </p>
        ) : (
          <p className="truncate text-[13px] font-semibold text-[var(--color-muted-foreground)]">No commit info</p>
        )}
        <p className="text-xs text-[var(--color-muted-foreground)]">
          {deployment.commit?.authorName ?? '—'} · {timeAgo(deployment.createdAt)}
          {deployment.target && ` · ${deployment.target}`}
        </p>
      </div>
    </button>
  );
}
