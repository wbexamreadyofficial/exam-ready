import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  ContactListParams,
  ContactListResult,
  ContactMessage,
  ContactStatus,
  ContactSubmission,
} from '@/types/contact';
import type { PaginationMeta } from '@/types/user';

interface ContactListResponse extends ApiResponse<{ contacts: ContactMessage[] }> {
  pagination: PaginationMeta;
}

export const contactsApi = {
  submit: async (input: ContactSubmission): Promise<void> => {
    await apiClient.post('/contacts', input);
  },

  list: async (params?: ContactListParams): Promise<ContactListResult> => {
    const { data } = await apiClient.get<ContactListResponse>('/admin/contacts', { params });
    return { contacts: data.data.contacts, pagination: data.pagination };
  },

  get: async (contactId: string): Promise<ContactMessage> => {
    const { data } = await apiClient.get<ApiResponse<{ contact: ContactMessage }>>(
      `/admin/contacts/${contactId}`
    );
    return data.data.contact;
  },

  updateStatus: async (contactId: string, status: ContactStatus): Promise<ContactMessage> => {
    const { data } = await apiClient.patch<ApiResponse<{ contact: ContactMessage }>>(
      `/admin/contacts/${contactId}/status`,
      { status }
    );
    return data.data.contact;
  },
};
