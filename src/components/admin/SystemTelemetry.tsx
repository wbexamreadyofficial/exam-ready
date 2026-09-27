'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Boxes,
  Clock,
  Cpu,
  Database,
  HardDrive,
  Image as ImageIcon,
  Layers,
  Package,
  Radio,
  RefreshCw,
  Server,
  Shield,
  Timer,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { telemetryApi } from '@/lib/api/telemetry';
import { timeAgo } from '@/lib/userFormat';

const REFRESH_MS = 15_000;

const ARCHITECTURE_ICONS: Record<string, LucideIcon> = {
  server: Server,
  database: Database,
  radio: Radio,
  image: ImageIcon,
  shield: Shield,
  clock: Clock,
};

const ARCHITECTURE_TONE: Record<string, string> = {
  server: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  database: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  radio: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  image: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  shield: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  clock: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const MODULE_ICONS: Record<string, LucideIcon> = {
  routes: Layers,
  controllers: Boxes,
  services: Package,
  models: Database,
  jobs: Clock,
};

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const DB_STATE_BADGE: Record<string, 'success' | 'destructive' | 'warning' | 'outline'> = {
  connected: 'success',
  connecting: 'warning',
  disconnecting: 'warning',
  disconnected: 'destructive',
  unknown: 'outline',
};

const DB_STATE_DOT: Record<string, string> = {
  connected: 'bg-emerald-500',
  connecting: 'bg-amber-500',
  disconnecting: 'bg-amber-500',
  disconnected: 'bg-rose-500',
  unknown: 'bg-slate-400',
};

/** A stat tile with a colored icon chip — the visual unit repeated across
 *  this panel (process, host, DB, realtime) so every metric reads the same way. */
function StatTile({
  icon: Icon,
  tone,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  tone: string;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          {label}
        </p>
      </div>
      <p className="mt-2.5 truncate text-lg font-black leading-tight">{value}</p>
      {sub && <p className="mt-0.5 truncate text-xs text-[var(--color-muted-foreground)]">{sub}</p>}
    </div>
  );
}

export function SystemTelemetry() {
  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['admin-telemetry'],
    queryFn: () => telemetryApi.get(),
    refetchInterval: REFRESH_MS,
  });

  return (
    <Card className="overflow-hidden border-orange-200/60 dark:border-orange-500/20">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--color-border)] bg-gradient-to-r from-orange-50/80 via-white to-transparent dark:from-orange-500/10 dark:via-transparent">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              System Telemetry
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </CardTitle>
            <CardDescription>
              Live snapshot of the running process, database connection, and background jobs
            </CardDescription>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label="Refresh telemetry"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] shadow-sm transition-colors hover:bg-orange-50 hover:text-[#e2691f] disabled:opacity-60 dark:hover:bg-orange-500/10"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        {isLoading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState message="Could not load telemetry." onRetry={() => refetch()} className="py-8" />
        )}

        {data && (
          <>
            {/* Process / app */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                icon={Server}
                tone="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                label="Environment"
                value={<span className="capitalize">{data.app.env}</span>}
                sub={`Node ${data.app.nodeVersion} · PID ${data.app.pid}`}
              />
              <StatTile
                icon={Timer}
                tone="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                label="Uptime"
                value={formatUptime(data.app.uptimeSeconds)}
                sub={`since ${timeAgo(data.app.startedAt)}`}
              />
              <StatTile
                icon={Database}
                tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                label="MongoDB"
                value={
                  <span className="flex items-center gap-2 text-base">
                    <span className={`h-2 w-2 rounded-full ${DB_STATE_DOT[data.database.state] ?? 'bg-slate-400'}`} />
                    <Badge variant={DB_STATE_BADGE[data.database.state] ?? 'outline'} className="capitalize">
                      {data.database.state}
                    </Badge>
                  </span>
                }
                sub={`${data.database.name ?? '—'} @ ${data.database.host ?? '—'} · ${data.database.modelCount} models`}
              />
              <StatTile
                icon={Wifi}
                tone="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                label="Realtime (WS)"
                value={`${data.realtime.activeConnections} online`}
                sub={<span className="font-mono">{data.realtime.path}</span>}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatTile
                icon={Cpu}
                tone="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                label="Host"
                value={data.host.hostname}
                sub={`${data.host.platform}/${data.host.arch} · ${data.host.cpuCount} cores`}
              />
              <StatTile
                icon={Activity}
                tone="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                label="Load Average"
                value={data.host.loadAverage.map((n) => n.toFixed(2)).join(' / ')}
                sub="1m / 5m / 15m"
              />
            </div>

            {/* Memory */}
            <div className="grid gap-4 rounded-xl border border-[var(--color-border)] p-4 sm:grid-cols-2">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5" /> Process memory</span>
                  <span className="text-[var(--color-muted-foreground)]">
                    {formatBytes(data.process.memory.heapUsedBytes)} / {formatBytes(data.process.memory.heapTotalBytes)} heap
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-[width] duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((data.process.memory.heapUsedBytes / data.process.memory.heapTotalBytes) * 100))}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  RSS {formatBytes(data.process.memory.rssBytes)} · External {formatBytes(data.process.memory.externalBytes)}
                </p>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5" /> Host memory</span>
                  <span className="text-[var(--color-muted-foreground)]">
                    {formatBytes(data.host.totalMemoryBytes - data.host.freeMemoryBytes)} / {formatBytes(data.host.totalMemoryBytes)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-[width] duration-500"
                    style={{
                      width: `${Math.min(100, Math.round(((data.host.totalMemoryBytes - data.host.freeMemoryBytes) / data.host.totalMemoryBytes) * 100))}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  {formatBytes(data.host.freeMemoryBytes)} free of {formatBytes(data.host.totalMemoryBytes)}
                </p>
              </div>
            </div>

            {/* Architecture */}
            <div>
              <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                <Layers className="h-3.5 w-3.5" /> Architecture
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.architecture.map((layer) => {
                  const Icon = ARCHITECTURE_ICONS[layer.icon] ?? Server;
                  const tone = ARCHITECTURE_TONE[layer.icon] ?? 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
                  return (
                    <div
                      key={layer.name}
                      className="flex gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold">{layer.name}</p>
                        <p className="text-xs font-semibold text-[var(--color-muted-foreground)]">{layer.role}</p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--color-muted-foreground)]">{layer.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Module counts + versions */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                  Modules on disk
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(data.modules).map(([key, count]) => {
                    const Icon = MODULE_ICONS[key] ?? Boxes;
                    return (
                      <div
                        key={key}
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-2.5 text-center shadow-sm"
                      >
                        <Icon className="mx-auto h-4 w-4 text-[#e2691f]" />
                        <p className="mt-1 text-sm font-black">{count}</p>
                        <p className="truncate text-[10px] capitalize text-[var(--color-muted-foreground)]">{key}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                  Dependency versions
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Node {data.dependencies.node}</Badge>
                  <Badge variant="outline">Express {data.dependencies.express}</Badge>
                  <Badge variant="outline">Mongoose {data.dependencies.mongoose}</Badge>
                  <Badge variant="outline">TypeScript {data.dependencies.typescript}</Badge>
                </div>
                {data.database.models.length > 0 && (
                  <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-muted-foreground)]">
                    <span className="font-semibold">{data.database.modelCount} Mongoose models: </span>
                    {data.database.models.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Background jobs */}
            <div>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Background jobs
              </p>
              <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-xl border border-[var(--color-border)]">
                {data.jobs.map((job) => (
                  <div key={job.name} className="flex items-center justify-between gap-3 bg-[var(--color-card)] p-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-[#e2691f]">
                        <Clock className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold">{job.name}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          every {Math.round(job.intervalMs / 1000)}s
                          {job.lastRunAt && <> · last ran {timeAgo(job.lastRunAt)}</>}
                          {job.lastSubmittedCount > 0 && <> · {job.lastSubmittedCount} processed</>}
                        </p>
                      </div>
                    </div>
                    <Badge variant={job.running ? 'warning' : job.started ? 'success' : 'outline'} className="shrink-0">
                      {job.running ? 'Running' : job.started ? 'Idle' : 'Stopped'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-right text-[11px] text-[var(--color-muted-foreground)]">
              Refreshes every {REFRESH_MS / 1000}s · last updated {dataUpdatedAt ? timeAgo(new Date(dataUpdatedAt).toISOString()) : '—'}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
