/** Mirrors the backend's BlogCategory model (exam-ready-backend-node/src/models/blog-category.model.ts). */
export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  /** Number of blogs currently filed under this category (list endpoint only). */
  blogCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogCategoryInput {
  name: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export type UpdateBlogCategoryInput = Partial<CreateBlogCategoryInput>;

export type BlogCategorySortField = 'name' | 'isActive' | 'displayOrder' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface BlogCategoryListParams {
  search?: string;
  isActive?: boolean;
  sortBy?: BlogCategorySortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogCategoryListResult {
  categories: BlogCategory[];
  pagination: PaginationMeta;
}
