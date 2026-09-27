import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

export type DeploymentProject = 'frontend' | 'backend';

export type DeploymentState = 'QUEUED' | 'BUILDING' | 'INITIALIZING' | 'READY' | 'ERROR' | 'CANCELED' | string;

export interface DeploymentCommit {
  message: string;
  sha: string;
  authorName: string;
}

export interface Deployment {
  id: string;
  url: string;
  state: DeploymentState;
  target: string | null;
  createdAt: string;
  readyAt: string | null;
  commit: DeploymentCommit | null;
}

export interface DeploymentLogLine {
  type: string;
  createdAt: string;
  text: string;
}

const BASE = '/admin/vercel';

const unwrap = async <T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> => (await request).data.data;

/** Wraps the backend's `/api/admin/vercel` routes (a thin proxy over the Vercel API). */
export const deploymentsApi = {
  list: (project: DeploymentProject, limit = 10) =>
    unwrap<{ deployments: Deployment[] }>(apiClient.get(`${BASE}/deployments`, { params: { project, limit } })).then(
      (data) => data.deployments,
    ),

  get: (deploymentId: string) =>
    unwrap<{ deployment: Deployment }>(apiClient.get(`${BASE}/deployments/${deploymentId}`)).then((data) => data.deployment),

  logs: (deploymentId: string, limit = 300) =>
    unwrap<{ logs: DeploymentLogLine[] }>(
      apiClient.get(`${BASE}/deployments/${deploymentId}/logs`, { params: { limit } }),
    ).then((data) => data.logs),

  redeploy: (project: DeploymentProject, deploymentId: string) =>
    unwrap<{ deployment: Deployment }>(
      apiClient.post(`${BASE}/deployments/${deploymentId}/redeploy`, {}, { params: { project } }),
    ).then((data) => data.deployment),
};

export const ACTIVE_DEPLOYMENT_STATES = new Set(['QUEUED', 'BUILDING', 'INITIALIZING']);
