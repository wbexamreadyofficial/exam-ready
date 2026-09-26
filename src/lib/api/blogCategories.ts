import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  BlogCategory,
  BlogCategoryListParams,
  BlogCategoryListResult,
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
} from '@/types/blogCategory';

interface BlogCategoryListResponse extends ApiResponse<{ categories: BlogCategory[] }> {
  pagination: BlogCategoryListResult['pagination'];
}

/** Wraps the backend's `/api/blog-categories` routes. */
export const blogCategoriesApi = {
  getCategories: async (params?: BlogCategoryListParams): Promise<BlogCategoryListResult> => {
    const { data } = await apiClient.get<BlogCategoryListResponse>('/blog-categories', { params });
    return { categories: data.data.categories, pagination: data.pagination };
  },

  getCategory: async (categoryId: string): Promise<BlogCategory> => {
    const { data } = await apiClient.get<ApiResponse<{ category: BlogCategory }>>(
      `/blog-categories/${categoryId}`
    );
    return data.data.category;
  },

  /** Admin only. */
  createCategory: async (payload: CreateBlogCategoryInput): Promise<BlogCategory> => {
    const { data } = await apiClient.post<ApiResponse<{ category: BlogCategory }>>(
      '/blog-categories',
      payload
    );
    return data.data.category;
  },

  /** Admin only. */
  updateCategory: async (categoryId: string, payload: UpdateBlogCategoryInput): Promise<BlogCategory> => {
    const { data } = await apiClient.patch<ApiResponse<{ category: BlogCategory }>>(
      `/blog-categories/${categoryId}`,
      payload
    );
    return data.data.category;
  },

  /** Admin only. Blocked while blogs still reference this category. */
  deleteCategory: async (categoryId: string): Promise<void> => {
    await apiClient.delete(`/blog-categories/${categoryId}`);
  },

  /** Admin only. Powers the blog form's "select existing or create a new one" combobox. */
  findOrCreateCategory: async (name: string): Promise<BlogCategory> => {
    const { data } = await apiClient.post<ApiResponse<{ category: BlogCategory }>>(
      '/blog-categories/find-or-create',
      { name }
    );
    return data.data.category;
  },
};
