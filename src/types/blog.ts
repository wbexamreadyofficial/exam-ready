import type { PaginationMeta } from './blogCategory';

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

export interface BlogCoverImage {
  fileId?: string;
  url: string;
  thumbnailUrl?: string;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface BlogCategoryRef {
  _id: string;
  name: string;
  slug: string;
}

export interface BlogAuthorRef {
  _id: string;
  fullName?: string;
  profilePhoto?: string;
  email?: string;
}

/** Mirrors the backend's Blog model (exam-ready-backend-node/src/models/blog.model.ts). */
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: BlogCoverImage;
  category: BlogCategoryRef | string;
  tags: string[];
  author?: BlogAuthorRef | string;
  authorLabel: string;
  status: BlogStatus;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  seo?: BlogSeo;
  readingTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: BlogCoverImage;
  category: string;
  tags?: string[];
  author?: string;
  authorLabel: string;
  status?: BlogStatus;
  scheduledAt?: string;
  seo?: BlogSeo;
  isFeatured?: boolean;
  displayOrder?: number;
}

export type UpdateBlogInput = Partial<CreateBlogInput> & { coverImage?: BlogCoverImage | null };

export type BlogSortField =
  | 'title'
  | 'status'
  | 'publishedAt'
  | 'createdAt'
  | 'viewCount'
  | 'likeCount'
  | 'commentCount'
  | 'displayOrder';

export interface BlogListParams {
  search?: string;
  category?: string;
  status?: BlogStatus;
  isActive?: boolean;
  isFeatured?: boolean;
  tag?: string;
  author?: string;
  sortBy?: BlogSortField;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BlogListResult {
  blogs: Blog[];
  pagination: PaginationMeta;
}

export interface BlogLikeEntry {
  _id: string;
  user: { _id: string; fullName?: string; profilePhoto?: string } | string;
  createdAt: string;
}

export interface BlogLikeListResult {
  likes: BlogLikeEntry[];
  pagination: PaginationMeta;
}

export interface ToggleBlogLikeResult {
  liked: boolean;
  likeCount: number;
}
