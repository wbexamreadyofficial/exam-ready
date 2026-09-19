/** Mirrors the backend's Category model (exam-ready-backend-node/src/models/category.model.ts). */
export interface Category {
  _id: string;
  name: string;
  slug: string;
  fullForm?: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  fullForm?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type CategorySortField = 'name' | 'isActive' | 'displayOrder' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface CategoryListParams {
  search?: string;
  isActive?: boolean;
  sortBy?: CategorySortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface CategoryListResult {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
