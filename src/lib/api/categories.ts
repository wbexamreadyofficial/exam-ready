import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  Category,
  CategoryListParams,
  CategoryListResult,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/category';

interface CategoryListResponse extends ApiResponse<{ categories: Category[] }> {
  pagination: CategoryListResult['pagination'];
}

/** Wraps the backend's `/api/categories` routes (exam-ready-backend-node/src/routes/category.routes.ts). */
export const categoriesApi = {
  /** Search, filter, sort, and pagination all happen server-side. */
  getCategories: async (params?: CategoryListParams): Promise<CategoryListResult> => {
    const { data } = await apiClient.get<CategoryListResponse>('/categories', { params });
    return { categories: data.data.categories, pagination: data.pagination };
  },

  getCategory: async (categoryId: string): Promise<Category> => {
    const { data } = await apiClient.get<ApiResponse<{ category: Category }>>(
      `/categories/${categoryId}`
    );
    return data.data.category;
  },

  /** Admin only. */
  createCategory: async (payload: CreateCategoryInput): Promise<Category> => {
    const { data } = await apiClient.post<ApiResponse<{ category: Category }>>(
      '/categories',
      payload
    );
    return data.data.category;
  },

  /** Admin only. */
  updateCategory: async (categoryId: string, payload: UpdateCategoryInput): Promise<Category> => {
    const { data } = await apiClient.patch<ApiResponse<{ category: Category }>>(
      `/categories/${categoryId}`,
      payload
    );
    return data.data.category;
  },

  /** Admin only. */
  deleteCategory: async (categoryId: string): Promise<void> => {
    await apiClient.delete(`/categories/${categoryId}`);
  },
};
