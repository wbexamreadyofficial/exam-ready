import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type { BlogComment, BlogCommentListParams, BlogCommentListResult, BlogCommentStatus } from '@/types/blogComment';

interface BlogCommentListResponse extends ApiResponse<{ comments: BlogComment[] }> {
  pagination: BlogCommentListResult['pagination'];
}

/** Wraps the backend's `/api/blog-comments` routes. */
export const blogCommentsApi = {
  /** Admin only — moderation queue, top-level comments with a `replyCount`. */
  getComments: async (params?: BlogCommentListParams): Promise<BlogCommentListResult> => {
    const { data } = await apiClient.get<BlogCommentListResponse>('/blog-comments', { params });
    return { comments: data.data.comments, pagination: data.pagination };
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
