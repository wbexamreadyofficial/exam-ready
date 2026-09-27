import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type { BlogComment, BlogCommentListParams, BlogCommentListResult, BlogCommentStatus } from '@/types/blogComment';

interface BlogCommentListResponse extends ApiResponse<{ comments: BlogComment[] }> {
  pagination: BlogCommentListResult['pagination'];
}

export interface CreateBlogCommentInput {
  blog: string;
  content: string;
  parentComment?: string;
}

/** Wraps the backend's `/api/blog-comments` routes. */
export const blogCommentsApi = {
  /** Top-level comments with a `replyCount`. Pass `{ blog, status: 'APPROVED' }`
   *  for the public storefront view (works signed out); the admin moderation
   *  queue calls this with other statuses while signed in. */
  getComments: async (params?: BlogCommentListParams): Promise<BlogCommentListResult> => {
    const { data } = await apiClient.get<BlogCommentListResponse>('/blog-comments', { params });
    return { comments: data.data.comments, pagination: data.pagination };
  },

  /** Post a top-level comment or a reply. Requires sign-in. */
  createComment: async (payload: CreateBlogCommentInput): Promise<BlogComment> => {
    const { data } = await apiClient.post<ApiResponse<{ comment: BlogComment }>>('/blog-comments', payload);
    return data.data.comment;
  },

  /** Admin only. */
  getReplies: async (commentId: string): Promise<BlogComment[]> => {
    const { data } = await apiClient.get<ApiResponse<{ replies: BlogComment[] }>>(
      `/blog-comments/${commentId}/replies`
    );
    return data.data.replies;
  },

  /** Admin only. */
  updateStatus: async (commentId: string, status: BlogCommentStatus): Promise<BlogComment> => {
    const { data } = await apiClient.patch<ApiResponse<{ comment: BlogComment }>>(
      `/blog-comments/${commentId}/status`,
      { status }
    );
    return data.data.comment;
  },

  /** Admin (or the comment's own author). Soft delete. */
  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/blog-comments/${commentId}`);
  },
};
