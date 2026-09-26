import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  Blog,
  BlogLikeListResult,
  BlogListParams,
  BlogListResult,
  CreateBlogInput,
  ToggleBlogLikeResult,
  UpdateBlogInput,
} from '@/types/blog';

interface BlogListResponse extends ApiResponse<{ blogs: Blog[] }> {
  pagination: BlogListResult['pagination'];
}

interface BlogLikeListResponse extends ApiResponse<{ likes: BlogLikeListResult['likes'] }> {
  pagination: BlogLikeListResult['pagination'];
}

/** Wraps the backend's `/api/blogs` routes. */
export const blogsApi = {
  getBlogs: async (params?: BlogListParams): Promise<BlogListResult> => {
    const { data } = await apiClient.get<BlogListResponse>('/blogs', { params });
    return { blogs: data.data.blogs, pagination: data.pagination };
  },

  getBlog: async (blogId: string): Promise<Blog> => {
    const { data } = await apiClient.get<ApiResponse<{ blog: Blog }>>(`/blogs/${blogId}`);
    return data.data.blog;
  },

  /** Admin only. */
  createBlog: async (payload: CreateBlogInput): Promise<Blog> => {
    const { data } = await apiClient.post<ApiResponse<{ blog: Blog }>>('/blogs', payload);
    return data.data.blog;
  },

  /** Admin only. */
  updateBlog: async (blogId: string, payload: UpdateBlogInput): Promise<Blog> => {
    const { data } = await apiClient.patch<ApiResponse<{ blog: Blog }>>(`/blogs/${blogId}`, payload);
    return data.data.blog;
  },

  /** Admin only. Soft delete — archives the blog, keeps its comments and likes. */
  deleteBlog: async (blogId: string): Promise<void> => {
    await apiClient.delete(`/blogs/${blogId}`);
  },

  toggleLike: async (blogId: string): Promise<ToggleBlogLikeResult> => {
    const { data } = await apiClient.post<ApiResponse<ToggleBlogLikeResult>>(`/blogs/${blogId}/like`);
    return data.data;
  },

  /** Admin only. */
  getLikes: async (blogId: string, params?: { page?: number; limit?: number }): Promise<BlogLikeListResult> => {
    const { data } = await apiClient.get<BlogLikeListResponse>(`/blogs/${blogId}/likes`, { params });
    return { likes: data.data.likes, pagination: data.pagination };
  },
};
