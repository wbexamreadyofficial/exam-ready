import type { PaginationMeta } from './blogCategory';

export type BlogCommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';

export interface BlogCommentBlogRef {
  _id: string;
  title: string;
  slug: string;
  coverImage?: { url: string };
}

/** Mirrors the backend's BlogComment model (exam-ready-backend-node/src/models/blog-comment.model.ts). */
export interface BlogComment {
  _id: string;
  blog: BlogCommentBlogRef | string;
  user: string;
  userSnapshot?: { fullName?: string; profilePhoto?: string };
  content: string;
  parentComment: string | null;
  status: BlogCommentStatus;
  likeCount: number;
  reportCount: number;
  isEdited: boolean;
  isActive: boolean;
  deletedBy?: 'user' | 'admin' | null;
  /** Present on the top-level list — how many replies this comment has. */
  replyCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCommentListParams {
  blog?: string;
  status?: BlogCommentStatus;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BlogCommentListResult {
  comments: BlogComment[];
  pagination: PaginationMeta;
}
