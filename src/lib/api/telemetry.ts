import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

export interface TelemetrySnapshot {
  app: {
    env: string;
    nodeVersion: string;
    pid: number;
    uptimeSeconds: number;
    startedAt: string;
  };
  host: {
    hostname: string;
    platform: string;
    arch: string;
    cpuCount: number;
    loadAverage: [number, number, number];
    totalMemoryBytes: number;
    freeMemoryBytes: number;
  };
  process: {
    memory: {
      rssBytes: number;
      heapUsedBytes: number;
      heapTotalBytes: number;
      externalBytes: number;
    };
    cpuUsage: { user: number; system: number };
  };
  database: {
    state: 'connected' | 'disconnected' | 'connecting' | 'disconnecting' | 'unknown';
    readyState: number;
    name: string | null;
    host: string | null;
    modelCount: number;
    models: string[];
  };
  realtime: {
    path: string;
    activeConnections: number;
  };
  jobs: {
    name: string;
    started: boolean;
    running: boolean;
    intervalMs: number;
    lastRunAt: string | null;
    lastSubmittedCount: number;
  }[];
  dependencies: {
    node: string;
    express: string;
    mongoose: string;
    typescript: string;
  };
  modules: {
    routes: number;
    controllers: number;
    services: number;
    models: number;
    jobs: number;
  };
  architecture: {
    name: string;
    role: string;
    detail: string;
    icon: string;
  }[];
}

export const telemetryApi = {
  /** GET /api/admin/telemetry — live process/DB/background-job health snapshot. */
  get: async (): Promise<TelemetrySnapshot> => {
    const { data } = await apiClient.get<ApiResponse<{ telemetry: TelemetrySnapshot }>>(
      '/admin/telemetry'
    );
    return data.data.telemetry;
  },
};
