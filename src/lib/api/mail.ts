import { apiClient } from './client';

/**
 * Calls the backend's admin mail API (`/api/admin/mail/*` in the
 * `exam-ready-node` project) through the shared client, which attaches the
 * admin's bearer token. Server code lives there, not in this app.
 */
const BASE = '/admin/mail';

export interface MailTemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'url';
  placeholder?: string;
  defaultValue?: string;
}

export interface MailTemplateInfo {
  id: string;
  label: string;
  description: string;
  subject: string;
  variables: MailTemplateVariable[];
}

/** Free-form mail — payload of `mailApi.send` when `mode: 'plain'`. */
export interface SendPlainMailPayload {
  mode: 'plain';
  to: string;
  subject: string;
  body: string;
}

/** Template mail — payload of `mailApi.send` when `mode: 'template'`. */
export interface SendTemplateMailPayload {
  mode: 'template';
  to: string;
  templateId: string;
  /** keyword -> value, e.g. `{ name: 'Rahul', examName: 'WB SI' }` */
  variables: Record<string, string>;
  /** Optional replacement for the template's default subject. */
  subject?: string;
}

export type SendMailPayload = SendPlainMailPayload | SendTemplateMailPayload;

export interface PreviewMailPayload {
  templateId: string;
  variables: Record<string, string>;
  subject?: string;
}

export const mailApi = {
  templates: async (): Promise<MailTemplateInfo[]> => {
    const { data } = await apiClient.get<{ data: { templates: MailTemplateInfo[] } }>(`${BASE}/templates`);
    return data.data.templates;
  },

  preview: async (payload: PreviewMailPayload): Promise<{ subject: string; html: string }> => {
    const { data } = await apiClient.post<{ data: { subject: string; html: string } }>(`${BASE}/preview`, payload);
    return data.data;
  },

  send: async (payload: SendMailPayload): Promise<void> => {
    await apiClient.post(`${BASE}/send`, payload);
  },
};
