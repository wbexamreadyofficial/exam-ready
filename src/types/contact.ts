import type { PaginationMeta } from './user';

export type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactListParams {
  search?: string;
  status?: ContactStatus;
  page?: number;
  limit?: number;
}

export interface ContactListResult {
  contacts: ContactMessage[];
  pagination: PaginationMeta;
}
